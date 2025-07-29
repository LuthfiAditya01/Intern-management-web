import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({ 
            message: "API test successful",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json(
            { message: "API test failed", error: error.message },
            { status: 500 }
        );
    }
} 