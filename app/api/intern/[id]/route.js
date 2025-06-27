import connectMongoDB from "./../../../../libs/mongodb";
import Intern from "./../../../../models/internInfo";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    const { id } = params;

    const {
        newNama: nama,
        newNim: nim,
        newProdi: prodi,
        newKampus: kampus,
        newTanggalMulai: tanggalMulai,
        newTanggalSelesai: tanggalSelesai,
        newDivisi: divisi,
        newStatus: status
    } = await request.json();

    await connectMongoDB();

    await Intern.findByIdAndUpdate(id, {
        nama,
        nim,
        prodi,
        kampus,
        tanggalMulai,
        tanggalSelesai,
        divisi,
        status
    });

    return NextResponse.json({ message: "Data intern berhasil diperbarui" }, { status: 200 });
}

export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    const intern = await Intern.findOne({ _id: id });
    return NextResponse.json({ intern }, { status: 200 });
}
