import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../../libs/postgresql.js";
import { Intern, User, Mentor } from "../../../../models/index.js";

export async function PUT(request, { params }) {
    try {
        const { id } = params;

        const {
            newNama: nama,
            newNim: nim,
            newNik: nik,
            newProdi: prodi,
            newKampus: kampus,
            newTanggalMulai: tanggalMulai,
            newTanggalSelesai: tanggalSelesai,
            newDivisi: divisi,
            newStatus: status,
            newMentorId: mentorId,
            newUserId: userId,
            newEmail: email,
        } = await request.json();

        await connectPostgreSQL();

        const intern = await Intern.findByPk(id);
        if (!intern) {
            return NextResponse.json(
                { message: "Data intern tidak ditemukan" },
                { status: 404 }
            );
        }

        await intern.update({
            nama,
            nim,
            nik,
            prodi,
            kampus,
            tanggalMulai,
            tanggalSelesai,
            divisi,
            status,
            mentorId,
            userId,
            email
        });

        return NextResponse.json({ message: "Data intern berhasil diperbarui" }, { status: 200 });
    } catch (error) {
        console.error("PUT intern error:", error);
        return NextResponse.json(
            { message: "Gagal memperbarui data intern", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        await connectPostgreSQL();
        
        const intern = await Intern.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email', 'role']
                },
                {
                    model: Mentor,
                    as: 'mentor',
                    attributes: ['nama', 'nip', 'divisi']
                }
            ]
        });
        
        if (!intern) {
            return NextResponse.json(
                { message: "Data intern tidak ditemukan" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ intern }, { status: 200 });
    } catch (error) {
        console.error("GET intern error:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data intern", error: error.message },
            { status: 500 }
        );
    }
}
