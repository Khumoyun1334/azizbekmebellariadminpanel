import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

const supabaseUrl = 'https://hxrwrhbbijfntbrntpxk.supabase.co';
const supabaseKey = 'sb_publishable_qnJTSPaIOR5tn0dZw2RdgA_w6WOjvsJ';

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('luxehome_admin') === 'true';
  });

  const loadData = async () => {
    try {
      console.log('🔍 Ma\'lumotlar yuklanmoqda...');
      
      const productsRes = await fetch(`${supabaseUrl}/rest/v1/products?apikey=${supabaseKey}`, {
        headers: { 'apikey': supabaseKey }
      });
      const productsData = await productsRes.json();
      setProducts(productsData || []);
      console.log('✅ Mahsulotlar:', productsData?.length);
      
      const ordersRes = await fetch(`${supabaseUrl}/rest/v1/orders?apikey=${supabaseKey}`, {
        headers: { 'apikey': supabaseKey }
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData || []);
      console.log('✅ Buyurtmalar:', ordersData?.length);
      
      const messagesRes = await fetch(`${supabaseUrl}/rest/v1/messages?apikey=${supabaseKey}`, {
        headers: { 'apikey': supabaseKey }
      });
      const messagesData = await messagesRes.json();
      setContactMessages(messagesData || []);
      console.log('✅ Xabarlar:', messagesData?.length);
      
    } catch (error) {
      console.error('❌ Xatolik:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loginAdmin = (password) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('luxehome_admin', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.setItem('luxehome_admin', 'false');
  };

  // Mahsulot qo'shish
  const addProduct = async (product) => {
    try {
      const newProduct = {
        id: Date.now(),
        name: product.name,
        category: product.category,
        price: product.price,
        old_price: product.oldPrice || null,
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        badge: product.badge || '',
        img: product.img,
        description: product.desc,
        colors: product.colors || [],
        images: product.images || [],
        created_at: new Date().toISOString()
      };
      
      const response = await fetch(`${supabaseUrl}/rest/v1/products?apikey=${supabaseKey}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) throw new Error('Qo\'shishda xatolik');
      await loadData();
      return newProduct;
    } catch (error) {
      console.error('❌ addProduct xatosi:', error);
      throw error;
    }
  };

  // Mahsulot tahrirlash
  const updateProduct = async (id, updates) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}&apikey=${supabaseKey}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updates.name,
          category: updates.category,
          price: updates.price,
          old_price: updates.oldPrice,
          badge: updates.badge,
          img: updates.img,
          description: updates.desc,
          colors: updates.colors,
          images: updates.images
        })
      });
      
      if (!response.ok) throw new Error('Tahrirlashda xatolik');
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ updateProduct xatosi:', error);
      throw error;
    }
  };

  // Mahsulot o'chirish
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}&apikey=${supabaseKey}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey }
      });
      
      if (!response.ok) throw new Error('O\'chirishda xatolik');
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ deleteProduct xatosi:', error);
      throw error;
    }
  };

  // Buyurtma holatini yangilash
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&apikey=${supabaseKey}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error('Holatni yangilashda xatolik');
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ updateOrderStatus xatosi:', error);
      throw error;
    }
  };

  // Buyurtmani o'chirish
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&apikey=${supabaseKey}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey }
      });
      
      if (!response.ok) throw new Error('O\'chirishda xatolik');
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ deleteOrder xatosi:', error);
      throw error;
    }
  };

  // Xabar statusini yangilash
  const updateMessageStatus = async (messageId, status) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/messages?id=eq.${messageId}&apikey=${supabaseKey}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: status,
          read_at: status === 'read' ? new Date().toISOString() : null
        })
      });
      
      if (!response.ok) throw new Error('Xabar statusini yangilashda xatolik');
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ updateMessageStatus xatosi:', error);
      throw error;
    }
  };

  // Xabarni o'chirish
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/messages?id=eq.${messageId}&apikey=${supabaseKey}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey }
      });
      
      if (!response.ok) throw new Error('Xabarni o\'chirishda xatolik');
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ deleteMessage xatosi:', error);
      throw error;
    }
  };

  // Xabar qo'shish
  const addContactMessage = async (messageData) => {
    try {
      const newMessage = {
        id: Date.now(),
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone,
        subject: messageData.subject,
        message: messageData.message,
        status: 'unread',
        created_at: new Date().toISOString()
      };
      
      const response = await fetch(`${supabaseUrl}/rest/v1/messages?apikey=${supabaseKey}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });
      
      if (!response.ok) throw new Error('Xabar yuborishda xatolik');
      await loadData();
      return newMessage;
    } catch (error) {
      console.error('❌ addContactMessage xatosi:', error);
      throw error;
    }
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const unreadMessages = contactMessages.filter(m => m.status === 'unread').length;
    
    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      unreadMessages
    };
  };

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      contactMessages,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      deleteOrder,
      updateMessageStatus,
      deleteMessage,
      addContactMessage,
      getStats,
      refreshData: loadData
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);