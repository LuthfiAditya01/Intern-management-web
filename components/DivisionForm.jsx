"use client"

import { ArrowLeft, CheckCircle, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import SuccessModal from './SuccessModal';

// 1. Terima satu prop 'intern'
export default function DivisionForm({ intern }) {

    // 2. Destructuring untuk mendapatkan semua data dari 'intern'
    const { id, nama, divisi } = intern;

    // 3. Inisialisasi state dari variabel yang sudah di-destructuring
    const [newDivisi, setNewDivisi] = useState(divisi || "");
    const [loading, setLoading] = useState(false); // Loading diatur ke false pada awalnya
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const route = useRouter();

    // 4. useEffect untuk fetch data SUDAH DIHAPUS

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 5. Gunakan 'id' dari hasil destructuring saat submit
            const response = await fetch(`http://localhost:3000/api/intern/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // Perbaiki typo 'Conten-Type'
                },
                body: JSON.stringify({
                    newDivisi: newDivisi
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Gagal menyimpan data peserta magang');
            }
            setShowSuccessModal(true);

        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const divisionOptions = [
        { value: "Umum", label: "Umum" },
        { value: "Produksi", label: "Produksi" },
        { value: "Sosial", label: "Sosial" },
        { value: "Distribusi", label: "Distribusi" },
        { value: "Nerwilis", label: "Nerwilis" },
        { value: "PTID", label: "PTID" },
        { value: "Sektoral", label: "Sektoral" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => route.push('/assignDivision')}
                        className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Kembali</span>
                    </button>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Penempatan Tim Anak Magang</h1>
                        <p className="text-gray-600">Lengkapi formulir di bawah untuk memilih penempatan Tim</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Informasi Peserta Magang
                                </h3>
                                <div className="md:col-span-2">
                                    <label className="block text-md font-medium text-gray-700 mb-2">
                                        Nama Lengkap
                                    </label>
                                    <div className='text-4xl font-bold text-center p-2 bg-gray-50 rounded-lg'>{nama}</div>
                                </div>
                            </div>

                            {/* Assignment Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    Penempatan Tim
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tim
                                    </label>
                                    <select
                                        name="tim"
                                        value={newDivisi}
                                        onChange={(e) => setNewDivisi(e.target.value)}
                                        required
                                        className="w-full cursor-pointer px-4 py-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Pilih Tim</option>
                                        {divisionOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-3 text-center text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => route.back()}
                                        className="flex-1 px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={20} />
                                                Perbarui Data
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Tim Berhasil Diupdate!"
                message="Selamat, data berhasil diperbarui."
                buttonText="Lihat Semua Data"
                redirectUrl="/assignDivision"
            />
        </div>
    )
}