import Intern from "./../../../models/internInfo";
import connectMongoDB from "./../../../libs/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    const {
        nama,
        nim,
        prodi,
        kampus,
        tanggalMulai,
        tanggalSelesai,
        divisi,
        status,
    } = await request.json();

    await connectMongoDB();

    await Intern.create({
        nama,
        nim,
        prodi,
        kampus,
        tanggalMulai,
        tanggalSelesai,
        divisi,
        status,
    });

    return NextResponse.json(
        { message: "Data intern berhasil ditambahkan" },
        { status: 201 }
    );
}

export async function GET() {
    await connectMongoDB();
    const interns = await Intern.find();
    return NextResponse.json({ interns });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Intern.findByIdAndDelete(id);
    return NextResponse.json({ message: "Data intern berhasil dihapus" }, { status: 200 });
}
