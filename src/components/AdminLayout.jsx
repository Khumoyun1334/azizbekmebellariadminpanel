import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { 
  FiHome, FiShoppingBag, FiPackage, FiMail, FiStar, FiBarChart2, 
  FiLogOut, FiMenu, FiX, FiChevronLeft
} from 'react-icons/fi';

function AdminLayout({ children }) {
  const { logoutAdmin, orders, products, contactMessages } = useAdmin();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ekran o'lchamiga qarab sidebar holatini o'zgartirish
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: FiHome, count: null },
    { path: '/orders', name: 'Buyurtmalar', icon: FiPackage, count: orders?.length },
    { path: '/products', name: 'Mahsulotlar', icon: FiShoppingBag, count: products?.length },
    { path: '/messages', name: 'Xabarlar', icon: FiMail, count: contactMessages?.filter(m => m.status === 'unread').length },
    { path: '/reviews', name: 'Baholar', icon: FiStar, count: null },
    { path: '/stats', name: 'Statistika', icon: FiBarChart2, count: null },
  ];

  const handleLogout = () => {
    logoutAdmin();
    showToast("Admin paneldan chiqildi", "info");
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <h1 className="text-xl md:text-2xl font-serif text-accent">Admin Panel</h1>
        <p className="text-xs text-gray-400 mt-1 hidden md:block">Azizbek Mebellari</p>
      </div>
      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all ${
                isActive ? 'bg-accent text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="md:size-5" />
                <span className="text-sm md:text-base">{item.name}</span>
              </div>
              {item.count !== null && item.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-accent' : 'bg-accent text-white'}`}>
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 md:p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm md:text-base"
        >
          <FiLogOut size={18} className="md:size-5" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header - faqat mobil ko'rinadi */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <h1 className="text-lg font-serif text-accent font-semibold">Admin Panel</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
        >
          <FiLogOut size={18} />
        </button>
      </div>

      {/* Mobile sidebar - drawerdan tushadi */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl animate-slideInLeft">
            <SidebarContent />
          </div>
        </>
      )}

      {/* Desktop sidebar - normal */}
      <div className={`hidden lg:block fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'}`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-all"
        >
          {sidebarOpen ? <FiChevronLeft size={14} /> : <FiMenu size={14} />}
        </button>
        {sidebarOpen ? <SidebarContent /> : (
          <div className="flex flex-col items-center py-6 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-3 rounded-xl transition-all ${isActive ? 'bg-accent text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  title={item.name}
                >
                  <Icon size={22} />
                </Link>
              );
            })}
            <button onClick={handleLogout} className="p-3 rounded-xl text-red-500 hover:bg-red-50" title="Chiqish">
              <FiLogOut size={22} />
            </button>
          </div>
        )}
      </div>

      {/* Main content - responsive padding */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        <main className="p-3 md:p-6 lg:p-8 pt-[60px] lg:pt-6">
          {children}
        </main>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;