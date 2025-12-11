import React, { useState } from 'react';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nik: string; nama: string; tglLahir: string; alamat: string }) => void;
}

const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    tglLahir: '',
    alamat: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nik: '', nama: '', tglLahir: '', alamat: '' }); // Reset form
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="bg-medical-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M5.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM2.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM18.75 7.5a.75.75 0 00-1.5 0v2.25H15a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H21a.75.75 0 000-1.5h-2.25V7.5z" />
            </svg>
            Registrasi Pasien Baru
          </h2>
          <button onClick={onClose} className="text-white hover:bg-medical-900 rounded-full p-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
            <input
              type="text"
              name="nik"
              required
              value={formData.nik}
              onChange={handleChange}
              placeholder="Contoh: 3301xxxxxxxxxxxx"
              className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              required
              value={formData.nama}
              onChange={handleChange}
              placeholder="Nama sesuai KTP"
              className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              name="tglLahir"
              required
              value={formData.tglLahir}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Domisili</label>
            <textarea
              name="alamat"
              required
              rows={3}
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Alamat lengkap..."
              className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all resize-none text-sm"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-900 font-medium shadow-md hover:shadow-lg transition-all text-sm"
            >
              Daftarkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationModal;