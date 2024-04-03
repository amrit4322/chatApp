import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../helpers/db/mysql.connection";
import { GroupChatInterface } from "../interfaces/groupChat.interface";

interface GroupChatModal extends Optional<GroupChatInterface, "id"> {}

interface GroupChatInstance extends Model<GroupChatInterface, GroupChatModal>, GroupChatInterface {}

const groupchat = {
  id: {
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  contactId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
 
  
};

const GroupChatWrite = sequelize.db_write.define<GroupChatInstance>("testGroupChat", groupchat);

const GroupChatRead = sequelize.db_read.define<GroupChatInstance>("testGroupChat", groupchat);

export default {
    GroupChatRead,
    GroupChatWrite,
};
