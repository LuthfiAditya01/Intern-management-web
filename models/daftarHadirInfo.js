import mongoose, { Schema } from "mongoose";

const DaftarHadirScheme = new Schema({
    idUser: {
        type: String,  // Mengubah tipe dari ObjectId ke String untuk kompatibilitas dengan Firebase uid
        required: true
    },
    absenDate: {
        type: Date,
        required: true
    },
    longCordinate: {
        type: Number,
        required: true
    },
    latCordinate: {
        type: Number,
        required: true,
    },
    keteranganMasuk: {
        type: String,
        required: true,
    },
    messageText: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

// Cek apakah model sudah ada untuk mencegah error saat hot-reloading
const DaftarHadir = mongoose.models.DaftarHadir || mongoose.model('DaftarHadir', DaftarHadirScheme);

export default DaftarHadir;
