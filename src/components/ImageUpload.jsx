import React, { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

function ImageUpload({ onImageSelect, currentImage, onRemove }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setPreview(imageData);
        onImageSelect(imageData);
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

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-lg object-cover border-2 border-accent"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
          >
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
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
          <FiUpload size={32} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Rasm yuklash uchun bosing yoki suring</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF gacha 5MB</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;