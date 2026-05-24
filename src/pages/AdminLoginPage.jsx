import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { FiShield, FiLock } from 'react-icons/fi';

function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const { loginAdmin, isAdmin } = useAdmin();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      showToast("Admin panelga xush kelibsiz!", "success");
      navigate('/');
    } else {
      showToast("Noto'g'ri parol!", "error");
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-serif text-dark">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-2">Kirish uchun parolni kiriting</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Parol</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin parolini kiriting"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent transition-all"
                autoFocus
              />
            </div>
           
          </div>
          
          <button
            type="submit"
            className="w-full bg-accent text-white rounded-full py-3 font-semibold hover:bg-accent-dark transition-all"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;