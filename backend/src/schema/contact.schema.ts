import { Model, DataTypes, Optional } from "sequelize";

import sequelize from "../helpers/db/mysql.connection";
import { ContactInterFace } from "../interfaces/contact.interface";
interface ContactModal extends Optional<ContactInterFace, "id"> {}

interface ContactInstance extends Model<ContactInterFace, ContactModal>, ContactInterFace {}

const contact = {
  id: {
    type: DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  contactId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
 
  
};

const ContactWrite = sequelize.db_write.define<ContactInstance>("testContact", contact);

const ContactRead = sequelize.db_read.define<ContactInstance>("testContact", contact);

export default {
    ContactRead,
    ContactWrite,
};
