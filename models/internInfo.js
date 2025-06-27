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
        required: true,
    },
    status: {
        type: String,
        enum: ['aktif', 'selesai', 'dikeluarkan', 'pending'],
        required: true,
    }
}, {
    timestamps: true
});

const Intern = mongoose.models.Intern || mongoose.model("Intern", internSchema);

export default Intern;
