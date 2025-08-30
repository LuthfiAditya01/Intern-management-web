"use client"

import React, { useEffect, useState } from 'react'
import SignOutButton from './signOutButton'
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import Link from 'next/link';
import { auth } from './../app/firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function NavbarGeneral({ title, subTitle }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userInternData, setUserInternData] = useState(null);
    const [interns, setInterns] = useState([]);

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
        if (user && interns.length > 0) {
            const me = interns.find((i) => i.userId === user.uid);
            if (me) {
                setUserInternData(me);
            }
        }
    }, [user, interns]);

    const handleBack = () => {
        route.push("/dashboard")
    }

    return (
        <div>
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-lg border md:max-w-7xl mx-auto border-gray-100 p-2.5 md:p-6 mb-8">
                <div className="flex flex-col md:flex-row items-start sm:items-center justify-between gap-4">
                    <div className='flex flex-row'>
                        <button onClick={handleBack} className='bg-white cursor-pointer hover:bg-zinc-100 border-2 border-blue-500 font-bold mr-5 h-10 md:my-auto mt-9 text-white rounded-lg px-3 py-2'>
                            <FontAwesomeIcon icon={faArrowLeft} style={{ color: '#0290fd' }} />
                        </button>
                        <div>
                            {userInternData && (
                                <p className="text-lg font-medium md:text-left text-center text-gray-600 mb-1">
                                    Hi, {userInternData.nama}
                                </p>
                            )}
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                            <p className="text-gray-600 md:block hidden">{subTitle}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:mx-0 mx-auto sm:items-center gap-5 ">
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    )
}
