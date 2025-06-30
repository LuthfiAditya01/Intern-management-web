"use client"

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./../app/firebase/config";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import SignOutButton from "./signOutButton";

export default function Dashboard() {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

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

    const activeCount = interns.filter((i) => i.status === "aktif").length;
    const mostCommonDivisi = interns.length
        ? interns.reduce((acc, curr) => {
            acc[curr.divisi] = (acc[curr.divisi] || 0) + 1;
            return acc;
        }, {})
        : {};

    const mostPopularDivisi = Object.entries(mostCommonDivisi).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max),
        ["", 0]
    )[0];

    const StatCard = ({ title, value, icon, color = "blue" }) => (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
                </div>
                <div className={`text-4xl bg-${color}-50 p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const MenuCard = ({ href, icon, title, description, color = "gray" }) => (
        <Link href={href}>
            <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:bg-${color}-50 cursor-pointer transition-all duration-300 hover:-translate-y-1 group`}>
                <div className="text-center">
                    <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            {user && (
                                <p className="text-lg font-medium text-gray-600 mb-1">
                                    Hi, {user.displayName || user.email}
                                </p>
                            )}
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Magang</h1>
                            <p className="text-gray-600">Kelola data dan monitor aktivitas magang dengan mudah</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 ">
                            <SignOutButton />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Memuat data...</p>
                    </div>
                ) : interns.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                        <div className="text-6xl mb-6">📋</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Belum Ada Data Anak Magang</h2>
                        <p className="text-gray-600 mb-8">Mulai dengan menambahkan data anak magang pertama Anda</p>
                        <Link href="/addData">
                            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                                Tambahkan Data Anak Magang
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard
                                title="Anak Magang Aktif"
                                value={activeCount}
                                icon="👥"
                                color="green"
                            />
                            <StatCard
                                title="Total Kuota Bulanan"
                                value={interns.length}
                                icon="📊"
                                color="blue"
                            />
                            <StatCard
                                title="Divisi Terbanyak"
                                value={mostPopularDivisi || '-'}
                                icon="🏆"
                                color="yellow"
                            />
                        </div>

                        {/* Menu Cards */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Menu Utama</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MenuCard
                                    href="/kalender"
                                    icon="📅"
                                    title="Kalender Jadwal"
                                    description="Lihat dan kelola jadwal magang"
                                    color="blue"
                                />
                                <MenuCard
                                    href="/dataMagang"
                                    icon="👥"
                                    title="Data Anak Magang"
                                    description="Kelola informasi anak magang"
                                    color="green"
                                />
                                <MenuCard
                                    href="/divisi"
                                    icon="🏢"
                                    title="Divisi & Penempatan"
                                    description="Atur divisi dan penempatan"
                                    color="purple"
                                />
                                <MenuCard
                                    href="/monitoring"
                                    icon="📊"
                                    title="Kuota & Monitoring"
                                    description="Monitor kuota dan progress"
                                    color="orange"
                                />
                            </div>
                        </div>

                        {/* Quick Stats Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Cepat</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl">✅</div>
                                    <div>
                                        <p className="font-medium text-gray-800">Status Aktif</p>
                                        <p className="text-sm text-gray-600">{activeCount} dari {interns.length} anak magang</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl">🎯</div>
                                    <div>
                                        <p className="font-medium text-gray-800">Divisi Populer</p>
                                        <p className="text-sm text-gray-600">{mostPopularDivisi || 'Belum ada data'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}