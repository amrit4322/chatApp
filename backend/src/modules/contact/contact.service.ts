import { ContactSchema, InvitationSchema, UserSchema } from "../../schema";
import * as InterFace from "../../interfaces";
import { Helper } from "../../helpers";
import { Op } from "sequelize";
import { emitToSocket, io, socket, userStatus } from "../../helpers/socket/socket.helper";
const { ResMsg, Utilities } = Helper;


class ContactService {

  
  public async fetchAll(): Promise<unknown> {
    const allUser = await ContactSchema.Read.findAll();
    if (!allUser) {
      throw ResMsg.errors.ERROR_FETCHING;
    }
    return { success: true, data: allUser };
  }

  public async fetchWithEmail(
    user: InterFace.UserInterFace.UserJWTInfo
  ): Promise<unknown> {
    const { email } = user;
    const existingUser = await UserSchema.Read.findOne({ where: { email } });
    if (!existingUser) {
      throw ResMsg.errors.USER_NOT_FOUND;
    }
    const allConnection = await ContactSchema.Read.findAll({
      where: {
        [Op.or]: [{ userId: existingUser.id }, { contactId: existingUser.id }],
      },
    });

    if (!allConnection) {
      throw ResMsg.errors.NOT_CONNECTED;
    }
    const data = await Promise.all(
      allConnection.map(async (item, index) => {
        let user;
        if (item.contactId !== existingUser.id.toString()) {
          user = await UserSchema.Read.findOne({
            where: { id: item.contactId },
            attributes: [
              "id",
              "email",
              "firstName",
              "lastName",
              "phoneNumber",
              "profilePath",
            ],
          });
        } else {
          user = await UserSchema.Read.findOne({
            where: { id: item.userId },
            attributes: [
              "id",
              "email",
              "firstName",
              "lastName",
              "phoneNumber",
              "profilePath",
            ],
          });
        }

        return user;
      })
    );

    return { success: true, data };
  }

