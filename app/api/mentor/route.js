import { NextResponse } from "next/server";
import { sequelize, connectPostgreSQL } from "../../../libs/postgresql.js";
import { Mentor, User } from "../../../models/index.js";

export async function GET() {
    try {
        // Temporary mock response for testing while database is being set up
        const mockMentors = [
            {
                id: 1,
                nama: "Test Mentor 1",
                nip: "123456789",
                email: "mentor1@test.com",
                divisi: "IT",
                status: "aktif",
                mentorUser: {
                    username: "mentor1",
                    email: "mentor1@test.com",
                    role: "mentor"
                }
            },
            {
                id: 2,
                nama: "Test Mentor 2", 
                nip: "987654321",
                email: "mentor2@test.com",
                divisi: "HR",
                status: "aktif",
                mentorUser: {
                    username: "mentor2",
                    email: "mentor2@test.com",
                    role: "mentor"
                }
            }
        ];
        
        return NextResponse.json({ mentors: mockMentors }, {status: 200});
        
        // Original database code (commented out temporarily)
        /*
        await connectPostgreSQL();
        const mentors = await Mentor.findAll({
            attributes: ['id', 'nama', 'nip', 'email', 'divisi', 'status'],
            include: [
        {
            model: User,
            as: 'mentorUser',
            attributes: ['username', 'email', 'role']
        }
    ]
});
        return NextResponse.json({ mentors }, {status: 200});
        */
    } catch (error) {
        console.error("GET mentors error:", error);
        return NextResponse.json({ message: "Gagal mengambil data pembimbing.", error: error.message }, { status: 500 });
    }
}



export async function POST(request) {
    const t = await sequelize.transaction();
    try {
        await connectPostgreSQL();
        const body = await request.json();
        const { userId: firebaseUid, nama, nip, email, status, divisi } = body;

        if (!firebaseUid || !nama || !nip || !email) {
            await t.rollback();
            return NextResponse.json({ message: "Data wajib tidak boleh kosong." }, { status: 400 });
        }

        // 1. CARI atau BUAT record User terlebih dahulu
        const [user, created] = await User.findOrCreate({
            where: { firebaseUid: firebaseUid },
            defaults: {
                firebaseUid: firebaseUid,
                email: email,
                username: nama,
                role: 'intern', // Role awal sebelum diupdate
            },
            transaction: t
        });

        console.log(`User sync on mentor register: ${user.email}, Created new user: ${created}`);

        // 2. Cek apakah user ini sudah punya profil Mentor
        const existingMentor = await Mentor.findOne({ where: { userId: user.id }, transaction: t });
        if (existingMentor) {
            await t.rollback();
            return NextResponse.json({ message: "Pengguna ini sudah terdaftar sebagai pembimbing." }, { status: 409 });
        }

        // 3. Buat data Mentor baru
        await Mentor.create({
            userId: user.id,
            nama, 
            nip, 
            email, 
            status: status || 'aktif', 
            divisi
        }, { transaction: t });

        // 4. Update role pengguna menjadi 'mentor'
        user.role = 'mentor';
        await user.save({ transaction: t });

        // Jika semua berhasil, simpan perubahan
        await t.commit();

        return NextResponse.json({ message: "Data pembimbing berhasil ditambahkan dan role telah diperbarui" }, { status: 201 });

    } catch (error) {
        // Jika ada error, batalkan semua
        await t.rollback();
        console.error("POST mentor error:", error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            const userMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} yang Anda masukkan sudah terdaftar.`;
            return NextResponse.json({ message: userMessage }, { status: 409 });
        }

        return NextResponse.json({ message: "Terjadi kesalahan pada server.", error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        await connectPostgreSQL();
        const mentor = await Mentor.findByPk(id);
        
        if (!mentor) {
            return NextResponse.json(
                { message: "Data pembimbing tidak ditemukan" },
                { status: 404 }
            );
        }

        await mentor.destroy();
        return NextResponse.json({ message: "Data Pembimbing Berhasil dihapus" }, { status: 200 });
    } catch (error) {
        console.error("DELETE mentor error:", error);
        return NextResponse.json(
            { message: "Gagal menghapus data pembimbing", error: error.message },
            { status: 500 }
        );
    }
}