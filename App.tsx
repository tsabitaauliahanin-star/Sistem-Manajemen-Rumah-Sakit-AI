import React, { useState, useEffect, useRef } from 'react';
import { Message, ToolName, DashboardStats, Patient, Doctor } from './types';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import PatientRegistrationModal from './components/PatientRegistrationModal';
import DoctorRegistrationModal from './components/DoctorRegistrationModal';
import DataListModal from './components/DataListModal';
import Toast from './components/Toast';
import WelcomeDashboard from './components/WelcomeDashboard';
import { sendMessageToAgent, initializeChat } from './services/geminiService';
import { getDashboardStats, getPatients, getDoctors, addDoctor } from './services/mockDatabase';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modals State
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  
  const [dataListModal, setDataListModal] = useState<{ isOpen: boolean; type: 'patient' | 'doctor'; title: string }>({
    isOpen: false,
    type: 'patient',
    title: ''
  });
  
  // Data State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize GenAI chat and fetch stats on mount
  useEffect(() => {
    initializeChat();
    refreshData();
  }, []);

  const refreshData = async () => {
    const stats = await getDashboardStats();
    setDashboardStats(stats);
    // Also fetch lists silently in case needed immediately
    setPatientsList(await getPatients());
    setDoctorsList(await getDoctors());
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (apiText: string, displayText?: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: displayText || apiText
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Call Agent
    const response = await sendMessageToAgent(apiText);

    // Check for specific tool results to show Toast
    if (response.toolCall) {
      const { name, args, result } = response.toolCall;
      
      // Check for successful patient registration
      if (name === ToolName.MANAJEMEN_PASIEN_DATA && args.jenis_aksi === 'RegistrasiBaru' && result?.nomor_rm_baru) {
        setToast({
          type: 'success',
          message: `Registrasi Berhasil! No. RM: ${result.nomor_rm_baru}`
        });
        refreshData(); // Refresh counts
      }
    }

    // Add model message
    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: response.text,
      toolCall: response.toolCall
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handlePatientSubmit = (data: { nik: string; nama: string; tglLahir: string; alamat: string }) => {
    setIsPatientModalOpen(false);
    
    // Construct a prompt that will trigger the tool call
    const prompt = `[SYSTEM REQUEST] Registrasi Pasien Baru.
Mohon jalankan fungsi manajemen_pasien_data dengan jenis_aksi='RegistrasiBaru'.
NIK: ${data.nik}
Detail Data Pasien:
- Nama Lengkap: ${data.nama}
- Tanggal Lahir: ${data.tglLahir}
- Alamat: ${data.alamat}`;
    
    // Send prompt to API but show a user-friendly message in chat
    handleSendMessage(
      prompt, 
      `📋 Mengirim data registrasi pasien baru:\nNama: ${data.nama}\nNIK: ${data.nik}`
    );
  };

  const handleDoctorSubmit = async (data: { nama: string; spesialis: string; jadwal: string }) => {
    setIsDoctorModalOpen(false);
    await addDoctor({
      nama: data.nama,
      spesialis: data.spesialis,
      jadwal: data.jadwal,
      status: 'Praktek'
    });
    setToast({ type: 'success', message: `Dokter ${data.nama} berhasil ditambahkan.` });
    refreshData();
  };

  const openDataList = async (type: 'patient' | 'doctor') => {
    // Ensure fresh data
    if (type === 'patient') setPatientsList(await getPatients());
    else setDoctorsList(await getDoctors());

    setDataListModal({
      isOpen: true,
      type: type,
      title: type === 'patient' ? 'Daftar Pasien Terdaftar' : 'Daftar Dokter & Jadwal'
    });
  };

  const handleReset = () => {
    setMessages([]); // Clears chat to show Dashboard
    setToast(null);
    setIsLoading(false);
    initializeChat(); // Resets GenAI context
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header onOpenRegistration={() => setIsPatientModalOpen(true)} onReset={handleReset} />
      
      <main className="flex-grow overflow-y-auto scrollbar-hide px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          
          {/* Show Dashboard if no messages yet */}
          {messages.length === 0 && (
            <WelcomeDashboard 
              onAction={(prompt) => handleSendMessage(prompt)} 
              onOpenRegistration={() => setIsPatientModalOpen(true)}
              onOpenDoctorRegistration={() => setIsDoctorModalOpen(true)}
              onViewPatients={() => openDataList('patient')}
              onViewDoctors={() => openDataList('doctor')}
              stats={dashboardStats}
            />
          )}

          {/* Chat Messages */}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-400 text-sm ml-4 mb-4">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               <span className="ml-2">Sedang memproses & memilih agen...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      <InputArea onSend={(text) => handleSendMessage(text)} isLoading={isLoading} />
      
      {/* Modals */}
      <PatientRegistrationModal 
        isOpen={isPatientModalOpen} 
        onClose={() => setIsPatientModalOpen(false)}
        onSubmit={handlePatientSubmit}
      />

      <DoctorRegistrationModal 
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSubmit={handleDoctorSubmit}
      />

      <DataListModal 
        isOpen={dataListModal.isOpen}
        type={dataListModal.type}
        title={dataListModal.title}
        data={dataListModal.type === 'patient' ? patientsList : doctorsList}
        onClose={() => setDataListModal(prev => ({ ...prev, isOpen: false }))}
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;