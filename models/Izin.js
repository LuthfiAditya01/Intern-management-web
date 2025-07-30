import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';
import User from './User.js';

const Izin = sequelize.define('Izin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  izinDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  keteranganIzin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  messageIzin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkBukti: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Izin',
  timestamps: true,
});

export default Izin; 