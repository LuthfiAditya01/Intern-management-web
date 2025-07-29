import dotenv from 'dotenv';
import { connectPostgreSQL } from '../libs/postgresql.js';

dotenv.config();

const checkConnection = async () => {
    console.log('Checking PostgreSQL connection...\n');
    
    console.log('Environment variables:');
    console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
    console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);
    console.log('POSTGRES_DB:', process.env.POSTGRES_DB);
    console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
    console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD ? '***' : 'Not set');
    
    try {
        await connectPostgreSQL();
        console.log('\n✅ PostgreSQL connection successful!');
        
        // Test basic query
        const { sequelize } = await import('../libs/postgresql.js');
        const result = await sequelize.query('SELECT NOW()');
        console.log('✅ Database query test:', result[0][0]);
        
    } catch (error) {
        console.log('\n❌ PostgreSQL connection failed:');
        console.log('Error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Solution: Make sure PostgreSQL is running');
        } else if (error.code === 'ENOTFOUND') {
            console.log('\n💡 Solution: Check POSTGRES_HOST in .env file');
        } else if (error.code === '3D000') {
            console.log('\n💡 Solution: Database does not exist, create it first');
        } else if (error.code === '28P01') {
            console.log('\n💡 Solution: Check username and password in .env file');
        }
    }
};

checkConnection().catch(console.error); 