import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { connectPostgreSQL } from '../../../libs/postgresql.js';
// Impor model Mentor dan User
import { User, Mentor } from '../../../models/index.js';

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export async function POST(request) {
    try {
        // 1. Otorisasi Admin
        const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ message: 'Akses ditolak: Token tidak ditemukan.' }, { status: 401 });
        }
        const decodedToken = await getAuth().verifyIdToken(idToken);
        if (decodedToken.role !== 'admin') {
            return NextResponse.json({ message: 'Akses ditolak: Anda bukan admin.' }, { status: 403 });
        }

        const { uid, role } = await request.json();
        if (!uid || !role) {
            return NextResponse.json({ message: 'UID dan role dibutuhkan.' }, { status: 400 });
        }

        // 2. Validasi Input Role
        const validRoles = ['admin', 'mentor', 'intern'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { message: `Role '${role}' tidak valid. Pilihan yang tersedia: admin, mentor, intern.` },
                { status: 400 }
            );
        }

        await connectPostgreSQL();

        // 3. Cari User di Database
        const userToUpdate = await User.findOne({ where: { firebaseUid: uid } });
        if (!userToUpdate) {
            return NextResponse.json({ message: `User dengan UID ${uid} tidak ditemukan di database.` }, { status: 404 });
        }
        
        // 4. Update Role User
        await userToUpdate.update({ role: role });
        console.log(`Role in PostgreSQL updated to '${role}' for user ${uid}`);

        // ================== LOGIKA TAMBAHAN DI SINI ==================
        
        // 5. Jika role diubah menjadi 'mentor', buat profil Mentor jika belum ada
        if (role === 'mentor') {
            const [mentorProfile, created] = await Mentor.findOrCreate({
                where: { userId: userToUpdate.id },
                defaults: {
                    // Isi dengan data default atau data dari user
                    userId: userToUpdate.id,
                    nama: userToUpdate.username, // Ambil nama dari username
                    email: userToUpdate.email,
                    nip: '000000000000000000', // NIP default, bisa diubah nanti
                    status: 'aktif',
                    divisi: 'Umum' // Divisi default, bisa diubah nanti
                }
            });

            if (created) {
                console.log(`Profil Mentor baru berhasil dibuat untuk user: ${userToUpdate.email}`);
            } else {
                console.log(`Profil Mentor untuk user ${userToUpdate.email} sudah ada.`);
            }
        }
        
        // ================== AKHIR LOGIKA TAMBAHAN ==================

        // 6. Set Custom Claim di Firebase
        await getAuth().setCustomUserClaims(uid, { role: role });
        console.log(`Custom claim in Firebase set to '${role}' for user ${uid}`);

        return NextResponse.json({ message: `Role berhasil diubah menjadi '${role}' untuk user ${uid}` });

    } catch (error) {
        console.error("Error setting role:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.', error: error.message }, { status: 500 });
    }
}