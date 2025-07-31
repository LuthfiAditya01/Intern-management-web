import dotenv from 'dotenv';
import { sequelize } from '../libs/postgresql.js';
import { DataTypes } from 'sequelize';

dotenv.config();

async function addTemporaryColumn() {
  try {
    console.log('Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    console.log('Adding isTemporary column to Users table...');
    await sequelize.getQueryInterface().addColumn('Users', 'isTemporary', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    console.log('Successfully added isTemporary column to Users table.');

    console.log('Adding isTemporary column to Interns table...');
    await sequelize.getQueryInterface().addColumn('Interns', 'isTemporary', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    console.log('Successfully added isTemporary column to Interns table.');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

addTemporaryColumn();