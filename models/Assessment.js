import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';
import Intern from './Intern.js';

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  internId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Interns',
      key: 'id',
    },
  },
  komunikasi: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
    validate: {
      min: -1,
      max: 100,
    },
  },
  kerjaTim: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
    validate: {
      min: -1,
      max: 100,
    },
  },
  kedisiplinan: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
    validate: {
      min: -1,
      max: 100,
    },
  },
  inisiatif: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
    validate: {
      min: -1,
      max: 100,
    },
  },
  tanggungJawab: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
    validate: {
      min: -1,
      max: 100,
    },
  },
  catatan: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  penilai: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggalDinilai: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

// Define association
Assessment.belongsTo(Intern, { foreignKey: 'internId', as: 'intern' });
Intern.hasMany(Assessment, { foreignKey: 'internId', as: 'assessments' });

export default Assessment; 