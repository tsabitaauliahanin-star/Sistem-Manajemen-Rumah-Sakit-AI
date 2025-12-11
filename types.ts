export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  isError?: boolean;
  toolCall?: {
    name: string;
    args: any;
    result?: any;
  };
}

export enum ToolName {
  MANAJEMEN_PASIEN_DATA = 'manajemen_pasien_data',
  PENJADWALAN_MEDIS = 'penjadwalan_medis',
  INFORMASI_MEDIS_UMUM = 'informasi_medis_umum',
  ADMINISTRASI_RS_OPERASIONAL = 'administrasi_rs_operasional',
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface Patient {
  id: string; // NIK or RM
  nama: string;
  tglLahir: string;
  alamat: string;
  status: 'Rawat Jalan' | 'Rawat Inap' | 'Pulang';
  poli: string;
}

export interface Doctor {
  id: string;
  nama: string;
  spesialis: string;
  jadwal: string;
  status: 'Praktek' | 'Libur' | 'Cuti';
}

export interface DashboardStats {
  patients: {
    new: number;
    inpatient: number;
  };
  scheduling: {
    doctors: number;
    beds: number;
  };
  medical: {
    protocols: string;
    lastUpdate: string;
  };
  admin: {
    pendingInvoices: number;
    insuranceClaims: number;
  };
}