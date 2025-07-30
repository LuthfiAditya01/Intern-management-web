import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Intern from '@/models/internInfo';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    console.log('Updating nomor sertifikat for intern ID:', id);
    
    const { nomorSertifikat } = await request.json();
    console.log('New nomor sertifikat:', nomorSertifikat);

    // Validate input
    if (!nomorSertifikat || typeof nomorSertifikat !== 'string' || nomorSertifikat.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Nomor sertifikat harus diisi dan tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Find and update the intern
    const updatedIntern = await Intern.findByIdAndUpdate(
      id,
      { 
        nomorSertifikat: nomorSertifikat.trim(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedIntern) {
      return NextResponse.json(
        { success: false, message: 'Data peserta magang tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Nomor sertifikat berhasil diupdate',
      data: {
        id: updatedIntern._id,
        nomorSertifikat: updatedIntern.nomorSertifikat
      }
    });

  } catch (error) {
    console.error('Error updating nomor sertifikat:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server saat mengupdate nomor sertifikat' },
      { status: 500 }
    );
  }
}
