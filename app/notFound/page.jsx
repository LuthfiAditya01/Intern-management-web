"use client"

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const route = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Animated 404 Illustration */}
                <div className="mb-8 relative">
                    <div className="text-8xl md:text-9xl font-bold text-gray-200 select-none animate-pulse">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl animate-bounce">
                            🔍
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Oops! Halaman Tidak Ditemukan
                    </h1>
                    <p className="text-gray-600 text-lg mb-2">
                        Sepertinya halaman yang Anda cari tidak dapat ditemukan.
                    </p>
                    <p className="text-gray-500 mb-8">
                        Cek kembali URL yang Anda masukkan atau silahkan login terlebih dahulu untuk mengakses halaman ini.
                    </p>

                    {/* Action Buttons */}
                    <div onClick={() => route.back()} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2 group">
                                Kembali ke halaman sebelumnya
                            </button>
                    </div>
                </div>

                {/* Helpful Links
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Mungkin Anda mencari:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link href="/dashboard">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-300 cursor-pointer group">
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📊</span>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">Dashboard</span>
                            </div>
                        </Link>
                        <Link href="/dataMagang">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-300 cursor-pointer group">
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">👥</span>
                                <span className="font-medium text-gray-700 group-hover:text-green-700">Data Magang</span>
                            </div>
                        </Link>
                        <Link href="/kalender">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all duration-300 cursor-pointer group">
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📅</span>
                                <span className="font-medium text-gray-700 group-hover:text-purple-700">Kalender</span>
                            </div>
                        </Link>
                        <Link href="/addData">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all duration-300 cursor-pointer group">
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">➕</span>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700">Tambah Data</span>
                            </div>
                        </Link>
                    </div>
                </div> */}

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Jika masalah terus berlanjut, silakan hubungi administrator.
                    </p>
                </div>
            </div>
        </div>
    );
}