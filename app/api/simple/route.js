import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        console.log('GET /api/simple - Starting...');
        
        const response = {
            message: 'Simple API working',
            timestamp: new Date().toISOString(),
            method: 'GET',
            url: request.url
        };
        
        console.log('Response:', response);
        return NextResponse.json(response);

    } catch (error) {
        console.error("GET /api/simple - Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ 
            message: 'Simple API failed', 
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        console.log('POST /api/simple - Starting...');
        
        const body = await request.json();
        
        const response = {
            message: 'Simple POST API working',
            timestamp: new Date().toISOString(),
            method: 'POST',
            receivedData: body
        };
        
        console.log('Response:', response);
        return NextResponse.json(response);

    } catch (error) {
        console.error("POST /api/simple - Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ 
            message: 'Simple POST API failed', 
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
} 