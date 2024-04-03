import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../helpers/db/mysql.connection";
import { InviteInterface } from "../interfaces/invitation.interface";
interface InviteModal extends Optional<InviteInterface, "id"> {}

interface InviteInstance extends Model<InviteInterface, InviteModal>, InviteInterface {}

const invite = {
  id: {
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactId : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default:false,
  },
  
 
 
  
};

const InviteWrite = sequelize.db_write.define<InviteInstance>("testInvitation", invite);

const InviteRead = sequelize.db_read.define<InviteInstance>("testInvitation", invite);

export default {
    InviteWrite,
    InviteRead,
};
