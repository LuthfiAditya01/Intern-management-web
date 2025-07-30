import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';
import User from './User.js';

const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nip: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  divisi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('aktif', 'tidak aktif'),
    defaultValue: 'aktif',
  },
}, {
  timestamps: true,
});

// PERBAIKAN: Hapus asosiasi yang didefinisikan di sini karena sudah didefinisikan di associations.js
// Mentor.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// User.hasOne(Mentor, { foreignKey: 'userId', as: 'mentor' });

export default Mentor; 