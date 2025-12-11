import { GoogleGenAI, Type, FunctionDeclaration, Tool, FunctionCall } from "@google/genai";
import { executeToolLogic } from "./mockDatabase";
import { ToolName } from "../types";

// Helper to safely get env var without crashing in browser if process is undefined
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const apiKey = getApiKey();

let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("No API key found, initializing Mock Mode.");
  }
} catch (e) {
  console.warn("GoogleGenAI init failed, defaulting to Mock Mode.");
}

// --- 1. Define Tools (Sub-Agents) ---

const manajemenPasienTool: FunctionDeclaration = {
  name: ToolName.MANAJEMEN_PASIEN_DATA,
  description: "Menangani manajemen data pasien, termasuk pendaftaran, update, cek status, atau rekam medis.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      jenis_aksi: {
        type: Type.STRING,
        description: "Jenis tindakan: RegistrasiBaru, UpdateData, CekStatusRawat, AmbilCatatanMedis",
        enum: ["RegistrasiBaru", "UpdateData", "CekStatusRawat", "AmbilCatatanMedis"]
      },
      nomor_identitas: {
        type: Type.STRING,
        description: "NIK atau Nomor Rekam Medis (No. RM)"
      },
      detail_data_pasien: {
        type: Type.STRING,
        description: "Detail data untuk input/ubah (cth: Alamat baru, Tgl Lahir)"
      }
    },
    required: ["jenis_aksi", "nomor_identitas"]
  }
};

const penjadwalanMedisTool: FunctionDeclaration = {
  name: ToolName.PENJADWALAN_MEDIS,
  description: "Mengelola jadwal dokter, janji temu, dan ketersediaan fasilitas/kamar.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      jenis_layanan: {
        type: Type.STRING,
        description: "Fokus layanan: BuatJanjiTemu, CekJadwalDokter, CekKetersediaanFasilitas",
        enum: ["BuatJanjiTemu", "CekJadwalDokter", "CekKetersediaanFasilitas"]
      },
      subjek_layanan: {
        type: Type.STRING,
        description: "Nama dokter, spesialisasi, atau fasilitas (cth: Dr. Agung, Poli Jantung)"
      },
      tanggal_waktu: {
        type: Type.STRING,
        description: "Tanggal dan waktu spesifik"
      },
      nomor_identitas_pasien: {
        type: Type.STRING,
        description: "Nomor RM pasien jika untuk janji temu"
      }
    },
    required: ["jenis_layanan", "subjek_layanan", "tanggal_waktu"]
  }
};

const informasiMedisTool: FunctionDeclaration = {
  name: ToolName.INFORMASI_MEDIS_UMUM,
  description: "Menyediakan informasi medis umum, panduan kesehatan, SOP klinis.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      topik_pertanyaan: {
        type: Type.STRING,
        description: "Topik atau istilah medis yang dicari"
      },
      sumber_prioritas: {
        type: Type.STRING,
        description: "Prioritas sumber (Guideline Klinis, Edukasi Pasien, Umum)"
      }
    },
    required: ["topik_pertanyaan"]
  }
};

const administrasiRsTool: FunctionDeclaration = {
  name: ToolName.ADMINISTRASI_RS_OPERASIONAL,
  description: "Menangani fungsi back-office: Billing, Asuransi, Keuangan, Aset.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      jenis_administrasi: {
        type: Type.STRING,
        description: "Kategori: CekBilling, KlaimAsuransi, LapKeuangan, ManajemenAset, CekInventaris",
        enum: ["CekBilling", "KlaimAsuransi", "LapKeuangan", "ManajemenAset", "CekInventaris"]
      },
      detail_referensi: {
        type: Type.STRING,
        description: "Nomor invoice, nama asuransi, nama aset, atau jenis laporan"
      },
      periode_laporan: {
        type: Type.STRING,
        description: "Periode waktu terkait"
      }
    },
    required: ["jenis_administrasi"]
  }
};

