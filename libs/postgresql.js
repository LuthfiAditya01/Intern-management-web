import { Sequelize } from 'sequelize';
// ===================================================================
// 1. TAMBAHKAN BARIS INI untuk impor 'pg' secara eksplisit
import pg from 'pg';
// ===================================================================

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'intern-management',
  process.env.POSTGRES_USER || 'postgres',
//   process.env.POSTGRES_PASSWORD || 'password',
  process.env.POSTGRES_PASSWORD || '',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',

    // ===================================================================
    // 2. TAMBAHKAN BARIS INI untuk memberitahu Sequelize modulnya
    dialectModule: pg,
    // ===================================================================

    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectPostgreSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL'); // Pesan log yang lebih baik
    
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error); // Pesan log yang lebih baik
    throw error;
  }
};

export { sequelize, connectPostgreSQL };