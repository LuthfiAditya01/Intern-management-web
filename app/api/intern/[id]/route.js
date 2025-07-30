import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../../libs/postgresql.js";
import { Intern, User, Mentor } from "../../../../models/index.js";

export async function PUT(request, context) {
    // PERBAIKAN: Await params sebelum menggunakan propertinya
    const { params } = await context;
    const { id } = params;
    
    try {
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
            newMentorId: mentorId, // Nilai ID pembimbing dari frontend
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

        // PERBAIKAN: Gunakan nama kolom yang sesuai dengan definisi di model
        const updateData = {
            nama,
            nim,
            nik,
            prodi,
            kampus,
            tanggalMulai,
            tanggalSelesai,
            divisi,
            status,
            userId,
            email
        };

        // PERBAIKAN: Hanya tambahkan mentorId jika ada nilainya
        if (mentorId !== undefined && mentorId !== null && mentorId !== '') {
            updateData.mentorId = mentorId;
        } else {
            // Jika mentorId kosong, set ke null
            updateData.mentorId = null;
        }

        await intern.update(updateData);

        return NextResponse.json({ message: "Data intern berhasil diperbarui" }, { status: 200 });
    } catch (error) {
        console.error("PUT intern error:", error);
        return NextResponse.json(
            { message: "Gagal memperbarui data intern", error: error.message },
            { status: 500 }
        );
    }
}

// PATCH khusus update status
export async function PATCH(request, context) {
    // PERBAIKAN: Await params sebelum menggunakan propertinya
    const { params } = await context;
    const { id } = params;
    try {
        const { status } = await request.json();
        await connectPostgreSQL();
        const intern = await Intern.findByPk(id);
        if (!intern) {
            return NextResponse.json(
                { message: "Data intern tidak ditemukan" },
                { status: 404 }
            );
        }
        await intern.update({ status });
        return NextResponse.json({ message: "Status intern berhasil diperbarui", data: intern }, { status: 200 });
    } catch (error) {
        console.error("PATCH intern status error:", error);
        return NextResponse.json(
            { message: "Gagal memperbarui status intern", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request, context) {
    // PERBAIKAN: Await params sebelum menggunakan propertinya
    const { params } = await context;
    const { id } = params;
    try {
        await connectPostgreSQL();
        const intern = await Intern.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'internUser',
                    attributes: ['username', 'email', 'role']
                },
                {
                    model: Mentor,
                    as: 'pembimbing', // PERBAIKAN: Ubah alias dari 'mentor' ke 'pembimbing'
                    attributes: ['id', 'nama', 'nip', 'divisi']
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
