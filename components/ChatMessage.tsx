import React from 'react';
import { Message, ToolName } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ToolBadge: React.FC<{ name: string }> = ({ name }) => {
  let label = "Unknown Tool";
  let colorClass = "bg-gray-100 text-gray-800";

  switch (name) {
    case ToolName.MANAJEMEN_PASIEN_DATA:
      label = "Pasien & Data";
      colorClass = "bg-blue-100 text-blue-800";
      break;
    case ToolName.PENJADWALAN_MEDIS:
      label = "Penjadwalan";
      colorClass = "bg-green-100 text-green-800";
      break;
    case ToolName.INFORMASI_MEDIS_UMUM:
      label = "Info Medis";
      colorClass = "bg-purple-100 text-purple-800";
      break;
    case ToolName.ADMINISTRASI_RS_OPERASIONAL:
      label = "Admin & Keuangan";
      colorClass = "bg-orange-100 text-orange-800";
      break;
  }

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass} mb-2 inline-block`}>
      ⚡ Sub-Agen: {label}
    </span>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs text-gray-400 italic bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Tool Badge for Model messages that used a tool */}
        {!isUser && message.toolCall && (
          <ToolBadge name={message.toolCall.name} />
        )}

        <div
          className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap
            ${isUser 
              ? 'bg-medical-600 text-white rounded-br-none' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }
          `}
        >
          {message.content}
        </div>

        {/* Debug/Transparency View for Tool Execution (Optional visual) */}
        {!isUser && message.toolCall && (
            <div className="mt-2 text-xs text-gray-400 font-mono w-full bg-slate-50 border border-slate-100 p-2 rounded">
                <div className="font-semibold text-slate-500 mb-1">Parameter yang diekstrak:</div>
                <pre className="overflow-x-auto">
                    {JSON.stringify(message.toolCall.args, null, 2)}
                </pre>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;