import { NextResponse } from 'next/server';
import { connectSQLite } from '../../../libs/sqlite.js';

export async function GET(request) {
    try {
        console.log('GET /api/users-sqlite - Starting...');
        
        console.log('Connecting to SQLite...');
        const { sequelize } = await import('../../../libs/sqlite.js');
        await sequelize.authenticate();
        
        console.log('Testing basic query...');
        const result = await sequelize.query('SELECT COUNT(*) as count FROM "Users"');
        const userCount = result[0][0]?.count || 0;

        console.log(`Found ${userCount} users`);
        return NextResponse.json({ 
            message: 'SQLite connection successful',
            userCount: parseInt(userCount),
            database: 'SQLite'
        });

    } catch (error) {
        console.error("GET /api/users-sqlite - Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ 
            message: 'Terjadi kesalahan pada server.', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 