const tools: Tool[] = [{
  functionDeclarations: [
    manajemenPasienTool,
    penjadwalanMedisTool,
    informasiMedisTool,
    administrasiRsTool
  ]
}];

// --- 2. System Instruction ---

const SYSTEM_INSTRUCTION = `
Role: Anda adalah "Kelola Sistem Rumah Sakit", Agen Pusat yang bertugas sebagai router cerdas.
Tugas: Analisis permintaan pengguna dan delegasikan ke Sub-Agen (Tools) yang tepat.

Instruksi Kritis:
1. Selalu pilih SATU fungsi yang paling relevan.
2. Ekstrak parameter dari teks pengguna untuk Function Call.
3. Jika permintaan ambigu, MINTA KLARIFIKASI, jangan menebak fungsi.
4. Anda sopan, profesional, dan deterministik.
`;

// --- 3. Chat Session Management ---

let chatSession: any = null;

export const initializeChat = () => {
  if (!ai) return;
  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0,
        tools: tools,
      }
    });
  } catch (e) {
    console.error("Failed to initialize chat:", e);
  }
};

export interface ChatResponse {
  text: string;
  toolCall?: {
    name: string;
    args: any;
    result: any;
  };
}

// --- 4. Fallback Logic (Mock AI) ---
/**
 * This functions acts as a "Dumb AI" router when the real API is not available.
 * It uses simple keyword matching to trigger the same tools as the real AI would.
 */
