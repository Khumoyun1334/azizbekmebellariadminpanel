import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import ProductFormModal from '../components/ProductFormModal';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

function ProductsPage() {
  const { products, deleteProduct } = useAdmin();
  const { showToast } = useToast();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'Oshxona Mebellari', 'Yotoqxona Mebellari', 'Mehmonxona Mebellari', 'Yumshoq Mebellar', 'Ofis Mebellari'];
  const categoryNames = {
    'all': 'Barchasi',
    'Oshxona Mebellari': 'Oshxona Mebellari',
    'Yotoqxona Mebellari': 'Yotoqxona Mebellari',
    'Mehmonxona Mebellari': 'Mehmonxona Mebellari',
    'Yumshoq Mebellar': 'Yumshoq Mebellar',
    'Ofis Mebellari': 'Ofis Mebellari'
  };

  const filteredProducts = (products || []).filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`"${name}" mahsulotini o'chirmoqchimisiz?`)) {
      deleteProduct(id);
      showToast(`${name} o'chirildi`, "error");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-serif text-dark">Mahsulotlar</h1>
        <button onClick={handleAdd} className="w-full sm:w-auto bg-success text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
          <FiPlus size={16} /> Yangi Mahsulot
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-all ${
                categoryFilter === cat ? 'bg-accent text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {categoryNames[cat]}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Mahsulot qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[600px]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Rasm</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Nomi</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Kategoriya</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Narxi</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <img src={product.img} alt={product.name} className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover" />
                  </td>
                  <td className="py-3 px-3 font-medium text-dark text-xs md:text-sm break-words max-w-[150px]">
                    {product.name}
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-xs">
                    {product.category}
                  </td>
                  <td className="py-3 px-3 font-semibold text-accent text-xs md:text-sm">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"
                      >
                        <FiEdit2 size={12} /> Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                      >
                        <FiTrash2 size={12} /> O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500">Hech qanday mahsulot topilmadi</div>
      )}

      {showProductForm && <ProductFormModal product={editingProduct} onClose={() => setShowProductForm(false)} />}
    </div>
  );
}

export default ProductsPage;