import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  return (
    <div className="border-t border-gray-200 bg-white p-4 sticky bottom-0 z-10">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-end gap-2">
        <div className="flex-grow bg-gray-50 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-medical-500 focus-within:border-transparent transition-all">
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 max-h-32 text-gray-700 placeholder-gray-400"
            rows={1}
            placeholder="Ketik permintaan Anda (misal: Daftarkan pasien baru...)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className={`p-3 rounded-full flex-shrink-0 transition-all duration-200 ${
            text.trim() && !isLoading
              ? 'bg-medical-600 text-white shadow-lg hover:bg-medical-900 hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </form>
      <div className="text-center mt-2">
         <p className="text-xs text-gray-400">
           Didukung oleh Google Gemini 2.5 • Sistem Manajemen Rumah Sakit
         </p>
      </div>
    </div>
  );
};

export default InputArea;