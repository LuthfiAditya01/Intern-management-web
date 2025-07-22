// pages/api/sertifikat/index.js
import dbConnect from '@/lib/dbConnect';
import Sertifikat from '@/models/Sertifikat';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const data = await Sertifikat.find();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data' });
      }
      break;

    case 'POST':
      try {
        const newData = await Sertifikat.create(req.body);
        res.status(201).json(newData);
      } catch (error) {
        res.status(400).json({ error: 'Gagal menambahkan data' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} tidak diizinkan`);
  }
}
