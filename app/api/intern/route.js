import Intern from "@/models/internInfo";
import connectMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "../../../models/User";

export async function GET(request) {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const email = searchParams.get("email")

    // Jika ada parameter email, cari user berdasarkan email
    if (email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({ 
                    success: false, 
                    message: "User tidak ditemukan"
                }, { status: 404 });
            }
            return NextResponse.json({ 
                success: true, 
                username: user.username 
            });
        } catch (error) {
            console.error("Error mencari user:", error);
            return NextResponse.json({ 
                success: false, 
                message: "Terjadi kesalahan saat mencari user"
            }, { status: 500 });
        }
    }

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
}

export async function POST(request) {
    const body = await request.json();
    const {
        nama, nim, nik, prodi, kampus,
        tanggalMulai, tanggalSelesai,
        divisi, status, pembimbing, userId, email
    } = body;

    await connectMongoDB();

    try {
        await Intern.create({
            nama, nim, nik, prodi, kampus,
            tanggalMulai, tanggalSelesai,
            divisi, status, pembimbing, userId, email
        });

        return NextResponse.json({ message: "Data intern berhasil ditambahkan" }, { status: 201 });

    } catch (error) {
        if (error.code === 11000) {
            let duplicateField = Object.keys(error.keyValue)[0];
            let userMessage = `Error: ${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} yang Anda masukkan sudah terdaftar.`;

            return NextResponse.json(
                { message: userMessage },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "Terjadi kesalahan pada server.", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");

    await connectMongoDB();
    await Intern.findByIdAndDelete(id);

    return NextResponse.json({ message: "Data intern berhasil dihapus" }, { status: 200 });
}
