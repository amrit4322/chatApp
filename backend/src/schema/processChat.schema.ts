import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../helpers/db/mysql.connection";
import { ChatProcessInterface } from "../interfaces/processChat.interface";

interface ChatProcessModal extends Optional<ChatProcessInterface, "id"> {}

interface ChatProcessInstance extends Model<ChatProcessInterface, ChatProcessModal>, ChatProcessInterface {}

const chatprocess = {
  id: {
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  pid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp:{
    type:DataTypes.DATE,
    allowNull:false,
  }
 
  
};

const ChatProcessWrite = sequelize.db_write.define<ChatProcessInstance>("testChatProcess", chatprocess);

const ChatProcessRead = sequelize.db_read.define<ChatProcessInstance>("testChatProcess", chatprocess);

export default {
    ChatProcessRead,
    ChatProcessWrite,
};
