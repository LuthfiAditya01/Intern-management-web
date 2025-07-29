// sync-db.js
import { sequelize } from './libs/postgresql.js';
import './models/index.js'; // Pastikan semua model diimpor

const syncDatabase = async () => {
  try {
    console.log('Starting database synchronization...');
    // force: true akan menghapus tabel jika sudah ada dan membuatnya kembali
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();