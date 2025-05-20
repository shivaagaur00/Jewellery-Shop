import React from 'react';
import { Star, Favorite, FlashOn, NewReleases, LocalFireDepartment, Whatshot } from '@mui/icons-material';

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
  {
    id: 5,
    name: 'Rose Gold Bangle',
    price: '₹11,999',
    originalPrice: '₹16,499',
    discount: '27% OFF',
    image: 'https://images.unsplash.com/photo-1611594606051-2ac39a441952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    rating: 4.6,
    isNew: true,
  },
  {
    id: 6,
    name: 'Platinum Wedding Band',
    price: '₹32,999',
    originalPrice: '₹45,999',
    discount: '28% OFF',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    isBestSeller: true,
  },
  {
    id: 7,
    name: 'Emerald Pendant',
    price: '₹14,799',
    originalPrice: '₹20,499',
    discount: '27% OFF',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    rating: 4.7,
    isTrending: true,
  },
  {
    id: 8,
    name: 'Sapphire Studs',
    price: '₹9,499',
    originalPrice: '₹13,999',
    discount: '32% OFF',
    image: 'https://images.unsplash.com/photo-1603974372038-a6e1c8625b71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    rating: 4.5,
    isLimited: true,
  },
  {
    id: 9,
    name: 'Ruby Bracelet',
    price: '₹16,999',
    originalPrice: '₹23,999',
    discount: '29% OFF',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    isTrending: true,
  },
  {
    id: 10,
    name: 'Diamond Tennis Bracelet',
    price: '₹28,999',
    originalPrice: '₹39,999',
    discount: '27% OFF',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    isBestSeller: true,
  },
];

const Collections = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Our Exquisite Collections</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover handcrafted jewelry pieces that reflect elegance and timeless beauty
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-medium flex items-center">
            <FlashOn className="mr-1" fontSize="small" /> New Arrivals
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium flex items-center">
            <LocalFireDepartment className="mr-1" fontSize="small" /> Best Sellers
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium flex items-center">
            <Whatshot className="mr-1" fontSize="small" /> Trending
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium">
            Rings
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium">
            Necklaces
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium">
            Earrings
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {collections.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-64 object-cover"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {item.isNew && (
                    <span className="bg-white text-amber-600 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <NewReleases className="mr-1" fontSize="small" /> NEW
                    </span>
                  )}
                  {item.isBestSeller && (
                    <span className="bg-white text-red-500 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <LocalFireDepartment className="mr-1" fontSize="small" /> BESTSELLER
                    </span>
                  )}
                  {item.isTrending && (
                    <span className="bg-white text-blue-500 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Whatshot className="mr-1" fontSize="small" /> TRENDING
                    </span>
                  )}
                  {item.isLimited && (
                    <span className="bg-white text-purple-500 px-2 py-1 rounded-full text-xs font-bold">
                      LIMITED
                    </span>
                  )}
                </div>
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                  <Favorite className="text-gray-400 hover:text-red-500" />
                </button>
                <span className="absolute bottom-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {item.discount}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <div className="flex items-center">
                    <Star className="text-amber-400" fontSize="small" />
                    <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">{item.price}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
                </div>
                
                <button className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="border border-amber-500 text-amber-500 hover:bg-amber-50 px-6 py-3 rounded-lg font-medium transition duration-300">
            Load More Collections
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collections;