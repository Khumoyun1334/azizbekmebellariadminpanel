import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../utils/formatPrice';
import { FiShoppingCart, FiPackage, FiMail, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';

function DashboardPage() {
  const { orders, products, contactMessages, getStats } = useAdmin();
  const stats = getStats ? getStats() : { totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0 };

  const formatRevenue = (revenue) => {
    if (!revenue) return '0 so\'m';
    return revenue.toLocaleString() + ' so\'m';
  };

  const cards = [
    { title: 'Jami Buyurtmalar', value: stats.totalOrders, icon: FiShoppingCart, color: 'bg-blue-500' },
    { title: 'Kutilayotgan', value: stats.pendingOrders, icon: FiClock, color: 'bg-yellow-500' },
    { title: 'Bajarilgan', value: stats.completedOrders, icon: FiCheckCircle, color: 'bg-green-500' },
    { title: 'Mahsulotlar', value: products.length, icon: FiPackage, color: 'bg-purple-500' },
    { title: 'Xabarlar', value: contactMessages.length, icon: FiMail, color: 'bg-orange-500' },
    { title: 'Umumiy Daromad', value: formatRevenue(stats.totalRevenue), icon: FiDollarSign, color: 'bg-accent' },
  ];

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-serif text-dark mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-xs md:text-sm">{card.title}</p>
                  <p className="text-xl md:text-3xl font-bold text-dark mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-2 md:p-3 rounded-xl`}>
                  <Icon size={18} className="md:size-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardPage;