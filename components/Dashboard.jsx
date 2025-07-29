"use client"

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./../app/firebase/config";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import SignOutButton from "./signOutButton";
import { useRouter } from "next/navigation";

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};


export default function Dashboard() {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [kuota, setKuota] = useState("15");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPembimbing, setIsPembimbing] = useState(false);
    const [userStatus, setUserStatus] = useState("pending");
    const [userDivision, setUserDivision] = useState("-");
    const [userPeriod, setUserPeriod] = useState(null);
    const [userInternData, setUserInternData] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    const [userGrade, setUserGrade] = useState("-");
    const [userMentor, setUserMentor] = useState("-");
    const [hasCertificate, setHasCertificate] = useState(false);

    const route = useRouter();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const token = await user.getIdTokenResult();
                const admin = token.claims.role === "admin";
                const pembimbing = token.claims.role === "pembimbing";
                setIsAdmin(admin);
                setIsPembimbing(pembimbing);
                if (token.claims.role === "pembimbing") {
                    console.log("ini pembimbing");
                } else {
                    console.log("ini bukan pembimbing")
                }
                if (token.claims.role === "admin") {
                    console.log("👑 Ini admin");
                } else {
                    console.log("🙅‍♂️ Bukan admin");
                    console.log(token);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user && interns.length > 0) {
            const me = interns.find((i) => i.userId === user.uid);
            if (me) {
                setUserInternData(me);
                setUserStatus(me.status ?? "pending");
                setUserDivision(me.divisi ?? "-");
                setUserMentor(me.pembimbing ?? "-")
                setUserPeriod(`${formatDate(me.tanggalMulai)} s.d. ${formatDate(me.tanggalSelesai)}`);
            }
        }
    }, [user, interns]);


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

    useEffect(() => {
        const fetchGrade = async () => {
            if (!userInternData) return;

            try {
                const res = await axios.get(
                    `/api/assessment?internId=${userInternData._id}`
                );

                if (res.data.success && res.data.assessments.length > 0) {
                    const aspek = res.data.assessments[0].aspekNilai;
                    const numbers = Object.values(aspek).filter(
                        (v) => typeof v === "number" && v >= 0
                    );
                    const avg =
                        numbers.length > 0
                            ? Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length)
                            : "-";

                    setUserGrade(avg);
                } else {
                    setUserGrade("-");
                }
            } catch (err) {
                console.error("Gagal mengambil nilai:", err);
                setUserGrade("-");
            }
        };

        fetchGrade();
    }, [userInternData]);

    useEffect(() => {
        const checkCertificateStatus = async () => {
            if (!userInternData) return;
            
            try {
              // Simply check the isSertifikatVerified flag directly from userInternData
              setHasCertificate(userInternData.isSertifikatVerified === true);
              console.log("Certificate status:", userInternData.isSertifikatVerified);
            } catch (error) {
              console.error("Error checking certificate status:", error);
              setHasCertificate(false);
            }
        };
          
        checkCertificateStatus();
    }, [userInternData]);


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
                    <p className={`text-3xl capitalize font-bold text-${color}-600`}>{value}</p>
                </div>
                <div className={`text-4xl bg-${color}-50 p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const MenuCard = ({ href, icon, title, description, color = "gray", onClick }) => (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:bg-${color}-50 cursor-pointer transition-all duration-300 hover:-translate-y-1 group`}
        >
            <div className="text-center">
                <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );

    const handleMenuClick = (href) => {
        setPageLoading(true);
        setTimeout(() => {
            route.push(href);
        }, 500);
    };

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            {userInternData && (
                                <p className="text-lg font-medium text-gray-600 mb-1">
                                    Hi, {userInternData.nama}
                                </p>
                            )}
                            {isAdmin && (
                                <h1 className="text-3xl font-bold text-gray-800 mb-2"><span className="text-blue-500">ADMIN</span></h1>
                            )}
                            {isPembimbing && (
                                <h1 className="text-3xl font-bold text-gray-800 mb-2"><span className="text-blue-500">PEMBIMBING</span></h1>
                            )}
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard <span className="text-blue-500">MAGNET</span></h1>
                            {isAdmin ? (
                                <p className="text-gray-600">Kelola data dan monitor aktivitas magang dengan mudah</p>
                            ) : (
                                <p className="text-gray-600">Pantau Status Pengajuan Magang dan Progress Magang Kamu Di Sini</p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 ">
                            {isAdmin && (
                                <button
                                    onClick={() => route.push('/admin')}
                                    className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    Pengaturan Role
                                </button>
                            )}
                            <SignOutButton />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Memuat data...</p>
                    </div>
                ) : (
                    isAdmin || isPembimbing ? (
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
                                    title="Total Kuota Harian"
                                    value={kuota}
                                    icon="📊"
                                    color="blue"
                                />
                                <StatCard
                                    title="Tim Dengan Peserta Magang Terbanyak"
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
                                        icon="📅"
                                        title="Kalender Jadwal"
                                        description="Lihat dan kelola jadwal magang"
                                        color="blue"
                                        onClick={() => handleMenuClick("/kalender")}
                                    />

                                    <MenuCard
                                        onClick={() => handleMenuClick("/dataMagang")}
                                        icon="👥"
                                        title="Data Peserta Magang"
                                        description="Kelola informasi peserta magang"
                                        color="green"
                                    />
                                    <MenuCard
                                        onClick={() => handleMenuClick("/divisi")}
                                        icon="🏢"
                                        title="Tim & Penempatan"
                                        description="Atur tim dan penempatan"
                                        color="purple"
                                    />
                                    <MenuCard
                                        onClick={() => handleMenuClick("/quotaManagement")}
                                        icon="📊"
                                        title="Kuota & Monitoring"
                                        description="Monitor kuota dan progress"
                                        color="orange"
                                    />
                                    <MenuCard
                                        icon="📑"
                                        title="Pemantauan Daftar Hadir"
                                        description="Pantau Riwayat Daftar Hadir Peserta Magang"
                                        color="blue"
                                        onClick={() => handleMenuClick("/kalender")}
                                    />

                                    <MenuCard
                                        onClick={() => handleMenuClick("/dataMagang")}
                                        icon="⚙️"
                                        title="Pengaturan Daftar Hadir"
                                        description="Atur batas jam masuk, pulang, batas jarak daftar hadir, dan titik lokasi pusat"
                                        color="green"
                                    />
                                    <MenuCard
                                        onClick={() => handleMenuClick("/templateSertifikat")}
                                        icon="🎨"
                                        title="Template Sertifikat"
                                        description="Atur Template Sertifikat"
                                        color="purple"
                                    />
                                    <MenuCard
                                        onClick={() => handleMenuClick("/sertifikat")}
                                        icon="✅"
                                        title="Verifikasi Sertifikat"
                                        description="Verifikasi Peserta yang mendapatkan sertifikat"
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
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {userInternData && (
                                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        Halo, <span className="text-blue-500">{userInternData.nama}</span> 👋
                                    </h2>
                                    <div className="grid grid-cols-1 gap-y-2 text-gray-700 text-sm">
                                        <div className="text-xl">
                                            <span className="font-semibold text-gray-600">NIM:</span> {userInternData.nim}
                                        </div>
                                        <div className="text-xl">
                                            <span className="font-semibold text-gray-600">Prodi:</span> {userInternData.prodi}
                                        </div>
                                        <div className="text-xl">
                                            <span className="font-semibold text-gray-600">Kampus:</span> {userInternData.kampus}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 gap-6 mb-8">
                                <StatCard
                                    title="Status Magang Kamu"
                                    value={userStatus}
                                    icon="⌛"
                                    color="green"
                                />
                                <StatCard
                                    title="Tim Kamu Saat Ini"
                                    value={userDivision}
                                    icon="🏛️"
                                    color="blue"
                                />
                                <StatCard
                                    title="Pembimbing Kamu Saat Ini"
                                    value={userMentor}
                                    icon="👤"
                                    color="blue"
                                />
                                <StatCard
                                    title="Periode Magang Kamu"
                                    value={userPeriod}
                                    icon="🗓️"
                                    color="yellow"
                                />
                                <StatCard
                                    title="Nilai Magang Kamu"
                                    value={userGrade === "-" ? "Belum ada nilai" : userGrade}
                                    icon="⭐"
                                    color="blue"
                                />
                            </div>

                            {/* Menu Cards */}
                            {
                                userStatus=="pending"&&(
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-gray-800 mb-6">Menu Utama</h2>
                                        <div className="grid grid-cols-1 gap-6">
                                            <MenuCard
                                                onClick={() => handleMenuClick("/dashboard")}
                                                icon="🗓️"
                                               
                                                description="Lihat ketersediaan jadwal magang"
                                                color="blue"
                                            />
                                        </div>
                                    </div>
                                )
                            }{
                                userStatus!=="pending"&&(
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-gray-800 mb-6">Menu Utama</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                            <MenuCard
                                                onClick={() => handleMenuClick("/dashboard")}
                                                icon="🗓️"
                                               
                                                description="Lihat ketersediaan jadwal magang"
                                                color="blue"
                                            />
                                            <MenuCard
                                                onClick={() => handleMenuClick("/historiDaftarHadir")}
                                                icon="🔄"
                                                title="Histori Daftar Hadir"
                                                description="Lihat histori daftar hadirmu!"
                                                color="green"
                                            />
                                            <MenuCard
                                                onClick={() => {
                                                    if (hasCertificate) {
                                                        route.push("/sertifikatSaya");
                                                    } else {
                                                        alert("Sertifikat belum tersedia atau belum diverifikasi oleh admin.");
                                                    }
                                                }}
                                                icon="📜"
                                                title="Sertifikat"
                                                description={hasCertificate ? "Lihat dan unduh sertifikatmu" : "Sertifikat belum diverifikasi"}
                                                color={hasCertificate ? "green" : "gray"}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                            
                            {
                                userStatus!=="pending"&&(
                                    <div className="fixed bottom-5 right-5 hover:bottom-7 transition-all ease-out duration-200 z-50">
                                        <Link href={"/absen"} className="bg-blue-500 focus:bg-blue-700 focus:translate-y-8 rounded-2xl hover:bg-blue-700 hover:px-6 hover:py-4 hover:rounded-xl text-white px-4 py-3 hover:shadow-lg font-medium transition-all ease-out duration-300"> 
                                            ✅ Isi Daftar Hadir
                                        </Link>
                                    </div>
                                )
                            }
                        </>
                    )
                )}
                {loading ? (
                    <div className="text-center py-6">Loading...</div>
                ) : isPembimbing ? (
                    <div className="mb-6">
                        <MenuCard
                            onClick={() => handleMenuClick("/penilaian")}
                            icon="📝"
                            title="Penugasan & Penilaian"
                            description="Penilaian peserta magang"
                            color="green"
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}