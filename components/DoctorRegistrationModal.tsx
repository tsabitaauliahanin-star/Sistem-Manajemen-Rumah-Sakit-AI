import React, { useState } from 'react';

interface DoctorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nama: string; spesialis: string; jadwal: string }) => void;
}

const DoctorRegistrationModal: React.FC<DoctorRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nama: '',
    spesialis: '',
    jadwal: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nama: '', spesialis: '', jadwal: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Data Dokter
          </h2>
          <button onClick={onClose} className="text-white hover:bg-green-800 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokter (dengan gelar)</label>
            <input type="text" name="nama" required value={formData.nama} onChange={handleChange} placeholder="Dr. Budi Santoso, Sp.A" className="w-full rounded-lg border-gray-300 border px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spesialisasi</label>
            <input type="text" name="spesialis" required value={formData.spesialis} onChange={handleChange} placeholder="Anak, Jantung, Umum..." className="w-full rounded-lg border-gray-300 border px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal Praktek</label>
            <input type="text" name="jadwal" required value={formData.jadwal} onChange={handleChange} placeholder="Senin - Rabu (09:00 - 14:00)" className="w-full rounded-lg border-gray-300 border px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistrationModal;