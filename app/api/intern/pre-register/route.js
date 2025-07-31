import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../../libs/postgresql.js";
import { Intern, User } from "../../../../models/index.js";
import { sequelize } from "../../../../libs/postgresql.js";

export async function POST(request) {
    // Inisialisasi transaction
    let transaction;
    
    try {
        console.log("PRE-REGISTER request received");
        await connectPostgreSQL();
        console.log("Database connected");
        
        const body = await request.json();
        console.log("Request body:", body);
        const {
            nama, nim, nik, prodi, kampus,
            tanggalMulai, tanggalSelesai, userId, email, isTemporary
        } = body;

        // Validasi input
        if (!nama || !nim || !nik || !prodi || !kampus || !tanggalMulai || !tanggalSelesai || !userId || !email) {
            return NextResponse.json({ message: "Semua field wajib harus diisi" }, { status: 400 });
        }
        
        const startDate = new Date(tanggalMulai);
        const endDate = new Date(tanggalSelesai);
        if (startDate >= endDate) {
            return NextResponse.json({ message: "Tanggal mulai harus lebih awal dari tanggal selesai" }, { status: 400 });
        }

        // Cek apakah NIK sudah terdaftar
        const existingInternWithNik = await Intern.findOne({ where: { nik } });
        if (existingInternWithNik) {
            return NextResponse.json(
                { message: "NIK sudah terdaftar, silakan gunakan NIK lain." },
                { status: 409 }
            );
        }

        // Cek apakah email sudah terdaftar
        const existingInternWithEmail = await Intern.findOne({ where: { email } });
        if (existingInternWithEmail) {
            return NextResponse.json(
                { message: "Email sudah terdaftar, silakan gunakan email lain." },
                { status: 409 }
            );
        }

        // Mulai transaction
        transaction = await sequelize.transaction();

        // 1. Buat temporary User
        const tempUser = await User.create({
            firebaseUid: userId, // Ini adalah temporary ID
            email: email,
            username: nama,
            role: 'intern',
            isTemporary: true
        }, { transaction });

        console.log("Temporary user created:", tempUser.id);

        // 2. Buat record Intern
        const newIntern = await Intern.create({
            userId: tempUser.id,
            email: email,
            nama,
            nim,
            nik,
            prodi,
            kampus,
            tanggalMulai: startDate,
            tanggalSelesai: endDate,
            status: 'pending',
            divisi: '-',
            isTemporary: true
        }, { transaction });
        
        console.log("Temporary intern created:", newIntern.id);

        // Commit transaction
        await transaction.commit();
        
        return NextResponse.json({
            message: "Pre-registrasi berhasil",
            intern: newIntern
        }, { status: 201 });

    } catch (error) {
        // Rollback transaction jika ada error
        if (transaction) await transaction.rollback();
        
        console.error("PRE-REGISTER Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({
          message: "Terjadi kesalahan pada server.",
          error: error.message
        }, { status: 500 });
    }
}