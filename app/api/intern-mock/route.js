import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        console.log('GET /api/intern-mock - Starting...');
        
        // Mock data for testing
        const mockInterns = [
            {
                id: '1',
                userId: 'user1',
                email: 'intern1@example.com',
                nama: 'John Doe',
                nim: '123456789',
                nik: '1234567890123456',
                prodi: 'Informatika',
                kampus: 'Universitas Example',
                tanggalMulai: '2025-01-01',
                tanggalSelesai: '2025-06-30',
                divisi: 'IT',
                status: 'aktif',
                mentor: {
                    id: '1',
                    nama: 'Dr. Smith',
                    nip: '123456789',
                    divisi: 'IT'
                },
                user: {
                    id: 'user1',
                    username: 'johndoe',
                    email: 'intern1@example.com',
                    role: 'intern'
                }
            },
            {
                id: '2',
                userId: 'user2',
                email: 'intern2@example.com',
                nama: 'Jane Smith',
                nim: '987654321',
                nik: '6543210987654321',
                prodi: 'Sistem Informasi',
                kampus: 'Universitas Example',
                tanggalMulai: '2025-02-01',
                tanggalSelesai: '2025-07-31',
                divisi: 'HR',
                status: 'aktif',
                mentor: {
                    id: '2',
                    nama: 'Dr. Johnson',
                    nip: '987654321',
                    divisi: 'HR'
                },
                user: {
                    id: 'user2',
                    username: 'janesmith',
                    email: 'intern2@example.com',
                    role: 'intern'
                }
            }
        ];
        
        console.log(`Returning ${mockInterns.length} mock interns`);
        return NextResponse.json({ 
            interns: mockInterns,
            message: 'Mock intern data loaded successfully',
            database: 'Mock'
        });

    } catch (error) {
        console.error("GET /api/intern-mock - Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({ 
            message: 'Terjadi kesalahan pada server.', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 