  public async newContacts(
    user: InterFace.UserInterFace.UserJWTInfo
  ): Promise<unknown> {
    const { email } = user;
    const existingUser = await UserSchema.Read.findOne({ where: { email } });
    if (!existingUser) {
      throw ResMsg.errors.USER_NOT_FOUND;
    }

    const allUsers = await UserSchema.Read.findAll({
      where: {
        id: {
          [Op.ne]: existingUser.id, // Exclude existing user
        },
      },
    });

    const allConnection = await ContactSchema.Read.findAll({
      where: {
        [Op.or]: [{ userId: existingUser.id }, { contactId: existingUser.id }],
      },
    });

    if (!allConnection) {
      throw ResMsg.errors.NOT_CONNECTED;
    }

    const existingConnectionsIds = allConnection.map((connection) => {
      return connection.contactId !== existingUser.id.toString()
        ? connection.contactId
        : connection.userId;
    });

    // Filter out users who are already in contact with the existing user
    const newContacts = allUsers.filter(
      (user) => !existingConnectionsIds.includes(user.id.toString())
    );

    const data = newContacts.map((user) => {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      };
    });
    // console.log("data is ", data);
    return { success: true, data };
  }
  public async connect(
    senderEmail: string,
    receiverEmail: string
  ): Promise<unknown> {
    console.log("Sender empoefnvoirjg", senderEmail, receiverEmail);
    const sender = await UserSchema.Read.findOne({
      where: { email: senderEmail },
    });
    const reciever = await UserSchema.Read.findOne({
      where: { email: receiverEmail },
    });
    if (!sender || !reciever) {
      throw ResMsg.errors.USER_NOT_FOUND;
    }
    // console.log("user id ",sender.id," reciever id ",reciever.id)
    let isConnected = await ContactSchema.Read.findOne({
      where: {
        [Op.or]: [
          { userId: sender.id, contactId: reciever.id },
          { userId: reciever.id, contactId: sender.id },
        ],
      },
    });

    if (!isConnected) {
      const userId = sender.id.toString();
      const contactId = reciever.id.toString();
      // console.log("type of ",typeof(userId),typeof(contactId) , userId , contactId)
      isConnected = await ContactSchema.Write.create({ userId, contactId });
    }
    const inviteExist = await InvitationSchema.Read.findOne({
      where: {
        userId: sender.id.toString(),
        contactId: reciever.id.toString(),
      },
    });
    if (inviteExist) {
      console.log("Already exist invite");
      await inviteExist?.destroy();
    }
  
    emitToSocket(sender.id.toString(),"notificationAccepted",`${reciever.firstName} ${reciever.lastName} (${reciever.email}) accepted your invite`)
    emitToSocket(sender.id.toString(),"updateContacts");

    

    return { success: true, data: isConnected };
  }

  public async invitePeople(
    text: string,
    emails: string[],
    userID: string
  ): Promise<unknown> {
    console.log("Text ", text, emails, userID);
    const existingUser = await UserSchema.Read.findOne({
      where: { id: userID },
    });
    if (!existingUser) {
      throw ResMsg.errors.USER_NOT_FOUND;
    }
    //find all contact ids
    const contacts = await UserSchema.Read.findAll({
      attributes: ["id"],
      where: {
        email: {
          [Op.in]: emails,
        },
      },
    });

    // Update or create entries in the InvitationSchema
    contacts.map(async (contact) => {
      const existingInvite = await InvitationSchema.Read.findOne({
        where: {
          userId: userID,
          contactId: contact.id,
        },
      });

      if (existingInvite) {
        console.log("inside existingInvite");
        // Update existing entry
        const allreadyInvited = await InvitationSchema.Read.findOne({
          where: {
            userId: contact.id,
            contactId: userID,
          },
        });
        if (allreadyInvited) {
          console.log("inside alredyInvite");
          await existingInvite.update({ accepted: true });
        }
      } else {
        // Create new entry
        console.log("outside");
        emitToSocket(contact.id.toString(),"inviteNotifcation",`${existingUser.email} has invited you`)

        await InvitationSchema.Write.create({
          userId: userID,
          contactId: contact.id.toString(),
          accepted: false,
        });
      }
    });

    return { success: true };
  }

  public async fetchInvite(userID: string): Promise<unknown> {
    console.log("userr id", userID);
    const contacts = await InvitationSchema.Read.findAll({
      attributes: ["userId"],
      where: {
        contactId: userID,
        accepted: false,
      },
    });
    if (!contacts) {
      throw ResMsg.errors.ERROR_FETCHING;
    }
    console.log("contacts ", contacts);

    const allUsers = await UserSchema.Read.findAll();
    // Filter out users that match the contacts
    const invites = allUsers.filter((user) =>
      contacts.some(
        (contact) => contact.userId.toString() === user.id.toString()
      )
    );

    const data = invites.map((user) => {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profilePath: user.profilePath,
      };
    });
    console.log("data  ", data);

    return { success: true, data: data };
  }

  public async removeConnect(
    senderEmail: string,
    receiverEmail: string
  ): Promise<unknown> {
    const sender = await UserSchema.Read.findOne({
      where: { email: senderEmail },
    });
    const reciever = await UserSchema.Read.findOne({
      where: { email: receiverEmail },
    });
    if (!sender || !reciever) {
      throw ResMsg.errors.USER_NOT_FOUND;
    }

    let isConnected = await ContactSchema.Read.findOne({
      where: {
        [Op.or]: [
          { userId: sender.id, contactId: reciever.id },
          { userId: reciever.id, contactId: sender.id },
        ],
      },
    });
    if (isConnected) {
      await isConnected.destroy();
    }

    emitToSocket(reciever.id.toString(),"removeNotification",`${sender.email} has removed you from their contacts`)
    return { success: true };
  }
}

export default new ContactService();
