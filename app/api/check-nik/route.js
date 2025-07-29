import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../libs/postgresql.js";
import { Intern } from "../../../models/index.js";

export async function GET(request) {
    try {
        await connectPostgreSQL();

        const { searchParams } = new URL(request.url);
        const nik = searchParams.get('nik');

        if (!nik) {
            return NextResponse.json({ error: 'NIK is required' }, { status: 400 });
        }

        const existingIntern = await Intern.findOne({ where: { nik } });

        return NextResponse.json({ exists: !!existingIntern });
    } catch (error) {
        console.error('Error checking NIK:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}