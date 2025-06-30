"use client";

import { auth } from "../app/firebase/config";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Pencil, Search, SortAsc, SortDesc, Trash2 } from "lucide-react";
import Modal from "./Modal";

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function Table() {
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


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        async function fetchInterns() {
            try {
                const res = await axios.get("/api/intern");
                setInterns(res.data.interns);
            } catch (error) {
                console.error("Failed to fetch interns:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchInterns();
    }, []);

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
        const term = searchTerm.toLowerCase();
        const filtered = interns.filter((i) => {
            const matchSearch =
                i.nama?.toLowerCase().includes(term) ||
                i.nim?.toLowerCase().includes(term) ||
                i.kampus?.toLowerCase().includes(term);

            const date = new Date(i.tanggalMulai);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const matchMonth = selectedMonth ? month === Number(selectedMonth) : true;
            const matchYear = selectedYear ? year === Number(selectedYear) : true;

            return matchSearch && matchMonth && matchYear;
        });

        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.tanggalMulai);
            const dateB = new Date(b.tanggalMulai);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        return sorted;
    }, [interns, searchTerm, sortOrder, selectedMonth, selectedYear]);


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
            case 'pti':
                return 'text-blue-700 bg-blue-100';
            case 'sektoral':
                return 'text-pink-700 bg-pink-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };


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
            <Card className="border-0">
                <CardHeader>
                    <CardTitle className="mx-auto text-2xl font-bold">
                        Data Peserta Magang
                    </CardTitle>
                    <div className="flex gap-4 mt-4 mx-auto">
                        {/* Search input */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama, NIM, kampus…"
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            {/* Filter Button */}
                            <select
                                className="border rounded-lg px-3 py-2 cursor-pointer"
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

                            <select
                                className="border rounded-lg px-3 py-2 cursor-pointer"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Semua Tahun</option>
                                {[2023, 2024, 2025].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Sort button */}
                        <button
                            onClick={toggleSortOrder}
                            className="flex cursor-pointer items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            {sortOrder === "desc" ? <SortDesc size={20} /> : <SortAsc size={20} />}
                            Sort by Start
                        </button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 select-none">No.</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 select-none">Nama</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 select-none">NIM</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 select-none">Program Studi</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 select-none">Universitas</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 select-none">Timeline</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 select-none">Divisi</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 select-none">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedInterns.length > 0 ? (
                                    processedInterns.map((intern, index) => (
                                        <tr key={intern._id || index} className="border-b hover:bg-gray-50 items-center">
                                            <td className="px-6 py-4 select-none">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{intern.nama}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{intern.nim}</td>
                                            <td className="px-6 py-4">{intern.prodi}</td>
                                            <td className="px-6 py-4">{intern.kampus}</td>
                                            <td className="px-6 py-4">
                                                {formatDate(intern.tanggalMulai)} – {formatDate(intern.tanggalSelesai)}
                                            </td>
                                            <td className="px-6 py-4 relative">
                                                <div className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 inline-flex items-center select-none px-3 py-1 rounded-full text-sm font-medium ${getDivisionColor(intern.divisi)}`}>
                                                    {intern.divisi}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">{intern.status}</td>
                                            <td className="px-6 py-4 flex flex-row gap-2">
                                                <button
                                                    onClick={() => openDeleteModal(intern._id, intern.nama, intern.nim, intern.prodi, intern.kampus, intern.tanggalMulai, intern.tanggalSelesai, intern.divisi, intern.status)}
                                                    className="p-1 cursor-pointer rounded-full hover:bg-red-50 text-red-600"
                                                    title="Delete"
                                                >
                                                    <Pencil size={20} className="text-blue-500" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(intern._id, intern.nama, intern.nim, intern.prodi, intern.kampus, intern.tanggalMulai, intern.tanggalSelesai, intern.divisi, intern.status)}
                                                    className="p-1 cursor-pointer rounded-full hover:bg-red-50 text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
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
