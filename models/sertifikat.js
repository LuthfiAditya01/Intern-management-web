import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';

const Sertifikat = sequelize.define('Sertifikat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nim: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nama: DataTypes.STRING,
  instansi: DataTypes.STRING,
  program: DataTypes.STRING,
  kelas: DataTypes.STRING,
  kompetensi: DataTypes.STRING,
  tanggalMulai: DataTypes.DATE,
  tanggalSelesai: DataTypes.DATE,
  lamaMagang: DataTypes.STRING,
  templateId: DataTypes.UUID,
}, { timestamps: true });

export default Sertifikat;