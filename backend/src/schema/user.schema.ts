
import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../helpers/db/mysql.connection";
import { UserInterFace } from "../interfaces/user.interface";

interface UserModal extends Optional<UserInterFace, "id"> {}

interface UserInstance extends Model<UserInterFace, UserModal>, UserInterFace {}

const user = {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING, // Corrected data type
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profilePath:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    about:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    isOnline:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
    
};
const UserWrite = sequelize.db_write.define<UserInstance>("testUser", user);

const UserRead = sequelize.db_read.define<UserInstance>("testUser", user);

export default {
    UserRead,
    UserWrite,

}
