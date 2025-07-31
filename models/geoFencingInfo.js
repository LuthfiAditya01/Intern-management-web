import { DataTypes } from 'sequelize';
import { sequelize } from '../libs/postgresql.js';

const GeofenceLocation = sequelize.define('GeofenceLocation', {
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    radius: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    changeByUser: {
        type: DataTypes.STRING, // Firebase UID
        allowNull: true,
    },
}, {
    tableName: 'geofence_locations', // pastikan nama tabel sesuai di database
    timestamps: true,
});

// Fungsi untuk menambah data geofence
export async function insertGeofenceLocation(data) {
    return await GeofenceLocation.create(data);
}

// Fungsi untuk mengambil semua data geofence
export async function getGeofenceLocations() {
    return await GeofenceLocation.findAll();
}

export default GeofenceLocation;
