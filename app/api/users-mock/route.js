import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        console.log('GET /api/users-mock - Starting...');
        
        // Mock data for testing
        const mockUsers = [
            {
                id: '1',
                username: 'admin',
                email: 'admin@example.com',
                role: 'admin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                username: 'mentor1',
                email: 'mentor1@example.com',
                role: 'mentor',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                username: 'intern1',
                email: 'intern1@example.com',
                role: 'intern',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        console.log(`Returning ${mockUsers.length} mock users`);
        return NextResponse.json({ 
            users: mockUsers,
            message: 'Mock data loaded successfully',
            database: 'Mock'
        });

    } catch (error) {
        console.error("GET /api/users-mock - Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ 
            message: 'Terjadi kesalahan pada server.', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 