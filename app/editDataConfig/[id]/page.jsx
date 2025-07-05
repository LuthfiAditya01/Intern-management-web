import InternDataManagement from "./../../../components/InternDataManagement";

const getInternDataById = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/api/intern/${id}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error("Failed to fetch information");
        }

        return res.json();
    } catch (error) {
        console.log(error);
    }
};

export default async function EditData({ params }) {
    const { id } = params;
    const { intern } = await getInternDataById(id);
    const { nama, nim, prodi, kampus, tanggalMulai, tanggalSelesai, divisi, status } = intern;

    return <InternDataManagement id={id} nama={nama} nim={nim} prodi={prodi} kampus={kampus} tanggalMulai={tanggalMulai} tanggalSelesai={tanggalSelesai} divisi={divisi} status={status} />
}