// Categories.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiamondIcon from '@mui/icons-material/Diamond';
import WatchIcon from '@mui/icons-material/Watch';
import RingIcon from '@mui/icons-material/AccountTree';

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: 1,
      name: 'Gold Jewelry',
      value: 'gold',
      icon: <DiamondIcon className="text-5xl text-amber-500" />,
      items: 128,
      bg: 'bg-amber-50',
      hover: 'hover:bg-amber-100'
    },
    {
      id: 2,
      name: 'Silver Jewelry',
      value: 'silver',
      icon: <LocalOfferIcon className="text-5xl text-gray-500" />,
      items: 95,
      bg: 'bg-gray-50',
      hover: 'hover:bg-gray-100'
    },
    {
      id: 3,
      name: 'Bridal Sets',
      value: 'bridal',
      icon: <RingIcon className="text-5xl text-rose-400" />,
      items: 42,
      bg: 'bg-rose-50',
      hover: 'hover:bg-rose-100'
    },
    {
      id: 4,
      name: 'Watches',
      value: 'watches',
      icon: <WatchIcon className="text-5xl text-blue-500" />,
      items: 36,
      bg: 'bg-blue-50',
      hover: 'hover:bg-blue-100'
    }
  ];

  const handleCategoryClick = (categoryValue) => {
    navigate(`/collections?category=${categoryValue}`);
  };

  return (
    <section id="categories" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover exquisite pieces from our carefully curated collections
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`${category.bg} ${category.hover} p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center transform hover:-translate-y-2 flex flex-col items-center cursor-pointer`}
              onClick={() => handleCategoryClick(category.value)}
            >
              <div className="w-20 h-20 flex items-center justify-center mb-6 rounded-full bg-white shadow-inner">
                {category.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">{category.name}</h3>
              <p className="text-gray-500 mb-6">{category.items}+ items</p>
              <button className="mt-auto px-6 py-2 bg-white text-amber-600 rounded-full font-medium border border-amber-200 hover:bg-amber-600 hover:text-white transition-colors duration-300">
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;