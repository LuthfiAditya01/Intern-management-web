import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "./../hooks/useAuth";
import { useAuthAction } from "./../context/authContext";

export default function ProtectedRoute({ children }) {
    const { user, checking } = useAuth();
    const { loggingOut } = useAuthAction();
    const router = useRouter();

    useEffect(() => {
        if (!checking && !user && !loggingOut) {
            router.replace("/notFound");
        }
    }, [checking, user, loggingOut, router]);

    if (checking || (!user && !loggingOut)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 animate-pulse">Memeriksa sesi login…</p>
            </div>
        );
    }

    return children;
}
