import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { connectPostgreSQL } from '../../../libs/postgresql.js';
import { User } from '../../../models/index.js';

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export async function POST(request) {
    try {
        // 1. Otorisasi Admin (Kode Anda sudah benar)
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

        // ================== PERUBAHAN DI SINI ==================
        
        await connectPostgreSQL();

        // 2. Update role di database PostgreSQL
        const userToUpdate = await User.findOne({ where: { firebaseUid: uid } });
        if (!userToUpdate) {
            return NextResponse.json({ message: `User dengan UID ${uid} tidak ditemukan di database.` }, { status: 404 });
        }
        await userToUpdate.update({ role: role });
        console.log(`Role in PostgreSQL updated to '${role}' for user ${uid}`);
        
        // 3. Set Custom Claim di Firebase (Kode Anda sudah benar)
        await getAuth().setCustomUserClaims(uid, { role: role });
        console.log(`Custom claim in Firebase set to '${role}' for user ${uid}`);

        // ================== AKHIR PERUBAHAN ==================

        return NextResponse.json({ message: `Role berhasil diubah menjadi '${role}' untuk user ${uid}` });

    } catch (error) {
        console.error("Error setting role:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.', error: error.message }, { status: 500 });
    }
}