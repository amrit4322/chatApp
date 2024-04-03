import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../helpers/db/mysql.connection";
import { OTPInterface } from "../interfaces/otp.interface";

interface OTPModal extends Optional<OTPInterface, "id"> { }

interface OTPInstance
    extends Model<OTPInterface, OTPModal>,
    OTPInterface { }

const otp = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    }, 
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM("EMAIL" , "MOBILE"),
        allowNull: false,
    },
    otp_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    expiration_time: {
        type:  DataTypes.BIGINT,
        allowNull : true
    },
    is_used: {
        type:  DataTypes.BOOLEAN,
        defaultValue : false
    },
    token:{
        type: DataTypes.STRING(255),
        allowNull :false
    }
};

const OTPWrite = sequelize.db_write.define<OTPInstance>("OTPS", otp);
const OTPRead = sequelize.db_read.define<OTPInstance>("OTPS", otp);


export default {
    OTPRead,   
    OTPWrite,
};
