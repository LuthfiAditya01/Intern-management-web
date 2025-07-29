import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        console.log('GET /api/debug - Starting...');
        
        // Test basic functionality
        const testData = {
            message: 'Debug API working',
            timestamp: new Date().toISOString(),
            env: {
                NODE_ENV: process.env.NODE_ENV,
                POSTGRES_HOST: process.env.POSTGRES_HOST,
                POSTGRES_DB: process.env.POSTGRES_DB
            }
        };
        
        // Test PostgreSQL connection
        try {
            console.log('Testing PostgreSQL connection...');
            const { sequelize } = await import('../../../libs/postgresql.js');
            await sequelize.authenticate();
            console.log('PostgreSQL connection successful');
            
            // Test basic query
            const result = await sequelize.query('SELECT NOW() as current_time');
            testData.postgresql = {
                status: 'connected',
                currentTime: result[0][0].current_time
            };
        } catch (dbError) {
            console.error('PostgreSQL connection failed:', dbError.message);
            testData.postgresql = {
                status: 'failed',
                error: dbError.message
            };
        }
        
        console.log('Debug data:', testData);
        return NextResponse.json(testData);

    } catch (error) {
        console.error("GET /api/debug - Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ 
            message: 'Debug API failed', 
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
} 