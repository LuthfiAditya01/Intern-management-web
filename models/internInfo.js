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
        enum: ["Belum Di Set", "Ari Rusmasari", "Gun Gun Nugraha", "Evie Ermawati", "Ahmad Riadi", "Alberto Maradona", "Andika Nur Budiharso", "Anggi Budi Pratiwi", "Anita Desmarini", "Bagus Prio Sambodo", "Belinda Yena Putri", "Darul Ambardi", "Erika Haryulistiani", "Faza Nur Fuadina", "Habni Hamara Azmatiy", "Ikhsan", "Indra Kurniawan", "Kaisar Samudra", "Risdiyanto", "Rizki Abdi Utama", "Santi Yuli Elida Aritonang", "Sari Citra Pratiwi", "Sasma Senimawarti M", "Anne Oktavia Andriyani", "Aprilia Puspita", "Erika Santi", "Erwan Jafrilda", "Fahroni Agustarita", "Mertha Pessela", "Muhammad Vicky Lukito", "Muhammad Rafiqo Ardi", "Shista Virgo Winatha", "Viona Rahma Agustin", "Wasilawati"],
        default: "Belum Di Set",
    },
    userId: {
        type: String,
        index: true,
    },
    email: {
        type: String,
    },
    isSertifikatVerified: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

const Intern = mongoose.models.Intern || mongoose.model("Intern", internSchema);

export default Intern;
