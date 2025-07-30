import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../../libs/postgresql.js";
import { Mentor, User } from "../../../../models/index.js";

export async function PUT(request, { params }) {
    try {
        const { id } = params;

        const {
            newUserId: userId,
            newNama: nama,
            newNip: nip,
            newEmail: email,
            newDivisi: divisi,
            newStatus: status,
        } = await request.json();

        await connectPostgreSQL();

        const mentor = await Mentor.findByPk(id);
        if (!mentor) {
            return NextResponse.json(
                { message: "Data mentor tidak ditemukan" },
                { status: 404 }
            );
        }

        await mentor.update({
            userId,
            nama,
            nip,
            email,
            divisi,
            status
        });

        return NextResponse.json({ message: "Data Mentor berhasil diperbarui" });
    } catch (error) {
        console.error("PUT mentor error:", error);
        return NextResponse.json(
            { message: "Gagal memperbarui data mentor", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        await connectPostgreSQL();
        
        const pembimbing = await Mentor.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'mentorUser',
                    attributes: ['username', 'email', 'role']
                }
            ]
        });
        
        if (!pembimbing) {
            return NextResponse.json(
                { message: "Data mentor tidak ditemukan" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ pembimbing }, { status: 200 });
    } catch (error) {
        console.error("GET mentor error:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data mentor", error: error.message },
            { status: 500 }
        );
    }
}