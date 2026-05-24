import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { FiMail, FiPhone, FiCalendar, FiClock, FiEye, FiTrash2 } from 'react-icons/fi';

function MessagesPage() {
  const { contactMessages, updateMessageStatus, deleteMessage } = useAdmin();
  const { showToast } = useToast();

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Noma\'lum';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('uz-UZ'),
      time: date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-serif text-dark mb-6">Xabarlar</h1>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Jami: {contactMessages?.length || 0} ta xabar | 
          O'qilmagan: <span className="text-accent font-semibold">{contactMessages?.filter(m => m.status === 'unread').length || 0}</span>
        </p>
      </div>

      {!contactMessages || contactMessages.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <div className="text-5xl mb-3">📭</div>
          <p>Hali hech qanday xabar yo'q</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contactMessages.map(msg => {
            const dateTime = formatDateTime(msg.created_at || msg.createdAt);
            return (
              <div 
                key={msg.id} 
                className={`border rounded-xl p-4 transition-all ${
                  msg.status === 'unread' ? 'border-accent bg-accent/5 shadow-sm' : 'border-gray-200 bg-white'
                }`}
              >
                {/* Header qismi */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-dark text-base break-words">{msg.name || "Noma'lum"}</h3>
                      {msg.status === 'unread' && (
                        <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">Yangi</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1 break-all">
                        <FiMail size={12} className="shrink-0" /> 
                        <span className="break-words">{msg.email || "Email yo'q"}</span>
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FiPhone size={12} className="shrink-0" /> 
                        {msg.phone || "Telefon yo'q"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <FiCalendar size={10} /> {dateTime.date}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-0.5">
                      <FiClock size={10} /> {dateTime.time}
                    </p>
                  </div>
                </div>
                
                {/* Mavzu */}
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-600 break-words">
                    📌 Mavzu: <span className="font-normal">{msg.subject || "Mavzu yo'q"}</span>
                  </p>
                </div>
                
                {/* Xabar matni */}
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                </div>
                
                {/* Tugmalar */}
                <div className="flex flex-wrap gap-3 mt-4 pt-2">
                  {msg.status === 'unread' && (
                    <button
                      onClick={() => {
                        updateMessageStatus(msg.id, 'read');
                        showToast("Xabar o'qilgan deb belgilandi", "success");
                      }}
                      className="text-accent text-sm hover:underline flex items-center gap-1"
                    >
                      <FiEye size={14} /> O'qilgan deb belgilash
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Xabarni o\'chirmoqchimisiz?')) {
                        deleteMessage(msg.id);
                        showToast("Xabar o'chirildi", "error");
                      }
                    }}
                    className="text-red-500 text-sm hover:underline flex items-center gap-1"
                  >
                    <FiTrash2 size={14} /> O'chirish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MessagesPage;