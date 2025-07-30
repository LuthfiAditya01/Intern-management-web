// File: sync-db.js

import { sequelize } from './libs/postgresql.js';
import './models/index.js'; // Pastikan ini mengimpor semua model Anda

const syncDatabase = async () => {
  try {
    console.log('Memulai sinkronisasi database...');

    // alter: true akan membuat tabel jika belum ada, 
    // atau mengubah jika ada perbedaan kolom, tanpa menghapus data.
    await sequelize.sync({ alter: true });

    console.log('Sinkronisasi database berhasil.');
  } catch (error) {
    console.error('Gagal melakukan sinkronisasi:', error);
  } finally {
    await sequelize.close();
    console.log('Koneksi ditutup.');
  }
};

syncDatabase();