import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import ImageUpload from './ImageUpload';
import GalleryUpload from './GalleryUpload';
import { FiPlus, FiX } from 'react-icons/fi';

function ProductFormModal({ product, onClose }) {
  const { addProduct, updateProduct } = useAdmin();
  const { showToast } = useToast();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'Oshxona Mebellari',
    price: product?.price || '',
    oldPrice: product?.oldPrice || '',
    badge: product?.badge || '',
    img: product?.img || '',
    images: product?.images || [],
    desc: product?.desc || '',
    rating: product?.rating || 0,
    reviews: product?.reviews || 0,
    colors: product?.colors || ['#8B7355', '#4A4A4A', '#C89B6D']
  });

  const [priceDisplay, setPriceDisplay] = useState(() => {
    if (product?.price) {
      return formatNumberWithCommas(product.price);
    }
    return '';
  });

  const [oldPriceDisplay, setOldPriceDisplay] = useState(() => {
    if (product?.oldPrice) {
      return formatNumberWithCommas(product.oldPrice);
    }
    return '';
  });

  const categories = ['Oshxona Mebellari', 'Yotoqxona Mebellari', 'Mehmonxona Mebellari', 'Yumshoq Mebellar', 'Ofis Mebellari'];
  const badges = ['', 'Eng Ko\'p Sotilgan', 'Yangi', 'Premium', 'Chegirma'];
  const colorOptions = ['#8B7355', '#4A4A4A', '#C89B6D', '#2C3E50', '#E8DDD4', '#FFFFFF', '#4A2C6B', '#1A3A5C'];

  function formatNumberWithCommas(num) {
    if (!num && num !== 0) return '';
    const numStr = num.toString().replace(/[^0-9]/g, '');
    if (!numStr) return '';
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function parseNumberFromDisplay(value) {
    if (!value) return '';
    const numbers = value.replace(/[^0-9]/g, '');
    if (!numbers) return '';
    return parseInt(numbers, 10);
  }

  const handlePriceChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, '');
    let rawValue = value.replace(/,/g, '');
    const formatted = formatNumberWithCommas(rawValue);
    setPriceDisplay(formatted);
    const realValue = parseNumberFromDisplay(formatted);
    setFormData(prev => ({ ...prev, price: realValue }));
  };

  const handleOldPriceChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9,]/g, '');
    let rawValue = value.replace(/,/g, '');
    const formatted = formatNumberWithCommas(rawValue);
    setOldPriceDisplay(formatted);
    const realValue = parseNumberFromDisplay(formatted);
    setFormData(prev => ({ ...prev, oldPrice: realValue }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (imageData) => {
    setFormData(prev => ({ ...prev, img: imageData }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, img: '' }));
  };

  const handleGalleryChange = (galleryImages) => {
    setFormData(prev => ({ ...prev, images: galleryImages }));
  };

  const handleAddColor = () => {
    setFormData(prev => ({ ...prev, colors: [...prev.colors, '#C89B6D'] }));
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleColorChange = (index, color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => i === index ? color : c)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.desc) {
      showToast("Barcha majburiy maydonlarni to'ldiring!", "error");
      return;
    }

    if (!formData.img && !isEditing) {
      showToast("Mahsulot uchun asosiy rasm yuklang!", "error");
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      images: formData.images.length > 0 ? formData.images : [formData.img]
    };

    if (isEditing) {
      updateProduct(product.id, productData);
      showToast(`${formData.name} tahrirlandi`, "success");
    } else {
      addProduct(productData);
      showToast(`${formData.name} qo'shildi`, "success");
    }
    
    onClose();
  };

  const getPriceDisplay = (price) => {
    if (!price) return '';
    return formatNumberWithCommas(price) + ' so\'m';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] animate-fadeIn overflow-y-auto py-8">
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-xl md:text-2xl font-serif text-dark">
            {isEditing ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Mahsulot Nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masalan: Luka Divan"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Kategoriya <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Narxi (so'm) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder="Masalan: 2449000 yoki 2,449,000"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 Raqamni yozing, vergul avtomatik qo'yiladi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Eski Narxi (chegirma uchun)
              </label>
              <input
                type="text"
                value={oldPriceDisplay}
                onChange={handleOldPriceChange}
                placeholder="Masalan: 3200000 yoki 3,200,000"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Badge (Ko'krak)
              </label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all"
              >
                {badges.map(b => (
                  <option key={b} value={b}>{b || 'Yo\'q'}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.price && (
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-sm text-green-700">
                ✅ Hozirgi narx: <span className="font-bold">{getPriceDisplay(formData.price)}</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Asosiy Rasm <span className="text-red-500">*</span>
            </label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              currentImage={formData.img}
              onRemove={handleImageRemove}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Galereya Rasmlari (Qo'shimcha)
            </label>
            <GalleryUpload
              images={formData.images}
              onImagesChange={handleGalleryChange}
              maxImages={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Mavjud Ranglar
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddColor}
                className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-accent transition-all"
              >
                <FiPlus size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <p className="text-xs text-gray-500 w-full mb-2">Yoki hazir ranglardan tanlang:</p>
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    if (!formData.colors.includes(color)) {
                      setFormData(prev => ({ ...prev, colors: [...prev.colors, color] }));
                    }
                  }}
                  style={{ backgroundColor: color }}
                  className="w-7 h-7 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                  title={color}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Tavsif <span className="text-red-500">*</span>
            </label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              rows={4}
              placeholder="Mahsulot haqida batafsil ma'lumot..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all resize-none"
              required
            />
          </div>

          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Reyting (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Fikrlar Soni
                </label>
                <input
                  type="number"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-accent text-white rounded-full py-3 text-sm font-semibold hover:bg-accent-dark transition-all"
            >
              {isEditing ? 'Saqlash' : 'Qo\'shish'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 rounded-full py-3 text-sm font-semibold hover:bg-gray-50 transition-all"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;