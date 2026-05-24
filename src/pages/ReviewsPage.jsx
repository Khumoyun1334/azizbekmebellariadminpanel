import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { FiStar, FiStar as FiStarOutline, FiTrash2, FiCalendar, FiUser } from 'react-icons/fi';

function ReviewsPage() {
  const { showToast } = useToast();
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    loadAllReviews();
  }, []);

  const loadAllReviews = () => {
    const reviews = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('reviews_')) {
        const productId = key.replace('reviews_', '');
        const productReviews = JSON.parse(localStorage.getItem(key));
        productReviews.forEach(review => {
          reviews.push({ ...review, productId: parseInt(productId) });
        });
      }
    }
    setAllReviews(reviews.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const deleteReview = (reviewId, productId) => {
    if (window.confirm('Fikrni o\'chirmoqchimisiz?')) {
      const key = `reviews_${productId}`;
      const reviews = JSON.parse(localStorage.getItem(key));
      const updatedReviews = reviews.filter(r => r.id !== reviewId);
      localStorage.setItem(key, JSON.stringify(updatedReviews));
      loadAllReviews();
      showToast("Fikr o'chirildi", "success");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Noma\'lum';
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-serif text-dark mb-6">Mijozlar Fikrlari</h1>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500">Jami: {allReviews.length} ta fikr</p>
      </div>

      {allReviews.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <div className="text-5xl mb-3">⭐</div>
          <p>Hali hech qanday fikr yo'q</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allReviews.map(review => (
            <div key={review.id} className="border border-gray-200 rounded-xl p-4 bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <FiUser size={14} className="text-gray-400 shrink-0" />
                    <span className="font-semibold text-dark break-words">{review.userName}</span>
                    <span className="text-xs text-gray-400">Mahsulot #{review.productId}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      i < review.rating ? 
                        <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : 
                        <FiStarOutline key={i} className="w-4 h-4 text-gray-300" />
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                    <FiCalendar size={10} /> {formatDate(review.date)}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mt-3 leading-relaxed break-words">
                {review.comment}
              </p>
              
              <div className="mt-4 pt-2">
                <button
                  onClick={() => deleteReview(review.id, review.productId)}
                  className="text-red-500 text-sm hover:underline flex items-center gap-1"
                >
                  <FiTrash2 size={14} /> O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;