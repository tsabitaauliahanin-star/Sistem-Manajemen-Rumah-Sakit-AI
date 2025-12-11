import { ToolName, DashboardStats, Patient, Doctor } from '../types';

/**
 * In-memory storage to simulate a database.
 * Data persists as long as the app is running (refresh resets it).
 */
const MOCK_PATIENTS: Patient[] = [
  { id: 'RM-3921', nama: 'Budi Santoso', tglLahir: '1982-05-12', alamat: 'Jl. Merdeka No. 10', status: 'Rawat Inap', poli: 'Penyakit Dalam' },
  { id: 'RM-4420', nama: 'Siti Aminah', tglLahir: '1995-10-23', alamat: 'Jl. Melati No. 5', status: 'Rawat Jalan', poli: 'Umum' },
  { id: 'RM-5512', nama: 'Doni Pratama', tglLahir: '2015-01-30', alamat: 'Jl. Kebon Jeruk', status: 'Rawat Inap', poli: 'Anak' },
  { id: 'RM-1029', nama: 'Ratna Sari', tglLahir: '1978-12-12', alamat: 'Jl. Sudirman 45', status: 'Pulang', poli: 'Jantung' },
];

const MOCK_DOCTORS: Doctor[] = [
  { id: 'DOC-001', nama: 'Dr. Andi Wijaya, Sp.PD', spesialis: 'Penyakit Dalam', jadwal: 'Senin - Kamis (08:00 - 14:00)', status: 'Praktek' },
  { id: 'DOC-002', nama: 'Dr. Sarah Amelia, Sp.A', spesialis: 'Anak', jadwal: 'Selasa, Jumat (10:00 - 16:00)', status: 'Praktek' },
  { id: 'DOC-003', nama: 'Dr. Budi Hartono, Sp.JP', spesialis: 'Jantung', jadwal: 'Rabu (18:00 - 21:00)', status: 'Libur' },
  { id: 'DOC-004', nama: 'Dr. Citra Lestari, Sp.M', spesialis: 'Mata', jadwal: 'Senin, Rabu, Jumat (09:00 - 13:00)', status: 'Praktek' },
];

// --- Getters ---

export const getPatients = async (): Promise<Patient[]> => {
  return [...MOCK_PATIENTS];
};

export const getDoctors = async (): Promise<Doctor[]> => {
  return [...MOCK_DOCTORS];
};

// --- Actions ---

export const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
  const newDoc: Doctor = {
    ...doc,
    id: `DOC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  };
  MOCK_DOCTORS.push(newDoc);
  return newDoc;
};

// --- Existing Logic ---

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    patients: {
      new: MOCK_PATIENTS.filter(p => p.status !== 'Pulang').length + Math.floor(Math.random() * 5),
      inpatient: MOCK_PATIENTS.filter(p => p.status === 'Rawat Inap').length + 40,
    },
    scheduling: {
      doctors: MOCK_DOCTORS.filter(d => d.status === 'Praktek').length,
      beds: 12,
    },
    medical: { protocols: "120+", lastUpdate: "Baru saja" },
    admin: { pendingInvoices: 5, insuranceClaims: 2 }
  };
};

export const executeToolLogic = async (name: string, args: any): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`[MockDB] Executing ${name} with args:`, args);

  switch (name) {
    case ToolName.MANAJEMEN_PASIEN_DATA:
      if (args.jenis_aksi === 'RegistrasiBaru') {
        const newRM = `RM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        const text = args.detail_data_pasien || "";
        
        // Improved Regex to extract data from the structured system prompt
        // Matches "Nama: ...", "Nama Lengkap: ...", "Tanggal Lahir: ...", etc.
        const nama = text.match(/Nama(?: Lengkap)?[:\s]+([^\n-]+)/i)?.[1]?.trim() || "Pasien Baru";
        const tglLahir = text.match(/Tang?gal Lahir[:\s]+([^\n-]+)/i)?.[1]?.trim() || "2000-01-01";
        const alamat = text.match(/Alamat[:\s]+([^\n-]+)/i)?.[1]?.trim() || "Alamat belum lengkap";

        MOCK_PATIENTS.push({
          id: newRM,
          nama: nama,
          tglLahir: tglLahir,
          alamat: alamat,
          status: 'Rawat Jalan',
          poli: 'Umum'
        });
        
        return {
          status: 'success',
          message: `Pasien ${nama} berhasil didaftarkan ke database.`,
          detail: args.detail_data_pasien,
          nomor_rm_baru: newRM
        };
      }
      if (args.jenis_aksi === 'CekStatusRawat') {
        const p = MOCK_PATIENTS.find(p => p.id === args.nomor_identitas || p.nama.toLowerCase().includes(args.nomor_identitas?.toLowerCase()));
        if (p) return { status: 'found', nama: p.nama, status_rawat: p.status, ruang: 'Mawar 101' };
        return { status: 'not_found', message: 'Pasien tidak ditemukan' };
      }
      return { status: 'success', data: 'Data pasien diperbarui.' };

    case ToolName.PENJADWALAN_MEDIS:
      if (args.jenis_layanan === 'CekJadwalDokter') {
        const d = MOCK_DOCTORS.find(doc => doc.nama.toLowerCase().includes(args.subjek_layanan?.toLowerCase()) || doc.spesialis.toLowerCase().includes(args.subjek_layanan?.toLowerCase()));
        if (d) return { status: 'available', message: `${d.nama} (${d.spesialis}). Jadwal: ${d.jadwal}. Status: ${d.status}` };
        
        return {
          status: 'available',
          message: `Dokter Umum tersedia. Silakan datang ke poli umum.`,
          slots: ['09:00', '10:00', '14:00']
        };
      }
      if (args.jenis_layanan === 'BuatJanjiTemu') {
        return {
          status: 'confirmed',
          kode_booking: `BOOK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          info: `Janji temu dengan ${args.subjek_layanan} pada ${args.tanggal_waktu} berhasil dibuat.`
        };
      }
      return { status: 'info', message: 'Fasilitas tersedia.' };

    case ToolName.INFORMASI_MEDIS_UMUM:
      return {
        referensi: args.sumber_prioritas || 'Guideline Klinis RS',
        konten: `Informasi mengenai ${args.topik_pertanyaan}: Berdasarkan protokol standar, penanganan awal meliputi observasi tanda vital dan stabilisasi kondisi.`
      };

    case ToolName.ADMINISTRASI_RS_OPERASIONAL:
      if (args.jenis_administrasi === 'CekBilling') {
        return {
          invoice_id: args.detail_referensi || 'INV-Unknown',
          total_tagihan: 'Rp 4.500.000',
          status: 'Belum Lunas',
          rincian: ['Obat', 'Kamar 3 Hari', 'Jasa Dokter']
        };
      }
      if (args.jenis_administrasi === 'LapKeuangan') {
        return {
          laporan: 'Laporan Laba Rugi',
          periode: args.periode_laporan,
          summary: 'Surplus operasional sebesar 12% dibandingkan periode sebelumnya.'
        };
      }
      return { status: 'processed', message: 'Permintaan administrasi telah diproses oleh sistem.' };

    default:
      return { error: 'Fungsi tidak dikenali.' };
  }
};