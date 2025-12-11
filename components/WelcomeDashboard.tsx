import React from 'react';
import { DashboardStats } from '../types';

interface WelcomeDashboardProps {
  onAction: (prompt: string) => void;
  onOpenRegistration: () => void;
  onOpenDoctorRegistration: () => void;
  onViewPatients: () => void;
  onViewDoctors: () => void;
  stats: DashboardStats | null;
}

const DashboardCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  stats: { label: string; value: string | number; color: string }[];
  actions: { label: string; prompt: string; primary?: boolean; secondary?: boolean; onClick?: () => void }[];
  color: string;
}> = ({ title, icon, stats, actions, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    <div className={`p-4 ${color} bg-opacity-10 border-b border-gray-100 flex items-center gap-3`}>
      <div className={`p-2 rounded-lg ${color} text-white shadow-sm`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
    </div>
    
    <div className="p-5 flex-grow flex flex-col gap-4">
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-semibold">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Actions Section */}
      <div className="mt-auto space-y-2">
        <p className="text-xs text-gray-400 font-medium mb-2">Aksi Cepat:</p>
        <div className="grid grid-cols-1 gap-2">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex justify-between items-center group
                ${action.primary 
                  ? 'bg-medical-600 text-white hover:bg-medical-900 shadow-sm' 
                  : action.secondary 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
              {action.label}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${action.primary ? 'text-white' : 'text-gray-400'}`}>
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({ 
  onAction, 
  onOpenRegistration, 
  onOpenDoctorRegistration,
  onViewPatients, 
  onViewDoctors, 
  stats 
}) => {
  const isLoading = !stats;
  const val = (v: any) => isLoading ? "..." : v;

  return (
    <div className="max-w-5xl mx-auto px-2 py-6 animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pusat Komando Rumah Sakit</h2>
        <p className="text-gray-500">Pilih modul di bawah ini atau ketik perintah langsung untuk bantuan AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Pasien */}
        <DashboardCard 
          title="Manajemen Pasien"
          color="bg-blue-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
          stats={[
            { label: 'Pasien Baru (Hari Ini)', value: val(stats?.patients.new), color: 'text-blue-600' },
            { label: 'Rawat Inap', value: val(stats?.patients.inpatient), color: 'text-gray-800' },
          ]}
          actions={[
            { label: 'Registrasi Pasien Baru', prompt: '', primary: true, onClick: onOpenRegistration },
            { label: 'Lihat Daftar Pasien', prompt: '', secondary: true, onClick: onViewPatients },
            { label: 'Cari Data Medis', prompt: 'Cari rekam medis pasien', onClick: () => onAction('Saya perlu mencari data rekam medis pasien') },
          ]}
        />

        {/* 2. Penjadwalan */}
        <DashboardCard 
          title="Jadwal & Fasilitas"
          color="bg-green-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
          stats={[
            { label: 'Dokter Praktek', value: val(stats?.scheduling.doctors), color: 'text-green-600' },
            { label: 'Kamar Kosong', value: val(stats?.scheduling.beds), color: 'text-gray-800' },
          ]}
          actions={[
            { label: 'Tambah Dokter', prompt: '', primary: true, onClick: onOpenDoctorRegistration },
            { label: 'Lihat Daftar Dokter', prompt: '', secondary: true, onClick: onViewDoctors },
            { label: 'Cek Jadwal Dokter', prompt: 'Tampilkan jadwal dokter hari ini', onClick: () => onAction('Siapa dokter yang praktek hari ini?') },
          ]}
        />

        {/* 3. Informasi Medis */}
        <DashboardCard 
          title="Informasi & SOP Medis"
          color="bg-purple-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          }
          stats={[
            { label: 'Protokol Aktif', value: val(stats?.medical.protocols), color: 'text-purple-600' },
            { label: 'Update Terakhir', value: val(stats?.medical.lastUpdate), color: 'text-gray-800' },
          ]}
          actions={[
            { label: 'Cari SOP Penanganan', prompt: 'Bagaimana SOP penanganan demam berdarah?', primary: true, onClick: () => onAction('Tampilkan SOP penanganan pasien demam tinggi') },
            { label: 'Panduan Obat', prompt: 'Info interaksi obat', onClick: () => onAction('Berikan informasi tentang penggunaan obat antibiotik') },
          ]}
        />

        {/* 4. Administrasi */}
        <DashboardCard 
          title="Admin & Keuangan"
          color="bg-orange-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          }
          stats={[
            { label: 'Pending Invoice', value: val(stats?.admin.pendingInvoices), color: 'text-orange-600' },
            { label: 'Klaim Asuransi', value: val(stats?.admin.insuranceClaims), color: 'text-gray-800' },
          ]}
          actions={[
            { label: 'Cek Tagihan Pasien', prompt: 'Cek tagihan pasien', primary: true, onClick: () => onAction('Saya ingin cek status tagihan pasien') },
            { label: 'Laporan Keuangan', prompt: 'Buat laporan keuangan', onClick: () => onAction('Buatkan ringkasan laporan keuangan bulan ini') },
          ]}
        />

      </div>
    </div>
  );
};

export default WelcomeDashboard;