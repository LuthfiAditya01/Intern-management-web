"use client"
import ProtectedRoute from "@/components/ProtectedRoutes";
import InternDataManagement from "@/components/InternDataManagement";
import axios from "axios";

const getInternDataById = async (id) => {
    try {
        // const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        // console.log(baseUrl)
        const response = await axios.get(`http://localhost:3000/api/intern/${id}`, {
            headers: {
                'Cache-Control': 'no-store'
            }
        });
        console.log(response);

        return response.data;
    } catch (error) {
        console.log(error);
        // Tambahkan return nilai default
        return { intern: null };
    }
};

export default async function EditData({ params }) {
    const { id } = await params;
    const data = await getInternDataById(id);
    
    // Periksa apakah data.intern ada
    if (!data || !data.intern) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-red-500">Error</h2>
                    <p className="mt-2">Data intern tidak ditemukan atau terjadi kesalahan saat mengambil data.</p>
                </div>
            </div>
        );
    }
    
    const { nama, nim, prodi, kampus, tanggalMulai, tanggalSelesai, divisi, status, pembimbing } = data.intern;
    
    return (
        <ProtectedRoute>
            <InternDataManagement id={id} nama={nama} nim={nim} prodi={prodi} kampus={kampus} tanggalMulai={tanggalMulai} tanggalSelesai={tanggalSelesai} divisi={divisi} status={status} pembimbing={pembimbing} />
        </ProtectedRoute>
    )
}