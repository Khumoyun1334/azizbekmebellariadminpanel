import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import { FiPackage, FiCalendar, FiClock, FiUser, FiPhone, FiTrash2, FiDownload, FiPrinter, FiMapPin } from 'react-icons/fi';
import * as XLSX from 'xlsx';

function OrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();
  const { showToast } = useToast();
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Buyurtmalarni vaqt bo'yicha saralash (eng yangisi tepada)
  const sortedOrders = [...(orders || [])].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || 0);
    const dateB = new Date(b.created_at || b.createdAt || 0);
    return dateB - dateA; // Eng yangisi tepada
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Noma\'lum';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('uz-UZ'),
      time: date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const statusNames = {
    pending: 'Kutilmoqda',
    processing: 'Jarayonda',
    completed: 'Bajarildi',
    cancelled: 'Bekor qilingan'
  };

  const paymentNames = {
    cash: 'Naqd pul',
    card: 'Plastik karta',
    click: 'Click',
    payme: 'Payme'
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === sortedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(sortedOrders.map(o => o.id));
    }
  };

  const exportToExcel = () => {
    const exportData = sortedOrders.map(order => ({
      'ID': order.id,
      'Mijoz Ismi': order.customer_name || order.customerName,
      'Telefon': order.customer_phone || order.customerPhone,
      'Manzil': order.customer_address || order.customerAddress,
      'Jami Summa': (order.total || 0).toLocaleString() + ' so\'m',
      'Holat': statusNames[order.status],
      'Sana': formatDateTime(order.created_at || order.createdAt).date,
      'Vaqt': formatDateTime(order.created_at || order.createdAt).time,
      'Joylashuv': order.location_link || 'Yo\'q'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Buyurtmalar');
    XLSX.writeFile(workbook, `buyurtmalar_${new Date().toLocaleDateString()}.xlsx`);
    showToast("Excel fayl yuklandi", "success");
  };

  const printOrders = () => {
    const ordersToPrint = selectedOrders.length > 0 
      ? sortedOrders.filter(o => selectedOrders.includes(o.id))
      : sortedOrders;
    
    if (ordersToPrint.length === 0) {
      showToast("Chop etish uchun buyurtma yo'q", "error");
      return;
    }

    const printWindow = window.open('', '_blank');
    let ordersHtml = '';
    let totalSum = 0;

    ordersToPrint.forEach((order) => {
      const orderTotal = order.total || 0;
      totalSum += orderTotal;
      
      const orderItems = (order.items || []).map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price * item.qty)}</td>
        </tr>
      `).join('');

      const locationHtml = order.location_link 
        ? `<div style="margin-top: 10px;"><strong>📍 Joylashuv:</strong> <a href="${order.location_link}" target="_blank" style="color: #C89B6D;">🗺️ Google Maps da ko'rish</a></div>`
        : '';

      ordersHtml += `
        <div style="page-break-after: always; margin-bottom: 30px;">
          <div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
            <div style="border-bottom: 2px solid #C89B6D; padding-bottom: 10px; margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="color: #C89B6D;">Buyurtma #${order.id}</h2>
                <span style="background: ${order.status === 'pending' ? '#fef3c7' : '#d1fae5'}; padding: 4px 12px; border-radius: 20px;">${statusNames[order.status]}</span>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
              <div style="flex:1; background:#f9f9f9; padding:15px; border-radius:8px;">
                <p><strong>Ism:</strong> ${order.customer_name || order.customerName}</p>
                <p><strong>Telefon:</strong> ${order.customer_phone || order.customerPhone}</p>
                <p><strong>Manzil:</strong> ${order.customer_address || order.customerAddress}</p>
                ${locationHtml}
              </div>
              <div style="flex:1; background:#f9f9f9; padding:15px; border-radius:8px;">
                <p><strong>Sana:</strong> ${formatDateTime(order.created_at || order.createdAt).date}</p>
                <p><strong>Vaqt:</strong> ${formatDateTime(order.created_at || order.createdAt).time}</p>
                <p><strong>To'lov:</strong> ${paymentNames[order.payment_method] || order.payment_method}</p>
              </div>
            </div>
            <table style="width:100%; border-collapse:collapse;">
              <thead><tr style="background:#f0f0f0;"><th>Mahsulot</th><th>Soni</th><th>Bir narxi</th><th>Jami</th><tr></thead>
              <tbody>${orderItems}</tbody>
              <tfoot><tr><td colspan="3" style="text-align:right; font-weight:bold;">JAMI:</td><td style="font-weight:bold; color:#C89B6D;">${formatPrice(orderTotal)}</td></tr></tfoot>
            </table>
          </div>
        </div>
      `;
    });

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head><title>Buyurtmalar</title><meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #C89B6D; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; }
        @media print { body { margin: 0; } .no-print { display: none; } }
      </style>
      </head>
      <body>
        <div class="header"><h1>🏠 Azizbek Mebellari</h1><p>Buyurtmalar ro'yxati</p></div>
        <div class="summary"><span>📊 Jami: ${ordersToPrint.length} ta</span><span>💰 Umumiy: ${formatPrice(totalSum)}</span></div>
        ${ordersHtml}
        <div class="no-print" style="text-align:center; margin-top:30px;">
          <button onclick="window.print();">🖨️ Chop etish</button>
          <button onclick="window.close();">❌ Yopish</button>
        </div>
        <script>setTimeout(() => window.print(), 500);</script>
      </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
    showToast(`${ordersToPrint.length} ta buyurtma chop etishga yuborildi`, "success");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-serif text-dark">Buyurtmalar</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={printOrders} className="flex-1 sm:flex-none bg-accent text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-accent-dark transition-all flex items-center justify-center gap-2">
            <FiPrinter size={14} /> Chop etish ({selectedOrders.length > 0 ? selectedOrders.length : sortedOrders.length} ta)
          </button>
          <button onClick={exportToExcel} className="flex-1 sm:flex-none bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
            <FiDownload size={14} /> Excel
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={selectedOrders.length === sortedOrders.length && sortedOrders.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-accent" />
          Hammasini tanlash
        </label>
        {selectedOrders.length > 0 && (
          <button onClick={() => setSelectedOrders([])} className="text-sm text-gray-500 hover:text-gray-700">
            Tanlovni bekor qilish
          </button>
        )}
        <p className="text-sm text-gray-500">Jami: {sortedOrders.length} ta buyurtma</p>
      </div>

      {sortedOrders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <FiPackage size={48} className="mx-auto mb-3 text-gray-300" />
          <p>Hali hech qanday buyurtma yo'q</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map(order => {
            const dateTime = formatDateTime(order.created_at || order.createdAt);
            const isSelected = selectedOrders.includes(order.id);
            return (
              <div key={order.id} className={`border rounded-xl p-4 transition-shadow ${isSelected ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleOrderSelection(order.id)} className="mt-1 w-4 h-4 rounded border-gray-300 text-accent" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-dark">#{order.id}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <FiCalendar size={10} /> {dateTime.date}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <FiClock size={10} /> {dateTime.time}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]} border-none outline-none cursor-pointer`}
                      >
                        <option value="pending">Kutilmoqda</option>
                        <option value="processing">Jarayonda</option>
                        <option value="completed">Bajarildi</option>
                        <option value="cancelled">Bekor qilingan</option>
                      </select>
                    </div>
                    
                    <p className="font-semibold text-dark flex items-center gap-1 text-sm break-words">
                      <FiUser size={14} className="shrink-0" /> <span className="break-words">{order.customer_name || order.customerName}</span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 break-words">
                      <FiPhone size={12} className="shrink-0" /> {order.customer_phone || order.customerPhone}
                    </p>
                    <p className="text-sm text-gray-500 break-words mt-1">{order.customer_address || order.customerAddress}</p>
                    
                    {order.location_link && (
                      <a 
                        href={order.location_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-500 text-sm hover:underline mt-2 break-all"
                      >
                        <FiMapPin size={14} className="shrink-0" /> 🗺️ Xaritada ko'rish
                      </a>
                    )}
                    
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <p className="text-xs text-gray-400 mb-2">Mahsulotlar:</p>
                      <div className="space-y-1">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="text-sm flex justify-between flex-wrap gap-2">
                            <span className="break-words">{item.name} x{item.qty}</span>
                            <span className="font-semibold shrink-0">{formatPrice(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                      <span className="text-lg font-bold text-accent">{formatPrice(order.total || 0)}</span>
                      <button onClick={() => deleteOrder(order.id)} className="text-red-500 text-sm hover:underline flex items-center gap-1">
                        <FiTrash2 size={14} /> O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;