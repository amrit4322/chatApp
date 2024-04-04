// socketManager.ts

import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import UserService from "../../modules/user/user.service";
import RabbitMq from "../rabbitmq/rabbitmq.helper";
import ChatService from "../../modules/chat/chat.service";
import { ChatInterface } from "../../interfaces";

interface UserData {
  socketId: string;
  status: boolean;
}

interface RoomTable {
  [room: string]: string[];
}

interface ConnectedUsers {
  [userId: string]: string;
}

class SocketManager {
  private io: SocketIOServer;
  public userStatus: { [userId: string]: UserData } = {};
  private roomTable: RoomTable = {};
  private connected: ConnectedUsers = {};

  constructor(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
      },
    });
    this.initializeSocket();
    this.handleConnection = this.handleConnection.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleGetNotification = this.handleGetNotification.bind(this);
    this.handleJoinRoom = this.handleJoinRoom.bind(this);
    this.handleSeenMessage = this.handleSeenMessage.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleIsConnectedWith = this.handleIsConnectedWith.bind(this);
    this.handleFetchAllConnection = this.handleFetchAllConnection.bind(this);
    this.handleFetchMessage = this.handleFetchMessage.bind(this);
    this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  private initializeSocket() {
    console.log("initalized")
    this.io.on("connection", this.handleConnection);
  }

  private handleConnection(socket: Socket) {
    console.log("A user connected: ", socket.id);
    socket.on("login", (id: string) => this.handleLogin(socket, id));
    socket.on("getNotification", (id: string) => this.handleGetNotification(socket, id));
    socket.on("join_room", (room: string) => this.handleJoinRoom(socket, room));
    socket.on("seen_msg", (senderId: string, receiverId: string) => this.handleSeenMessage(socket, senderId, receiverId));
    socket.on("message_send", (data: ChatInterface.ChatInterface, id: string) => this.handleSendMessage(socket, data, id));
    socket.on("is_connected_with", (receiverId: string) => this.handleIsConnectedWith(socket, receiverId));
    socket.on("fetchAllConnection", () => this.handleFetchAllConnection(socket));
    socket.on("fetch_message", (connectId: string) => this.handleFetchMessage(socket, connectId));
    socket.on("leave_room", (room: string, id: string) => this.handleLeaveRoom(socket, room, id));
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  private handleLogin(socket: Socket, id: string) {
    this.userStatus[id] = { socketId: socket.id, status: true };
    console.log("User logged in: ", id);
    this.updateStatus(id, true);
    this.broadcastStatus();
  }

  private updateStatus(id: string, status: boolean) {
    UserService.userStatus(id, status)
      .then(() => console.log(`User status updated: ${id}, Status: ${status}`))
      .catch((error) => console.error("Error updating user status:", error));
  }

  private broadcastStatus() {
    const onlineUsers = Object.entries(this.userStatus)
      .filter(([userId, data]) => data.status === true)
      .map(([userId]) => userId);
    this.io.emit("userStatusUpdate", onlineUsers);
    console.log("Online users: ", onlineUsers);
  }

  private handleGetNotification(socket: Socket, id: string) {
    ChatService.fetchNotification(id)
      .then((notification:any) => {
        if (notification.status) {
          socket.emit("notification", notification.data);
        }
      })
      .catch((error) => console.error("Error fetching notification:", error));
  }

  private handleJoinRoom(socket: Socket, room: string) {
    if (!this.roomTable[room]) {
      this.roomTable[room] = [];
    }
    const userId = this.getUserIdBySocketId(socket.id);
    if (userId && !this.roomTable[room].includes(userId)) {
      this.roomTable[room].push(userId);
    }
    socket.join(room);
    socket.to(room).emit("roomstatus", { data: "has joined the chat" });
  }

  private getUserIdBySocketId(socketId: string): string | undefined {
    return Object.entries(this.userStatus).find(([userId, data]) => data.socketId === socketId)?.[0];
  }

  private async handleSeenMessage(socket: Socket, senderId: string, receiverId: string) {
    try {
      await ChatService.seenMsg(senderId, receiverId);
      if (this.userStatus[senderId]?.socketId) {
        socket.to(this.userStatus[senderId].socketId).emit("message_seen");
      }
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  }

  private async handleSendMessage(socket: Socket, data: ChatInterface.ChatInterface, id: string) {
    const userID = this.getUserIdBySocketId(socket.id);
    if (userID) {
      const msg: ChatInterface.ChatInterface = {
        id: data.id,
        senderId: userID,
        receiverId: id,
        timestamp: data.timestamp,
        data: data.data,
        isFileMessage: data.isFileMessage,
        isImageMessage: data.isImageMessage,
        seen: false,
      };
      if (this.connected[id] === userID) {
        msg.seen = true;
        data.seen = true;
        socket.emit("message_seen");
      }
      if (this.userStatus[id]?.status) {
        const socketId = this.userStatus[id].socketId;
        socket.to(socketId).emit("message", data);
      }
      RabbitMq.sendToQueue("message_queue", msg);
    }
  }

  private handleIsConnectedWith(socket: Socket, receiverId: string) {
    const id = this.getUserIdBySocketId(socket.id);
    if (id) {
      this.connected[id] = receiverId;
    }
  }

  private async handleFetchAllConnection(socket: Socket) {
    const userId = this.getUserIdBySocketId(socket.id);
    if (userId) {
      try {
        const data = await ChatService.fetchAllConnection(userId);
        socket.emit("user_connect_data", data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    }
  }

  private async handleFetchMessage(socket: Socket, connectId: string) {
    const userId = this.getUserIdBySocketId(socket.id);
    if (userId && connectId) {
      try {
        const data = await ChatService.fetchMessages(userId, connectId);
        socket.emit("user_message_data", data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  }

  private handleLeaveRoom(socket: Socket, room: string, id: string) {
    socket.to(room).emit("roomstatus", { data: `${id} has left the chat` });
    socket.leave(room);
  }

  private handleDisconnect(socket: Socket) {
    console.log("User disconnected ", socket.id);
    const id = this.getUserIdBySocketId(socket.id);
    if (id) {
      this.userStatus[id] = { socketId: socket.id, status: false };
      this.updateStatus(id, false);
    }
    this.broadcastStatus();
  }

  public emitToSocket(socketId:string,event:string,data?:any){
    this.io.to(socketId).emit(event,data)

  }

  public emitToAll(event:string,data?:any){
    this.io.emit(event,data)

  }
  public getSocketInstance(): SocketIOServer {
    if (!this.io) {
      throw new Error("Socket not initialized. Call initializeSocket() first.");
    }
    return this.io;
  }
}

export default SocketManager;
