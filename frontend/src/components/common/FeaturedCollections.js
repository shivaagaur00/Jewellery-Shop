import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { Link } from 'react-router-dom';

const FeaturedCollections = () => {
  const collections = [
    {
      id: 1,
      name: 'Gold Plated Earrings',
      price: '₹8,999',
      originalPrice: '₹12,999',
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1611591437281-460914d0f587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      isNew: true,
    },
    {
      id: 2,
      name: 'Silver Bracelet',
      price: '₹6,499',
      originalPrice: '₹9,999',
      discount: '35% OFF',
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.5,
      isTrending: true,
    },
    {
      id: 3,
      name: 'Diamond Ring',
      price: '₹24,999',
      originalPrice: '₹34,999',
      discount: '28% OFF',
      image: 'https://images.unsplash.com/photo-1603974372038-a6e1c8625b71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.9,
      isBestSeller: true,
    },
    {
      id: 4,
      name: 'Pearl Necklace',
      price: '₹18,499',
      originalPrice: '₹25,999',
      discount: '28% OFF',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      rating: 4.7,
      isLimited: true,
    },
  ];

  return (
    <section id="collections" className="py-20 bg-gradient-to-b from-amber-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-200 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-rose-200 rounded-full opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-amber-400 to-rose-400 text-white text-sm font-semibold rounded-full shadow-md">
            Premium Collection
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-rose-600">
              Featured Collections
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover our exquisite handcrafted jewelry pieces that blend tradition with modern elegance.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 space-y-2">
                {item.isNew && (
                  <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                    NEW
                  </span>
                )}
                {item.isTrending && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-md">
                    TRENDING
                  </span>
                )}
                {item.isBestSeller && (
                  <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-md">
                    BESTSELLER
                  </span>
                )}
                {item.isLimited && (
                  <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-md">
                    LIMITED
                  </span>
                )}
                {item.discount && (
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md">
                    {item.discount}
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <div className="absolute top-4 right-4 z-10">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-rose-100 text-gray-500 hover:text-rose-500 transition-all duration-300 transform group-hover:scale-110">
                  <FavoriteIcon fontSize="small" />
                </button>
              </div>

              {/* Image Section */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    {item.name}
                  </h3>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`${i < Math.floor(item.rating) ? 'text-amber-400' : 'text-gray-300'} text-sm`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm font-medium">{item.rating}</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-xl font-bold text-amber-600">{item.price}</span>
                  {item.originalPrice && (
                    <span className="ml-2 text-sm text-gray-400 line-through">{item.originalPrice}</span>
                  )}
                </div>
                
                <button className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg group-hover:shadow-amber-200/50">
                  <FlashOnIcon className="mr-2" fontSize="small" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link to="/Collections">
          <button className="relative px-8 py-4 bg-transparent border-2 border-amber-600 text-amber-600 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300 group overflow-hidden">
            <span className="relative z-10">Explore All Collections</span>
            <span className="absolute inset-0 bg-amber-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-0"></span>
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;