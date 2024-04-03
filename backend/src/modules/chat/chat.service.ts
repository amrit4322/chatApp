import { ProcessChatSchema, UserSchema } from "../../schema";
import { ChatSchema } from "../../schema";
import { Helper } from "../../helpers";
import * as InterFace from "../../interfaces";
import { Op } from "sequelize";
import userService from "../user/user.service";
const { ResMsg, Utilities } = Helper;
class ChatService {
  public async fetchAll(): Promise<unknown> {
    const allUser = await ProcessChatSchema.Read.findAll();
    if (!allUser) {
      throw ResMsg.errors.ERROR_FETCHING;
    }
    return { success: true, data: allUser };
  }

  public async insertMessage(
    data: InterFace.ChatInterface.ChatInterface
  ): Promise<unknown> {
    await ChatSchema.Write.create(data);
    return { success: true };
  }
  public async fetchMessages(id: string, connectId: string): Promise<unknown> {
    if (!connectId || !id) {
      throw ResMsg.errors.REQUEST_BODY;
    }
    console.log("inside fetchMessageeeeeee", connectId, id);
    const allmessages = await ChatSchema.Read.findAll({
      where: {
        [Op.or]: [
          { senderId: id, receiverId: connectId },
          { senderId: connectId, receiverId: id },
        ],
      },
      order: [["timestamp", "ASC"]],
    });
    if (!allmessages) {
      throw ResMsg.errors.ERROR_FETCHING_MESSAGES;
    }
    let msgData: InterFace.ChatInterface.MsgData[] = [];
    allmessages.map((item) => {
      let data: InterFace.ChatInterface.MsgData = {
        id: item.id,
        author: item.senderId,
        message: item.data,
        timestamp: item.timestamp,
        isFileMessage: item.isFileMessage,
        isImageMessage: item.isImageMessage,
        seen: item.seen ? item.seen : false,
      };
      msgData.push(data);
    });

    return msgData;
  }

  public async fetchNotification(id: string): Promise<unknown> {
    const allmessages = await ChatSchema.Read.findAll({
      where: {
        receiverId: id,
        seen: false,
      },
      order: [["createdAt", "ASC"]],
    });
    if (!allmessages) {
      throw ResMsg.errors.ERROR_FETCHING_MESSAGES;
    }
    let msgData: { [id: string]: number } = {};
    allmessages.forEach((message) => {
      const senderId = message.senderId;
      msgData[senderId] = (msgData[senderId] || 0) + 1;
    });

    return msgData;
  }
  public async seenMsg(senderId: string, receiverId: string): Promise<unknown> {
    const allmessages = await ChatSchema.Read.findAll({
      where: {
        senderId: senderId,
        receiverId: receiverId,
        seen: false,
      },
      order: [["createdAt", "ASC"]],
    });
    if (!allmessages) {
      throw ResMsg.errors.ERROR_FETCHING_MESSAGES;
    }

    allmessages.forEach((message) => {
      message.update({ seen: true });
    });
    console.log("in seen msg");
    return true;
  }

  public async createConnection(
    chatData: InterFace.ChatInterface.ChatInterface
  ): Promise<unknown> {
    const { senderId, timestamp, receiverId } = chatData;
    const existingRoom = await ChatSchema.Read.findOne({
      where: { senderId, receiverId, timestamp },
    });
    if (!existingRoom) {
      await ChatSchema.Write.create(chatData);
    }

    return { success: true };
  }
  public async isConnected(
    chatData: InterFace.ChatInterface.ChatInterface
  ): Promise<unknown> {
    const { senderId, timestamp, receiverId } = chatData;
    const existingRoom = await ChatSchema.Read.findOne({
      where: { senderId, receiverId, timestamp },
    });
    if (!existingRoom) {
      throw ResMsg.errors.USER_IS_NOT_VERIFIED;
    }

    return { success: true };
  }

  public async fetchAllConnection(userId: string): Promise<unknown> {
    console.log("inside fetchMessage");
    const allMessages = await ChatSchema.Read.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [
        ["createdAt", "DESC"], // Assuming 'createdAt' is the field you want to order by
      ],
    });
    if (!allMessages) {
      throw ResMsg.errors.ERROR_FETCHING_MESSAGES;
    }
    let connectedUsers: InterFace.UserInterFace.UserInfo[] = [];
    let allUsers = await UserSchema.Read.findAll({
      attributes: [
        "id",
        "email",
        "firstName",
        "lastName",
        "phoneNumber",
        "profilePath",
        "about",
      ],
    });
    allMessages.forEach((item) => {
      if (item.senderId === userId) {
        const receiver = allUsers.find(
          (user) => user.id.toString() === item.receiverId.toString()
        );
        if (
          receiver &&
          !connectedUsers.some(
            (user) => user.id.toString() === receiver.id.toString()
          )
        ) {
          connectedUsers.push(receiver);
        }
      } else {
        const sender = allUsers.find(
          (user) => user.id.toString() === item.senderId.toString()
        );
        if (sender && !connectedUsers.some((user) => user.id === sender.id)) {
          connectedUsers.push(sender);
        }
      }
    });
    console.log("ending fetchUSer", connectedUsers);
    return connectedUsers;
  }
}

export default new ChatService();