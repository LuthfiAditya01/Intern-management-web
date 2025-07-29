import { Sequelize } from 'sequelize';
import path from 'path';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'),
  logging: false
});

const connectSQLite = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQLite');
    
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('SQLite connection error:', error);
    throw error;
  }
};

export { sequelize, connectSQLite }; 