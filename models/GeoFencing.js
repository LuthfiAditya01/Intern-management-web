import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';

const GeoFencing = sequelize.define('GeoFencing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  radius: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  changeByUser: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { timestamps: true });

export default GeoFencing; 