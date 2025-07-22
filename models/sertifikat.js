import mongoose from 'mongoose';

const SertifikatSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  kelas: { type: String, required: true },
  program: { type: String, required: true },
  kompetensi: { type: String, required: true },
  instansi: { type: String, required: true },
  tanggalMulai: { type: Date, required: true },
  tanggalSelesai: { type: Date, required: true },
  lamaMagang: { type: String, required: true },
}, {
  timestamps: true, // otomatis menambahkan createdAt dan updatedAt
});

export default mongoose.models.Sertifikat || mongoose.model('Sertifikat', SertifikatSchema);
