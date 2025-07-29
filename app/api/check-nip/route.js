import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../libs/postgresql.js";
import { Mentor } from "../../../models/index.js";

export async function GET(request) {
    try {
        await connectPostgreSQL();
        const { searchParams } = new URL(request.url);
        const nip = searchParams.get('nip');

        if (!nip) {
            return NextResponse.json({ exists: false, message: "NIP is required" }, { status: 400 });
        }

        const pembimbing = await Mentor.findOne({ where: { nip } });
        return NextResponse.json({ exists: !!pembimbing });
    } catch (error) {
        console.error("Check NIP error:", error);
        return NextResponse.json({ exists: false, message: "Server error" }, { status: 500 });
    }
}