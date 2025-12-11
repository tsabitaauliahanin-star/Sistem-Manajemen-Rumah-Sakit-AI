import React from 'react';
import { Patient, Doctor } from '../types';

interface DataListModalProps {
  isOpen: boolean;
  title: string;
  type: 'patient' | 'doctor';
  data: (Patient | Doctor)[];
  onClose: () => void;
}

const DataListModal: React.FC<DataListModalProps> = ({ isOpen, title, type, data, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-center ${type === 'patient' ? 'bg-blue-600' : 'bg-green-600'}`}>
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            {type === 'patient' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            )}
            {title}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {type === 'patient' ? (
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. RM</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pasien</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Lahir</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poli</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Dokter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesialisasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                )}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Tidak ada data tersedia.</td>
                  </tr>
                ) : (
                  data.map((item, idx) => {
                    const isPatient = type === 'patient';
                    const p = item as Patient;
                    const d = item as Doctor;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        {isPatient ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.nama}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.tglLahir}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.poli}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                p.status === 'Rawat Inap' ? 'bg-red-100 text-red-800' : 
                                p.status === 'Rawat Jalan' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{d.nama}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.spesialis}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={d.jadwal}>{d.jadwal}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                d.status === 'Praktek' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {d.status}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataListModal;