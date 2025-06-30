"use client"

import React, { useEffect, useState } from 'react'
import SignOutButton from './signOutButton'
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import Link from 'next/link';
import { auth } from './../app/firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(false);

    const route = useRouter();

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

    const handleBack = () => {
        route.push("/dashboard")
    }

    const activeCount = interns.filter((i) => i.status === "aktif").length;

    return (
        <div>
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className='flex flex-row'>
                        <button onClick={handleBack} className='bg-blue-500 cursor-pointer hover:bg-blue-600 font-bold mr-5 h-10 my-auto text-white rounded-lg px-3 py-2'>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div>
                            {user && (
                                <p className="text-lg font-medium text-gray-600 mb-1">
                                    Hi, {user.displayName || user.email}
                                </p>
                            )}
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Magang</h1>
                            <p className="text-gray-600">Kelola data dan monitor aktivitas magang dengan mudah</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 ">
                        <Link href="/addData">
                            <button className="bg-gradient-to-r cursor-pointer from-blue-400 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2">
                                <span className="text-xl">➕</span>
                                Tambah Anak Magang
                            </button>
                        </Link>
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    )
}
