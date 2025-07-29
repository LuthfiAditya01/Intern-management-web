import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import '../../../lib/firebase-admin';
import { connectPostgreSQL } from '../../../libs/postgresql.js';
import { User } from '../../../models/index.js';

export async function GET(request) {
    try {
        console.log('GET /api/users - Starting...');
        
        const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
        
        // Untuk production, bagian "else" ini sebaiknya dihapus agar auth selalu dicek
        if (!idToken) {
            console.log('No Authorization header found - proceeding without auth for testing');
        } else {
            console.log('Verifying Firebase token...');
            const decodedToken = await getAuth().verifyIdToken(idToken);
            if (decodedToken.role !== 'admin') {
                console.log('User is not admin');
                return NextResponse.json({ message: 'Akses ditolak' }, { status: 403 });
            }
        }

        console.log('Connecting to PostgreSQL...');
        await connectPostgreSQL();
        
        console.log('Getting users from PostgreSQL...');
        
        // ================== PERUBAHAN DI SINI ==================

        // 1. Ambil data dari DB sebagai objek biasa dan sertakan firebaseUid
        const usersFromDb = await User.findAll({
            attributes: ['firebaseUid', 'username', 'email', 'role'], // Ambil firebaseUid
            raw: true, // Hasilnya akan menjadi array of plain objects
        });

        // 2. Ubah format data agar sesuai dengan kebutuhan frontend
        const users = usersFromDb.map(dbUser => ({
            uid: dbUser.firebaseUid, // Ubah nama properti dari firebaseUid menjadi uid
            username: dbUser.username,
            email: dbUser.email,
            role: dbUser.role,
        }));

        console.log(`Found ${users.length} users`);
        return NextResponse.json({ users }); // Kirim data yang sudah diformat

    } catch (error) {
        console.error("GET /api/users - Error details:", error);
        return NextResponse.json({ 
            message: 'Terjadi kesalahan pada server.', 
            error: error.message,
        }, { status: 500 });
    }
}