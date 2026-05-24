import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';

function GalleryUpload({ images = [], onImagesChange, maxImages = 5 }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/') && images.length < maxImages) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        onImagesChange([...images, imageData]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt={`Gallery ${index + 1}`}
              className="w-20 h-20 rounded-lg object-cover border-2 border-accent"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragActive ? 'border-accent bg-accent/10' : 'border-gray-300 hover:border-accent'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <FiPlus size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">Qo'shish</span>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400">
        {images.length}/{maxImages} rasm yuklandi
      </p>
    </div>
  );
}

export default GalleryUpload;