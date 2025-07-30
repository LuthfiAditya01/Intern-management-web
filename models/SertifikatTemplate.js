import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';

const SertifikatTemplate = sequelize.define('SertifikatTemplate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nama: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: "DEFAULT",
  },
  imageUrl: DataTypes.STRING,
}, { timestamps: true });

export default SertifikatTemplate; 