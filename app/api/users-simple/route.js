import { NextResponse } from 'next/server';
import { connectPostgreSQL } from '../../../libs/postgresql.js';

export async function GET(request) {
    try {
        console.log('GET /api/users-simple - Starting...');
        
        console.log('Connecting to PostgreSQL...');
        const { sequelize } = await import('../../../libs/postgresql.js');
        await sequelize.authenticate();
        
        console.log('Testing basic query...');
        const result = await sequelize.query('SELECT COUNT(*) as count FROM "Users"');
        const userCount = result[0][0].count;

        console.log(`Found ${userCount} users`);
        return NextResponse.json({ 
            message: 'Database connection successful',
            userCount: parseInt(userCount)
        });

    } catch (error) {
        console.error("GET /api/users-simple - Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ 
            message: 'Terjadi kesalahan pada server.', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 