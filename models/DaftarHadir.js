import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';
import User from './User.js';

const DaftarHadir = sequelize.define('DaftarHadir', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
    },
    absenDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    longCordinate: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    latCordinate: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    keteranganMasuk: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageText: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { 
    tableName: 'DaftarHadir', // <-- TAMBAHKAN BARIS INI
    timestamps: true 
});

// DaftarHadir.belongsTo(User, { as: 'absenUser', foreignKey: 'userId' });

export default DaftarHadir;