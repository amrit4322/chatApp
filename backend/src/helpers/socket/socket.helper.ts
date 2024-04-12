// import { Server } from "https";
import { Server } from "http";

import { Server as SocketIOServer, Socket } from "socket.io";
import UserService from "../../modules/user/user.service";
import RabbitMq from "../rabbitmq/rabbitmq.helper";
import { ChatInterface } from "../../interfaces";
import ChatService from "../../modules/chat/chat.service";

// Defining The queue

let io: SocketIOServer;
let socket: Socket;

interface UserData {
  socketId: string;
  status: boolean;
}

interface IceSignal {
  iceCandidate: any;
  iceUserId: string;
  didIOffer: boolean;
}
interface Offer {
  offererId: string;
  offer: any;
  offerIceCandidates: any[];
  answererUserName: any | null;
  answer: any | null;
  answererIceCandidates: any[];
}
let offers: Offer[] = [];

let userStatus: { [userId: string]: UserData } = {};
let roomTable: { [room: string]: string[] } = {};
let connected: { [userId: string]: string } = {};
const connectedCalls = new Map<string, string>();

//for inserting messages
function insertMessage(data: ChatInterface.ChatInterface) {
  RabbitMq.sendToQueue("message_queue", data);
}

async function setMessageSeen(senderId: string, receiverId: string) {
  try {
    await ChatService.seenMsg(senderId, receiverId);
  } catch (error) {
    console.log("error in seen", error);
  }
}
async function getNotification(
  id: string
): Promise<{ status: boolean; data?: any }> {
  try {
    let data = await ChatService.fetchNotification(id);

    return { status: true, data };
  } catch (error) {
    console.log("Error in FetchNotficiatiion", error);
    return { status: false };
  }
}

//for fetching messages
async function fetchMessage(userId: string, connectId: string) {
  const msg = await ChatService.fetchMessages(userId, connectId);

  return msg;
}
async function fetchContacts(id: string) {
  const msg = await ChatService.fetchAllConnection(id);

  return msg;
}

//for broadcasting online-offline status
function broadcastStatus() {
  const onlineUsers = Object.entries(userStatus)
    .filter(([userId, data]) => data.status === true)
    .map(([userId]) => userId);

  io.emit("userStatusUpdate", onlineUsers);
  console.log("online users ", userStatus);
}

//get userId by socketId
function getUserIdBySocketId(socketId: string): string | undefined {
  return Object.entries(userStatus).find(
    ([userId, data]) => data.socketId === socketId
  )?.[0];
}

//get updateStatus
async function updateStatus(id: string, status: boolean) {
  try {
    await UserService.userStatus(id, status);
  } catch (error) {}
}

