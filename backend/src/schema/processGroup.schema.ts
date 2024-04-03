import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../helpers/db/mysql.connection";
import { GroupProcessInterface } from "../interfaces/processGroup.interface";

interface GroupProcessModal extends Optional<GroupProcessInterface, "id"> {}

interface GroupProcessInstance extends Model<GroupProcessInterface, GroupProcessModal>, GroupProcessInterface {}

const groupprocess = {
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
  groupId: {
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

const GroupProcessWrite = sequelize.db_write.define<GroupProcessInstance>("testGroupProcess", groupprocess);

const GroupProcessRead = sequelize.db_read.define<GroupProcessInstance>("testGroupProcess", groupprocess);

export default {
    GroupProcessRead,
    GroupProcessWrite,
};
