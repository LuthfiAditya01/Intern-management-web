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
            const interns = await Intern.find().populate('pembimbing', 'nama');
            return NextResponse.json({ interns });
        }

        const [year, mon] = month.split("-").map(Number);
        const startOfMonth = new Date(year, mon - 1, 1);
        const endOfMonth = new Date(year, mon, 0, 23, 59, 59, 999);

        const interns = await Intern.find({
            tanggalMulai: { $lte: endOfMonth },
            tanggalSelesai: { $gte: startOfMonth },
        })
            .populate('pembimbing')
            .sort({ nama: 1 });

        return NextResponse.json({ interns });
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
        
        // Handle specific error types
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors?.[0]?.path || 'unknown';
            const value = error.errors?.[0]?.value || 'unknown';
            
            let message = '';
            if (field === 'email') {
                message = `Email ${value} sudah terdaftar. Silakan gunakan email lain.`;
            } else if (field === 'firebase_uid') {
                message = 'Akun Firebase ini sudah terdaftar.';
            } else if (field === 'nik') {
                message = `NIK ${value} sudah terdaftar. Silakan gunakan NIK lain.`;
            } else if (field === 'nim') {
                message = `NIM ${value} sudah terdaftar. Silakan gunakan NIM lain.`;
            } else {
                message = `${field.charAt(0).toUpperCase() + field.slice(1)} yang Anda masukkan sudah terdaftar.`;
            }
            
            return NextResponse.json(
                { message: message },
                { status: 409 }
            );
        } else if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(e => e.message).join(', ');
            return NextResponse.json(
                { message: `Data tidak valid: ${validationErrors}` },
                { status: 400 }
            );
        }
        
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

        const deletedIntern = await Intern.findByIdAndDelete(id);

        if (!deletedIntern) {
            return NextResponse.json(
                { message: "Data intern tidak ditemukan" },
                { status: 404 }
            );
        }

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