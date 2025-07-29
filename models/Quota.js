import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';

const Quota = sequelize.define('Quota', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bulan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12,
    },
  },
  tahun: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jumlahKuota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['bulan', 'tahun'],
    },
  ],
});

export default Quota; 