function initializeSocket(server: Server): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  //on connection
  io.on("connection", (socket: Socket) => {
    console.log("A user connected: ", socket.id);

    //on login
    socket.on("login", (id: string) => {
      userStatus[id] = { socketId: socket.id, status: true };
      console.log("inaidw ", id);

      updateStatus(id, true);
      // socket.emit("status",{id,"status":"online"})
      broadcastStatus();
    });

    socket.on("getNotification", async (id: string) => {
      const notification = await getNotification(id);
      if (notification.status) {
        socket.emit("notification", notification.data);
      }
    });

    //on joining room
    socket.on("join_room", (room: any) => {
      console.log("room is ", room, socket.id);
      if (!roomTable[room]) {
        roomTable[room] = [];
      }
      let userId = getUserIdBySocketId(socket.id);
      // console.log(userId);
      if (userId && !roomTable[room].includes(userId)) {
        console.log("inside und");
        roomTable[room].push(userId);
      }
      console.log("roomTable ", roomTable);

      socket.join(room);
      socket.to(room).emit("roomstatus", { data: "has joined the chat" });
    });

    //get roomtable
    socket.on("get_room", () => {
      console.log("room table is ", roomTable);
      io.emit("room_data", roomTable);
    });

    //message seen
    socket.on("seen_msg", (senderId: string, receiverId: string) => {
      console.log("mesga ", senderId, "   DFSF          ", receiverId);
      setMessageSeen(senderId, receiverId);
      if (userStatus[senderId]?.socketId) {
        socket.to(userStatus[senderId].socketId).emit("message_seen");
      }
    });
    //on message sending
    socket.on("message_send", (data, id) => {
      const userID = getUserIdBySocketId(socket.id);
      if (userID) {
        const msg: ChatInterface.ChatInterface = {
          id: data.id,
          senderId: userID,
          receiverId: id,
          timestamp: data.timestamp,
          data: data.message,
          isFileMessage: data.isFileMessage,
          isImageMessage: data.isImageMessage,
          seen: false,
        };
        if (connected[id] === userID) {
          msg.seen = true;
          data.seen = true;
          console.log("inside seen ");
          io.to(socket.id).emit("message_seen");
        }
        if (userStatus[id]?.status) {
          const socketId = userStatus[id].socketId;
          socket.to(socketId).emit("message", data);
        }
        insertMessage(msg);
      } else {
        console.log("some other function");
      }
    });

    socket.on("is_connected_with", (receiverId: string) => {
      let id = getUserIdBySocketId(socket.id);
      console.log("connected with ", connected);
      if (id) {
        connected[id] = receiverId;
      }
    });

    socket.on("fetchAllConnection", async () => {
      const userId = getUserIdBySocketId(socket.id);
      if (userId) {
        console.log("tesing it 1");
        let data = await fetchContacts(userId);
        socket.emit("user_connect_data", data);
      } else {
        console.log("error in fetching message");
      }
    });
    //fetch message socket
    socket.on("fetch_message", async (connectId: string) => {
      const userId = getUserIdBySocketId(socket.id);
      console.log("tesing it user", userId, connectId);

      if (userId && connectId) {
        console.log("tesing it 1");
        let data = await fetchMessage(userId, connectId);
        socket.emit("user_message_data", data);
      } else {
        console.log("error in fetching message");
      }
    });

    //on leave room
    socket.on("leave_room", (room, id) => {
      socket.to(room).emit("roomstatus", { data: `${id} has left the chat` });
      socket.leave(room);
    });

    socket.on("connecting_video", (userTo: string,newOffer: any) => {
      console.log("starting connection video");
      const socketTO: string = userStatus[userTo]?.socketId;
      const userfrom = getUserIdBySocketId(socket.id);
      if (userfrom && userTo && socketTO && !connectedCalls.has(userTo)) {
        offers.push({
          offererId: userfrom,
          offer: newOffer,
          offerIceCandidates: [],
          answererUserName: null,
          answer: null,
          answererIceCandidates: [],
        });
        // console.log(newOffer.sdp.slice(50))
        //send out to all connected sockets EXCEPT the caller
        socket
          .to(socketTO)
          .emit("user_connect_request_video", userfrom, offers.slice(-1));
        // socket.broadcast.emit('newOfferAwaiting',offers.slice(-1))

        console.log("starting connection audio");
      } else {
        console.log("not Authenticated");
      }
    });
    socket.on("connecting_audio", (userTo: string, newOffer: any) => {
      const socketTO: string = userStatus[userTo]?.socketId;
      const userfrom = getUserIdBySocketId(socket.id);
      if (userfrom && userTo && socketTO && !connectedCalls.has(userTo)) {
        offers.push({
          offererId: userfrom,
          offer: newOffer,
          offerIceCandidates: [],
          answererUserName: null,
          answer: null,
          answererIceCandidates: [],
        });
        // console.log(newOffer.sdp.slice(50))
        //send out to all connected sockets EXCEPT the caller
        socket
          .to(socketTO)
          .emit("user_connect_request_audio", userfrom, offers.slice(-1));
        // socket.broadcast.emit('newOfferAwaiting',offers.slice(-1))

        console.log("starting connection audio");
      } else {
        console.log("not Authenticated");
      }
    });

    socket.on(
      "sendIceCandidateToSignalingServer",
      (iceCandidateObj: IceSignal) => {
        const { didIOffer, iceUserId, iceCandidate } = iceCandidateObj;
        // console.log(iceCandidate);
        if (didIOffer) {
          console.log("emmitted sendIceCandidateToSignalingServer");
          //this ice is coming from the offerer. Send to the answerer
          const offerInOffers = offers.find((o) => o.offererId === iceUserId);
          if (offerInOffers) {
            offerInOffers.offerIceCandidates.push(iceCandidate);
            console.log("offerInOfferrss", offerInOffers);
            // 1. When the answerer answers, all existing ice candidates are sent
            // 2. Any candidates that come in after the offer has been answered, will be passed through
            if (offerInOffers.answererUserName) {
              //pass it through to the other socket
              console.log(
                "offerInOffers.answererUserName",
                offerInOffers.answererUserName
              );
              const socketToSendTo =
                userStatus[offerInOffers.answererUserName].socketId;
              // const socketToSendTo = connectedSockets.find(s=>s.userName === offerInOffers.answererUserName);
              if (socketToSendTo) {
                socket
                  .to(socketToSendTo)
                  .emit("receivedIceCandidateFromServer", iceCandidate);
              } else {
                console.log(
                  "Ice candidate recieved but could not find answere"
                );
              }
            }
          }
        } else {
          //this ice is coming from the answerer. Send to the offerer
          //pass it through to the other socket
          console.log("iceUserName", iceUserId);

          const offerInOffers = offers.find(
            (o) => o.answererUserName === iceUserId
          );
          if (offerInOffers) {
            const socketToSendTo = userStatus[offerInOffers.offererId].socketId;

            // const socketToSendTo = connectedSockets.find(s=>s.userName === offerInOffers.offererId);
            if (socketToSendTo) {
              socket
                .to(socketToSendTo)
                .emit("receivedIceCandidateFromServer", iceCandidate);
            } else {
              console.log("Ice candidate recieved but could not find offerer");
            }
          }
        }
        // console.log(offers)
      }
    );

    socket.on("newAnswer", (offerObj, ackFunction) => {
      let id = getUserIdBySocketId(socket.id);
      console.log(offerObj);
      //emit this answer (offerObj) back to CLIENT1
      //in order to do that, we need CLIENT1's socketid
      const socketToAnswer = userStatus[offerObj.offererId].socketId;
      // const socketToAnswer = connectedSockets.find(s=>s.userName === offerObj.offererUserName)
      if (!socketToAnswer) {
        console.log("No matching socket");
        return;
      }
      //we found the matching socket, so we can emit to it!

      //we find the offer to update so we can emit it
      const offerToUpdate = offers.find(
        (o) => o.offererId === offerObj.offererId
      );
      if (!offerToUpdate) {
        console.log("No OfferToUpdate");
        return;
      }
      //send back to the answerer all the iceCandidates we have already collected
      ackFunction(offerToUpdate.offerIceCandidates);
      offerToUpdate.answer = offerObj.answer;
      offerToUpdate.answererUserName = id;
      //socket has a .to() which allows emiting to a "room"
      //every socket has it's own room
      socket.to(socketToAnswer).emit("answerResponse", offerToUpdate);
    });

    
    socket.on("accepted_request_video", (senderId: string) => {
      const userfrom = getUserIdBySocketId(socket.id);
      const senderSocket = userStatus[senderId].socketId;
      if (userfrom && senderId && senderSocket) {
        connectedCalls.set(userfrom, senderId);
        connectedCalls.set(senderId, userfrom);
        io.to(senderSocket).emit("call_connected_video", userfrom);
        console.log("connectedCalls accept video ", connectedCalls);
      } else {
        console.log("accepted request failed video");
      }
    });
    socket.on("accepted_request_audio", (senderId: string) => {
      const userfrom = getUserIdBySocketId(socket.id);
      const senderSocket = userStatus[senderId].socketId;
      if (userfrom && senderId && senderSocket) {
        connectedCalls.set(userfrom, senderId);
        connectedCalls.set(senderId, userfrom);
        io.to(senderSocket).emit("call_connected_audio", userfrom);
        console.log("connectedCalls accept audio", connectedCalls);
      } else {
        console.log("accepted request failed audio");
      }
    });

  

    
    socket.on("end_call_video", (id: string) => {
      const userTo: string = userStatus[id].socketId;
      const userfrom = getUserIdBySocketId(socket.id);
      offers = offers.filter(offer => offer.offererId !== id);
      offers = offers.filter(offer => offer.offererId !== userfrom);
      if (userfrom && userTo) {
        connectedCalls.delete(userfrom);
        connectedCalls.delete(id);
        socket.to(userTo).emit("call_ended_video");
        console.log("connectedCalls after end", connectedCalls);
      } else {
        console.log("not Authenticated");
      }
    });

  
    socket.on("end_call_audio", (id: string) => {
      console.log("End call by ",id)
      const userTo: string = userStatus[id]?.socketId;
      const userfrom = getUserIdBySocketId(socket.id);
      offers = offers.filter(offer => offer.offererId !== id);
      offers = offers.filter(offer => offer.offererId !== userfrom);

      console.log("poffff",offers)
      if (userfrom && userTo) {
        connectedCalls.delete(userfrom);
        connectedCalls.delete(id);
        socket.to(userTo).emit("call_ended_audio");
        console.log("connectedCalls after end", connectedCalls);
      } else {
        console.log("not Authenticated");
      }
    });
    /**

    
    */
    //on disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected ", socket.id);
      let id = getUserIdBySocketId(socket.id);
      if (id) {
        userStatus[id] = { socketId: socket.id, status: false };
        updateStatus(id, false);
      }
      broadcastStatus();
      // Additional logic for disconnect
    });
  });

  return io;
}

function getSocketInstance(): SocketIOServer {
  if (!io) {
    throw new Error("Socket not initialized. Call initializeSocket() first.");
  }
  return io;
}

function emitToAll(event: string, data?: any) {
  if (!io) {
    throw new Error("Socket not initialized. Call initializeSocket() first.");
  }
  io.emit(event, data);
}
function emitToSocket(senderid: string, event: string, data?: any) {
  let socketId = userStatus[senderid]?.socketId;
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
}

export {
  initializeSocket,
  getSocketInstance,
  userStatus,
  io,
  socket,
  emitToSocket,
  emitToAll,
};
