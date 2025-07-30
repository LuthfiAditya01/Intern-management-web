import ProtectedRoute from '@/components/ProtectedRoutes';
import HistoriDaftarHadir from '@/components/historidaftarhadir';
import useEffect from 'react';

export default function historiDaftarHadir(){
    return(
        <ProtectedRoute>
            <HistoriDaftarHadir />
        </ProtectedRoute>
    )
}