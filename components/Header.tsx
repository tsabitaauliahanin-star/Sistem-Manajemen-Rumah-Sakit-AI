import React from 'react';

interface HeaderProps {
  onOpenRegistration: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenRegistration, onReset }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo Section - Clickable to Reset/Home */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onReset}
          title="Kembali ke Dashboard Utama"
        >
          <div className="bg-medical-600 p-2 rounded-lg group-hover:bg-medical-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-medical-600 transition-colors">Sistem Rumah Sakit</h1>
            <p className="text-xs text-gray-500 font-medium">Agen Pusat (Induk)</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          
          {/* Home / Dashboard Button */}
          <button 
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-medical-600 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
            title="Ke Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </button>

          <button 
            onClick={onOpenRegistration}
            className="flex items-center gap-1.5 bg-white border border-medical-600 text-medical-600 hover:bg-medical-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span className="hidden sm:inline">Registrasi Pasien</span>
            <span className="sm:hidden">Registrasi</span>
          </button>
          
          <div className="hidden sm:block">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Online
              </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;