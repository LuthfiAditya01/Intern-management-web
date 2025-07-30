import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "NON",
  },
  elements: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, { timestamps: true });

export default Template;
