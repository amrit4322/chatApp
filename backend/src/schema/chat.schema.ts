import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../helpers/db/mysql.connection";
import { ChatInterface } from "../interfaces/chat.interface";

interface ChatModal extends Optional<ChatInterface, "id"> {}

interface ChatInstance extends Model<ChatInterface, ChatModal>, ChatInterface {}

const chat = {
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
  timestamp: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  data:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  isFileMessage:{
    type:DataTypes.BOOLEAN,
    default:false,
    allowNull:false,
  },
  isImageMessage:{
    type:DataTypes.BOOLEAN,
    default:false,
    allowNull:false,
  },
  seen:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    default:false,
  }
  
};

const ChatWrite = sequelize.db_write.define<ChatInstance>("testChat", chat);

const ChatRead = sequelize.db_read.define<ChatInstance>("testChat", chat);

export default {
    ChatRead,
    ChatWrite,
};
