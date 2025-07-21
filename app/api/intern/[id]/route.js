import connectMongoDB from "./../../../../libs/mongodb";
import Intern from "./../../../../models/internInfo";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
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
        newPembimbing: pembimbing,
        newUserId: userId,
        newEmail: email,
    } = await request.json();

    await connectMongoDB();

    await Intern.findByIdAndUpdate(id, {
        nama,
        nim,
        nik,
        prodi,
        kampus,
        tanggalMulai,
        tanggalSelesai,
        divisi,
        status,
        pembimbing,
        userId,
        email
    });

    return NextResponse.json({ message: "Data intern berhasil diperbarui" }, { status: 200 });
}

export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    const intern = await Intern.findById(id).populate('pembimbing', 'nama');
    return NextResponse.json({ intern }, { status: 200 });
}
