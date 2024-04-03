import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../helpers/db/mysql.connection";
import { GroupInterface } from "../interfaces/group.interface";

interface GroupModal extends Optional<GroupInterface, "id"> {}

interface GroupInstance extends Model<GroupInterface, GroupModal>, GroupInterface {}

const group = {
  id: {
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groupProfile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
  
};

const GroupWrite = sequelize.db_write.define<GroupInstance>("testGroup", group);

const GroupRead = sequelize.db_read.define<GroupInstance>("testGroup", group);

export default {
    GroupRead,
    GroupWrite,
};