const mockGeminiRouter = async (message: string): Promise<ChatResponse> => {
  await new Promise(r => setTimeout(r, 1000)); // Simulate thinking delay
  
  const msg = message.toLowerCase();
  let toolName = "";
  let args: any = {};
  let responseText = "";

  // Logic Mappings
  if ((msg.includes("registrasi") && msg.includes("pasien")) || msg.includes("manajemen_pasien_data")) {
    toolName = ToolName.MANAJEMEN_PASIEN_DATA;
    const nikMatch = message.match(/NIK[:\s]+(\d+)/i) || message.match(/(\d{10,})/);
    const namaMatch = message.match(/Nama(?: Lengkap)?[:\s]+([^\n-]+)/i);
    
    args = {
      jenis_aksi: "RegistrasiBaru",
      nomor_identitas: nikMatch ? nikMatch[1] : "3301000000000001",
      detail_data_pasien: message // Pass full message for parsing in mockDatabase
    };
    responseText = `[MOCK AI] Permintaan registrasi diterima. Saya akan memproses data untuk ${namaMatch ? namaMatch[1].trim() : 'pasien baru'}.`;
  
  } else if (msg.includes("rekam medis") || msg.includes("cari data") || msg.includes("riwayat")) {
    toolName = ToolName.MANAJEMEN_PASIEN_DATA;
    args = { 
      jenis_aksi: "AmbilCatatanMedis", 
      nomor_identitas: "RM-KEYWORD" 
    };
    responseText = "[MOCK AI] Mencari data rekam medis pasien sesuai permintaan Anda...";

  } else if (msg.includes("cek status") || msg.includes("rawat") || msg.includes("kamar berapa")) {
    toolName = ToolName.MANAJEMEN_PASIEN_DATA;
    args = { jenis_aksi: "CekStatusRawat", nomor_identitas: "DUMMY-RM-123" };
    responseText = "[MOCK AI] Sedang memeriksa status rawat inap pasien...";

  } else if (msg.includes("jadwal") || msg.includes("praktek") || msg.includes("dokter")) {
    toolName = ToolName.PENJADWALAN_MEDIS;
    args = { 
      jenis_layanan: "CekJadwalDokter", 
      subjek_layanan: "Dokter Umum", 
      tanggal_waktu: "Hari Ini" 
    };
    responseText = "[MOCK AI] Mengecek jadwal dokter yang tersedia untuk hari ini...";

  } else if (msg.includes("janji temu") || msg.includes("booking")) {
    toolName = ToolName.PENJADWALAN_MEDIS;
    args = {
      jenis_layanan: "BuatJanjiTemu",
      subjek_layanan: "Dr. Spesialis",
      tanggal_waktu: "Besok Pagi"
    };
    responseText = "[MOCK AI] Memproses pembuatan janji temu...";

  } else if (msg.includes("kamar") || msg.includes("kosong") || msg.includes("vip") || msg.includes("fasilitas")) {
    toolName = ToolName.PENJADWALAN_MEDIS;
    args = {
      jenis_layanan: "CekKetersediaanFasilitas",
      subjek_layanan: "Ruang Rawat Inap",
      tanggal_waktu: "Saat Ini"
    };
    responseText = "[MOCK AI] Memeriksa ketersediaan fasilitas rumah sakit...";

  } else if (msg.includes("sop") || msg.includes("gejala") || msg.includes("obat") || msg.includes("sakit") || msg.includes("penanganan")) {
    toolName = ToolName.INFORMASI_MEDIS_UMUM;
    args = {
      topik_pertanyaan: message,
      sumber_prioritas: "Protokol RS Standar"
    };
    responseText = "[MOCK AI] Mencari informasi medis di basis pengetahuan rumah sakit...";

  } else if (msg.includes("tagihan") || msg.includes("billing") || msg.includes("bayar")) {
    toolName = ToolName.ADMINISTRASI_RS_OPERASIONAL;
    args = {
      jenis_administrasi: "CekBilling",
      detail_referensi: "INV-LATEST",
      periode_laporan: "Current"
    };
    responseText = "[MOCK AI] Mengambil data tagihan pasien...";

  } else if (msg.includes("laporan") || msg.includes("keuangan")) {
    toolName = ToolName.ADMINISTRASI_RS_OPERASIONAL;
    args = {
      jenis_administrasi: "LapKeuangan",
      detail_referensi: "General Ledger",
      periode_laporan: "Bulan Ini"
    };
    responseText = "[MOCK AI] Menyiapkan ringkasan laporan keuangan...";
  }

  // Execution
  if (toolName) {
    const result = await executeToolLogic(toolName, args);
    
    // Construct a natural-ish response based on result
    let finalResponse = responseText + "\n\n";
    if (result.message) finalResponse += result.message;
    else if (result.konten) finalResponse += result.konten;
    else if (result.summary) finalResponse += result.summary;
    else if (result.total_tagihan) finalResponse += `Total: ${result.total_tagihan}. Status: ${result.status}`;
    else finalResponse += JSON.stringify(result);

    return {
      text: finalResponse,
      toolCall: { name: toolName, args, result }
    };
  }

  return {
    text: "[MOCK AI] Maaf, dalam mode Uji Coba (Tanpa API Key), saya hanya merespons perintah yang sesuai dengan tombol di Dashboard. Silakan coba klik salah satu menu di halaman utama.",
  };
};


export const sendMessageToAgent = async (message: string): Promise<ChatResponse> => {
  if (!chatSession) initializeChat();

  try {
    if (!chatSession) throw new Error("Chat session not initialized");

    // 1. Send user message to model
    let response = await chatSession.sendMessage({ message });
    
    let toolCallData = null;

    // 2. Check for Function Calls
    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const { name, args, id } = call;

      console.log(`[Agent] Routing to Tool: ${name}`, args);

      // 3. Execute the Local Function (Simulated Backend)
      const functionResult = await executeToolLogic(name, args);
      
      toolCallData = {
        name,
        args,
        result: functionResult
      };

      // 4. Send Tool Response back to Model
      const toolResponseParts = [{
         functionResponse: {
            name: name,
            id: id,
            response: { result: functionResult } 
         }
      }];

      response = await chatSession.sendMessage({ message: toolResponseParts });
    }

    return {
      text: response.text || "Maaf, saya tidak dapat memproses permintaan tersebut.",
      toolCall: toolCallData || undefined
    };

  } catch (error) {
    console.warn("Gemini Error (Falling back to Mock Router):", error);
    // FALLBACK TO MOCK ROUTER
    return await mockGeminiRouter(message);
  }
};