import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { FiShoppingCart, FiClock, FiCheckCircle, FiXCircle, FiDollarSign, FiMail } from 'react-icons/fi';

function StatsPage() {
  const { orders, contactMessages, getStats } = useAdmin();
  const stats = getStats ? getStats() : { 
    totalOrders: 0, pendingOrders: 0, completedOrders: 0, 
    cancelledOrders: 0, totalRevenue: 0, unreadMessages: 0 
  };

  const formatRevenue = (revenue) => {
    if (!revenue) return '0 so\'m';
    if (revenue >= 1000000) {
      return (revenue / 1000000).toFixed(1) + ' mln so\'m';
    }
    return revenue.toLocaleString() + ' so\'m';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Noma\'lum';
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  const statusNames = {
    pending: 'Kutilmoqda',
    processing: 'Jarayonda',
    completed: 'Bajarildi',
    cancelled: 'Bekor qilingan'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-serif text-dark mb-6">Statistika</h1>
      
      {/* Statistika kartochkalari - mobil uchun grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-3 md:p-4 text-center">
          <FiShoppingCart size={20} className="mx-auto mb-2 text-blue-500 md:size-6" />
          <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.totalOrders || 0}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Jami Buyurtmalar</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 md:p-4 text-center">
          <FiClock size={20} className="mx-auto mb-2 text-yellow-500 md:size-6" />
          <p className="text-lg md:text-2xl font-bold text-yellow-600">{stats.pendingOrders || 0}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Kutilayotgan</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 md:p-4 text-center">
          <FiCheckCircle size={20} className="mx-auto mb-2 text-green-500 md:size-6" />
          <p className="text-lg md:text-2xl font-bold text-green-600">{stats.completedOrders || 0}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Bajarilgan</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 md:p-4 text-center">
          <FiXCircle size={20} className="mx-auto mb-2 text-red-500 md:size-6" />
          <p className="text-lg md:text-2xl font-bold text-red-600">{stats.cancelledOrders || 0}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Bekor qilingan</p>
        </div>
        <div className="bg-accent/10 rounded-xl p-3 md:p-4 text-center">
          <FiDollarSign size={20} className="mx-auto mb-2 text-accent md:size-6" />
          <p className="text-sm md:text-2xl font-bold text-accent">{formatRevenue(stats.totalRevenue || 0)}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Umumiy Daromad</p>
        </div>
      </div>

      {/* So'nggi ma'lumotlar - mobil uchun stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* So'nggi buyurtmalar */}
        <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
          <h2 className="font-semibold text-dark mb-4 text-base md:text-lg">So'nggi Buyurtmalar</h2>
          <div className="space-y-3">
            {(orders || []).slice(0, 5).map(order => (
              <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-dark break-words">{order.customer_name || order.customerName}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(order.created_at || order.createdAt)}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold text-accent">{formatRevenue(order.total || 0)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                    {statusNames[order.status]}
                  </span>
                </div>
              </div>
            ))}
            {(orders || []).length === 0 && (
              <p className="text-center text-gray-400 py-4">Hali buyurtmalar yo'q</p>
            )}
          </div>
        </div>

        {/* So'nggi xabarlar */}
        <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
          <h2 className="font-semibold text-dark mb-4 text-base md:text-lg">So'nggi Xabarlar</h2>
          <div className="space-y-3">
            {(contactMessages || []).slice(0, 5).map(msg => (
              <div key={msg.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-dark break-words">{msg.name}</p>
                  <p className="text-xs text-gray-400 break-words">{msg.subject || "Mavzu yo'q"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400">{formatDateTime(msg.created_at || msg.createdAt)}</p>
                  {msg.status === 'unread' && (
                    <span className="text-xs text-accent font-semibold">Yangi</span>
                  )}
                </div>
              </div>
            ))}
            {(contactMessages || []).length === 0 && (
              <p className="text-center text-gray-400 py-4">Hali xabarlar yo'q</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;