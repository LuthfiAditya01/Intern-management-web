import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../libs/postgresql.js";
import { Intern, User, Mentor } from "../../../models/index.js";
import { Op } from 'sequelize';

export async function GET(request) {
    try {
        await connectPostgreSQL();

        const { searchParams } = new URL(request.url);
        const month = searchParams.get("month");

        if (!month) {
            const interns = await Intern.findAll({
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
                ],
                order: [['nama', 'ASC']]
            });
            return NextResponse.json({ interns });
        }

        const [year, mon] = month.split("-").map(Number);
        const startOfMonth = new Date(year, mon - 1, 1);
        const endOfMonth = new Date(year, mon, 0, 23, 59, 59, 999);

        const interns = await Intern.findAll({
            where: {
                tanggalMulai: { [Op.lte]: endOfMonth },
                tanggalSelesai: { [Op.gte]: startOfMonth },
            },
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
            ],
            order: [['nama', 'ASC']]
        });

        return NextResponse.json();
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { message: "Gagal mengambil data intern", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        console.log("POST request received");
        await connectPostgreSQL();
        console.log("Database connected");
        
        const body = await request.json();
        console.log("Request body:", body);
        const {
            nama, nim, nik, prodi, kampus,
            tanggalMulai, tanggalSelesai, userId, email
        } = body;

        // ... (Validasi input Anda sudah bagus) ...
        if (!nama || !nim || !nik || !prodi || !kampus || !tanggalMulai || !tanggalSelesai || !userId || !email) {
            return NextResponse.json({ message: "Semua field wajib harus diisi" }, { status: 400 });
        }
        const startDate = new Date(tanggalMulai);
        const endDate = new Date(tanggalSelesai);
        if (startDate >= endDate) {
            return NextResponse.json({ message: "Tanggal mulai harus lebih awal dari tanggal selesai" }, { status: 400 });
        }

        // 1. CARI atau BUAT record User (ini sudah bekerja dengan baik)
        const [user, created] = await User.findOrCreate({
            where: { firebaseUid: userId },
            defaults: {
                firebaseUid: userId,
                email: email,
                username: nama,
                role: 'intern',
            }
        });

        // 2. Cek apakah pengguna ini sudah terdaftar sebagai intern
        const existingIntern = await Intern.findOne({ where: { userId: user.id } });
        if (existingIntern) {
            return NextResponse.json(
                { message: "Anda sudah terdaftar sebagai peserta magang." },
                { status: 409 }
            );
        }

        // 3. BUAT record Intern (INI BAGIAN YANG DIPERBAIKI)
        const newIntern = await Intern.create({
            userId: user.id,
            email: email, // <-- TAMBAHKAN BARIS INI
            nama,
            nim,
            nik,
            prodi,
            kampus,
            tanggalMulai: startDate,
            tanggalSelesai: endDate,
            status: 'pending',
            divisi: '-'
        });
        
        return NextResponse.json({
            message: "Pendaftaran berhasil",
            intern: newIntern
        }, { status: 201 });

    } catch (error) {
        console.error("POST Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({
          message: "Terjadi kesalahan pada server.",
          error: error.message
        }, { status: 500 });
      }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "ID intern diperlukan" },
                { status: 400 }
            );
        }

        await connectPostgreSQL();

        const deletedIntern = await Intern.findByPk(id);
        if (!deletedIntern) {
            return NextResponse.json(
                { message: "Data intern tidak ditemukan" },
                { status: 404 }
            );
        }

        await deletedIntern.destroy();

        return NextResponse.json(
            { message: "Data intern berhasil dihapus" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json(
            { message: "Gagal menghapus data intern", error: error.message },
            { status: 500 }
        );
    }
}