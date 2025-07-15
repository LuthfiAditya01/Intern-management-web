import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import DaftarHadir from "@/models/daftarHadirInfo";

export async function POST(request) {
    try {
        // Ambil data dari request
        const { userId, nama, longCordinate, latCordinate, dailyNote } = await request.json();

        // Connect ke MongoDB
        await connectMongoDB();

        // Validasi data
        if (!userId || !longCordinate || !latCordinate || !dailyNote) {
            return NextResponse.json(
                { error: "Data tidak lengkap" },
                { status: 400 }
            );
        }

        // Buat objek absensi baru
        const absensi = new DaftarHadir({
            idUser: userId, // Menggunakan userId langsung sebagai string
            absenDate: new Date(), // Tanggal saat ini
            longCordinate: parseFloat(longCordinate),
            latCordinate: parseFloat(latCordinate),
            messageText: dailyNote
        });

        // Simpan ke database
        await absensi.save();

        // Mengembalikan respons dengan status 201 (Created) dan URL untuk redirect
        return NextResponse.json(
            { 
                message: "Absensi berhasil disimpan", 
                absensi,
                redirectUrl: "/dashboard" // URL untuk redirect ke dashboard
            }, 
            { status: 201 }
        );
    } catch (error) {
        console.error("Error menyimpan absensi:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan absensi" }, 
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        // Connect ke MongoDB
        await connectMongoDB();

        // Ambil parameter userId dari URL jika ada
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let query = {};
        if (userId) {
            query.idUser = userId; // Mencari berdasarkan string userId
        }

        // Ambil data absensi
        const absensi = await DaftarHadir.find(query).sort({ absenDate: -1 });

        return NextResponse.json({ absensi }, { status: 200 });
    } catch (error) {
        console.error("Error mengambil data absensi:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengambil data absensi" },
            { status: 500 }
        );
    }
}