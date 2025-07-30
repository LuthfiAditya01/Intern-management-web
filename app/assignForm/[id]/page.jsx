import DivisionForm from '@/components/DivisionForm';
import ProtectedRoute from '@/components/ProtectedRoutes';
import React from 'react'

const getInternDataById = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/api/intern/${id}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error("Failed to fetch information");
        }

        return res.json();
    } catch (error) {
        console.log(error);
        return { intern: null }; // <-- PERUBAHAN DI SINI
    }
};

export default async function AssignForm({ params }) {
    const { id } = params;
    const { intern } = await getInternDataById(id);

    if (!intern) {
        return <div>Data tidak ditemukan.</div>;
    }

    return (
        <ProtectedRoute>
            {/* Kirim seluruh objek 'intern', bukan properti terpisah */}
            <DivisionForm intern={intern} />
        </ProtectedRoute>
    )
}
