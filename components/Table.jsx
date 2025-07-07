"use client";

import { auth } from "../app/firebase/config";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Pencil, Search, SortAsc, SortDesc, Trash2 } from "lucide-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchInternsByMonth } from "@/utils/getInternsByMonth";


const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function Table(intern) {
    const [user, setUser] = useState(null);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [deleteModal, setDeleteModal] = useState(
        {
            isOpen: false,
            internId: null,
            internInfo: ''
        }
    );
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const route = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const token = await user.getIdTokenResult();
                const admin = token.claims.role === "admin";
                setIsAdmin(admin)
                if (token.claims.role === "admin") {
                    console.log("👑 Ini admin");
                } else {
                    console.log("🙅‍♂️ Bukan admin");
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const monthQuery =
                    selectedYear && selectedMonth
                        ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`
                        : null;

                let data;
                if (monthQuery) {
                    const result = await fetchInternsByMonth(monthQuery);
                    data = result.interns;
                } else {
                    const res = await axios.get("/api/intern");
                    data = res.data.interns;
                }

                setInterns(data);
            } catch (error) {
                console.error("Gagal memuat data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [selectedMonth, selectedYear]);


    const openDeleteModal = (internId, internInfo) => {
        setDeleteModal({
            isOpen: true,
            internId,
            internInfo
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            internId: null,
            internInfo: ''
        });
    };

    const handleDelete = async () => {
        try {
            const internId = deleteModal.internId;
            if (!internId) return;

            const res = await fetch(`/api/intern?id=${internId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete data");
            }

            setInterns(interns.filter(intern => intern._id !== internId));
            closeDeleteModal();
        } catch (error) {
            console.error("Error deleting data intern:", error);
            setError(error.message);
            closeDeleteModal();
        }
    };

    const toggleSortOrder = () =>
        setSortOrder(sortOrder === "desc" ? "asc" : "desc");

    const processedInterns = useMemo(() => {
        const filtered = searchTerm
            ? interns.filter((i) =>
                i.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                i.nim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                i.kampus?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : interns;

        const sorted = [...filtered].sort((a, b) => {
            const dateA = new Date(a.tanggalMulai);
            const dateB = new Date(b.tanggalMulai);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        return sorted;
    }, [interns, searchTerm, sortOrder]);


    if (loading) {
        return <div className="text-center py-10">Loading data…</div>;
    }

    const getDivisionColor = (divisi) => {
        switch (divisi.toLowerCase()) {
            case 'umum':
                return 'text-slate-700 bg-slate-100';
            case 'produksi':
                return 'text-orange-700 bg-orange-100';
            case 'sosial':
                return 'text-yellow-700 bg-yellow-100';
            case 'distribusi':
                return 'text-purple-700 bg-purple-100';
            case 'nerwilis':
                return 'text-emerald-700 bg-emerald-100';
            case 'ptid':
                return 'text-blue-700 bg-blue-100';
            case 'sektoral':
                return 'text-pink-700 bg-pink-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'aktif':
                return 'text-green-500';
            case 'pending':
                return 'text-yellow-500';
            case 'selesai':
                return 'text-blue-500';
            case 'dikeluarkan':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const editRoute = () => {
        setLoading(true);
        route.push(`/editDataConfig/${id}`)
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                title="Konfirmasi Penghapusan"
                message="Apakah Anda yakin ingin menghapus data secara permanen?"
                type="confirmation"
                onConfirm={handleDelete}
                confirmText="Ya"
                cancelText="Batal"
            />

            <Card className="border-0 md:max-w-8xl">
                <CardHeader>
                    <CardTitle className="mx-auto text-2xl font-bold text-center">
                        Data Peserta Magang
                    </CardTitle>

                    <div className="mt-6 grid max-w-9xl md:max-w-7xl mx-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama, NIM, kampus…"
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Bulan */}
                        <select
                            className="border cursor-pointer rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">Semua Bulan</option>
                            {[
                                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                            ].map((month, index) => (
                                <option key={index} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>

                        {/* Filter Tahun */}
                        <select
                            className="border cursor-pointer rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="">Semua Tahun</option>
                            {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        {/* Sort Button */}
                        <button
                            onClick={toggleSortOrder}
                            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 w-full"
                        >
                            {sortOrder === "desc" ? <SortDesc size={20} /> : <SortAsc size={20} />}
                            <span>Sort by Start</span>
                        </button>
                    </div>
                </CardHeader>


                <CardContent>
                    <div className="overflow-x-auto rounded-xl">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">No.</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">Nama</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">NIM</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">Program Studi</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">Universitas</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">Timeline</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">Divisi</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">Status</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium bg-neutral-100 text-black">Pembimbing</th>
                                    {isAdmin && (
                                        <th className="px-6 py-3 text-sm bg-neutral-100 text-black">Aksi</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {processedInterns.length > 0 ? (
                                    processedInterns.map((intern, index) => (
                                        <tr key={intern._id || index} className="border-b border-gray-300 hover:bg-gray-50">
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{intern.nama}</td>
                                            <td className="px-6 py-4">{intern.nim}</td>
                                            <td className="px-6 py-4 text-center">{intern.prodi}</td>
                                            <td className="px-6 py-4 text-center">{intern.kampus}</td>
                                            <td className="px-6 py-4">
                                                {formatDate(intern.tanggalMulai)} – {formatDate(intern.tanggalSelesai)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDivisionColor(intern.divisi)}`}>
                                                    {intern.divisi}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center capitalize px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(intern.status)}`}>
                                                    {intern.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">{intern.pembimbing}</td>
                                            {isAdmin && (
                                                <td className="px-6 py-4 flex gap-2">
                                                    <Link
                                                        href={`/editDataConfig/${intern._id}`}
                                                        className="p-1 rounded-full hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={20} className="text-blue-600" />
                                                    </Link>
                                                    <button
                                                        onClick={() => openDeleteModal(intern._id, intern.nama)}
                                                        className="cursor-pointer p-1 rounded-full hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={20} className="text-red-600" />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center text-gray-500 py-4">
                                            Tidak ada data magang.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

}
