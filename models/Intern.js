import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';
import User from './User.js';
import Mentor from './Mentor.js';

const Intern = sequelize.define('Intern', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nik: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  prodi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kampus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggalMulai: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tanggalSelesai: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  divisi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('aktif', 'selesai', 'dikeluarkan', 'pending'),
    defaultValue: 'pending',
  },
  mentorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Mentors',
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

export default Intern; 