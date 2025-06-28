'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useSignInWithEmailAndPassword,
    useCreateUserWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './../app/firebase/config';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Modal from './Modal';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPwd, setShowPwd] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    // modal state
    const [confirmReset, setConfirmReset] = useState(false);
    const [notifSent, setNotifSent] = useState(false);
    const [alert, setAlert] = useState(false);
    const [sendingReset, setSendingReset] = useState(false);

    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [signInWithEmailAndPassword, user, loading, signInErr] =
        useSignInWithEmailAndPassword(auth);
    const [createUserWithEmailAndPassword, newUser, creating, signUpErr] =
        useCreateUserWithEmailAndPassword(auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/dashboard');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            await signInWithEmailAndPassword(form.email, form.password);
        } else {
            const cred = await createUserWithEmailAndPassword(form.email, form.password);
            if (cred?.user && form.name.trim()) {
                await updateProfile(cred.user, { displayName: form.name.trim() });
            }
        }
    };

    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const handleForgotPassword = async () => {
        if (!form.email) {
            setAlert(true);
        } else {
            setConfirmReset(true);
        }
    };

    const handleConfirmForgot = async () => {
        if (!form.email) {
            alert("Silakan masukkan email terlebih dahulu");
            return;
        }

        setSendingReset(true);

        try {
            await sendPasswordResetEmail(auth, form.email);
            setConfirmReset(false);
            setNotifSent(true);
            console.log("Email reset password berhasil dikirim!");
        } catch (error) {
            console.error("Error sending password reset email:", error);

            if (error.code === "auth/user-not-found") {
                alert("Email tidak terdaftar.");
            } else if (error.code === "auth/invalid-email") {
                alert("Format email tidak valid.");
            } else if (error.code === "auth/too-many-requests") {
                alert("Terlalu banyak permintaan. Coba lagi nanti.");
            } else {
                alert("Terjadi kesalahan saat mengirim email reset. Coba lagi.");
            }
        } finally {
            setSendingReset(false);
        }
    };

    function getFriendlyError(error) {
        if (!error) return null;

        const code = error.code || "";

        switch (code) {
            case "auth/invalid-email":
                return "Format email tidak valid.";
            case "auth/user-not-found":
                return "Email tidak ditemukan.";
            case "auth/wrong-password":
                return "Password salah.";
            case "auth/email-already-in-use":
                return "Email sudah digunakan.";
            case "auth/weak-password":
                return "Password terlalu lemah. Gunakan minimal 6 karakter.";
            case "auth/invalid-credential":
                return "Gagal login. Password atau email tidak valid.";
            default:
                return "Terjadi kesalahan. Silakan coba lagi.";
        }
    }



    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* modals */}

            <Modal
                isOpen={confirmReset}
                onClose={() => setConfirmReset(false)}
                title="Konfirmasi Reset Password"
                message="Apakah Anda yakin ingin mengirimkan link reset password ke email Anda?"
                type="confirmation"
                onConfirm={handleConfirmForgot}
                confirmText="Ya, Kirim"
                cancelText="Batal"
            />

            <Modal
                isOpen={alert}
                onClose={() => setAlert(false)}
                title="Email masih kosong!"
                message="Silahkan masukkan email terlebih dahulu"
                type="notification"
            />

            <Modal
                isOpen={notifSent}
                onClose={() => setNotifSent(false)}
                title="Email Terkirim"
                message={`Link reset password telah dikirim ke ${form.email}. Silakan cek email Anda.`}
                type="notification"
            />

            <div className="w-full max-w-xl">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <img src="/assets/image/bps.png" alt="logo" className="w-full" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {isLogin ? (
                                <>
                                    Selamat Datang di <span className="text-blue-600">MAGNET!</span>
                                </>
                            ) : (
                                'Buat Akun'
                            )}
                        </h1>
                        <p className="text-gray-600">
                            {isLogin
                                ? 'Magang dan Monitoring Elektronik Terpadu'
                                : 'Langkah Awal Menuju Masa Depan Berbasis Data'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <Field
                                icon={<User className="h-5 w-5 text-gray-400" />}
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        )}
                        <Field
                            icon={<Mail className="h-5 w-5 text-gray-400" />}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <Field
                            icon={<Lock className="h-5 w-5 text-gray-400" />}
                            type={showPwd ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            append={
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            }
                        />
                        {isLogin && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-sm text-blue-600 cursor-pointer hover:text-blue-700"
                                >
                                    Lupa password?
                                </button>
                            </div>
                        )}
                        {(signInErr || signUpErr) && (
                            <p className="text-sm text-red-600 text-center mt-2">
                                {getFriendlyError(signInErr || signUpErr)}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                            disabled={loading || creating}
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                        </p>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setForm({ name: '', email: '', password: '' });
                            }}
                            className="mt-2 text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>

                    <div className="mt-8 flex items-center">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-sm text-gray-500">atau lanjutkan dengan</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleGoogle}
                            className="w-full flex items-center cursor-pointer justify-center px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                    </div>
                </div>
                <p className="text-center text-white/60 text-sm mt-8">
                    © 2025 Kota Bandar Lampung BPS
                </p>
            </div>
        </div>
    );
}

function Field({ icon, append, ...rest }) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                {...rest}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {append && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {append}
                </div>
            )}
        </div>
    );
}
