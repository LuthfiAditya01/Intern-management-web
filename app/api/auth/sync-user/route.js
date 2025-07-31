import { NextResponse } from 'next/server';
import { connectPostgreSQL } from '../../../../libs/postgresql.js';
import User from '../../../../models/User.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firebaseUid, email, username } = body;

    // Validasi input sederhana
    if (!firebaseUid || !email) {
      return NextResponse.json(
        { message: 'firebaseUid dan email wajib diisi.' },
        { status: 400 }
      );
    }

    await connectPostgreSQL();

    // Cari pengguna berdasarkan email terlebih dahulu (untuk handle kasus temporary users)
    let user = await User.findOne({ where: { email: email } });
    let created = false;
    
    if (user && user.isTemporary) {
      // Jika user ditemukan tapi masih temporary, update dengan firebaseUid yang sebenarnya
      await user.update({
        firebaseUid: firebaseUid,
        isTemporary: false
      });
      console.log(`Updated temporary user: ${user.email} with Firebase UID: ${firebaseUid}`);
    } else if (!user) {
      // Jika tidak ada user dengan email tersebut, buat baru
      [user, created] = await User.findOrCreate({
        where: { firebaseUid: firebaseUid },
        defaults: {
          firebaseUid: firebaseUid,
          email: email,
          username: username || email.split('@')[0], // Gunakan username jika ada, jika tidak, gunakan bagian email
          role: 'intern', // Role default untuk pengguna baru
          isTemporary: false
        },
      });
    }

    // `created` adalah boolean (true jika user baru dibuat, false jika sudah ada)
    console.log(`User sync: ${user.email}, Created: ${created}`);

    // Kirim kembali data pengguna dari database (termasuk rolenya)
    return NextResponse.json({ 
        message: created ? 'User baru berhasil dibuat di database.' : 'User sudah ada, sinkronisasi berhasil.',
        user: user 
    }, { status: created ? 201 : 200 });

  } catch (error) {
    console.error('API Sync User Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat sinkronisasi pengguna.', error: error.message },
      { status: 500 }
    );
  }
}