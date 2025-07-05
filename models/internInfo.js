import mongoose from "mongoose";
import { Schema } from "mongoose";

const internSchema = new Schema({
    nama: {
        type: String,
        required: true,
    },
    nim: {
        type: String,
        required: true,
    },
    nik: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    prodi: {
        type: String,
        required: true,
    },
    kampus: {
        type: String,
        required: true,
    },
    tanggalMulai: {
        type: Date,
        required: true,
    },
    tanggalSelesai: {
        type: Date,
        required: true,
    },
    divisi: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['aktif', 'selesai', 'dikeluarkan', 'pending'],
        required: false,
    },
    pembimbing: {
        type: String,
        enum: ["Ari Rusmasari", "Gun Gun Nugraha"],
        required: true,
    },
    userId: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        
    }
}, {
    timestamps: true
});

const Intern = mongoose.models.Intern || mongoose.model("Intern", internSchema);

export default Intern;
