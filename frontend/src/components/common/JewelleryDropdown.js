import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Diamond as DiamondIcon,
  AttachMoney as PriceIcon,
  Event as OccasionIcon,
  People as GenderIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const JewelleryDropdown = () => {
  const [activeTab, setActiveTab] = useState('category');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'all-jewellery', name: 'All Jewellery', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery' },
    { id: 'earrings', name: 'Earrings', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/earring' },
    { id: 'pendants', name: 'Pendants', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/pendants' },
    { id: 'finger-rings', name: 'Finger Rings', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/finger-rings' },
    { id: 'mangalsutra', name: 'Mangalsutra', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/mangalsutra-1' },
    { id: 'chains', name: 'Chains', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/chains' },
    { id: 'nosepins', name: 'Nose Pin', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/nosepins' },
    { id: 'necklaces', name: 'Necklaces', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/necklaces' },
    { id: 'necklace-set', name: 'Necklace Set', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/necklace-set' },
    { id: 'bangles', name: 'Bangles', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/bangles-1' },
    { id: 'bracelets', name: 'Bracelets', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/bracelets' },
    { id: 'pendant-earrings-set', name: 'Pendants & Earring Set', icon: <DiamondIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/pendants-and-earring-set' }
  ];

  const priceRanges = [
    { id: '25k', name: '<25K', icon: <PriceIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery?pmin=0&pmax=25000' },
    { id: '25k-50k', name: '25K-50K', icon: <PriceIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery?pmin=25000&pmax=50000' },
    { id: '50k-1l', name: '50K-1L', icon: <PriceIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery?pmin=50000&pmax=100000' },
    { id: '1l-above', name: '1L & Above', icon: <PriceIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery?pmin=100000&pmax=3000000' }
  ];

  const occasions = [
    { id: 'office-wear', name: 'Office Wear', icon: <OccasionIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery?prefn1=occasion&prefv1=Office%20Wear' },
    { id: 'modern-wear', name: 'Modern Wear', icon: <OccasionIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery?prefn1=occasion&prefv1=Modern%20Wear' },
    { id: 'casual-wear', name: 'Casual Wear', icon: <OccasionIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery?prefn1=occasion&prefv1=Casual%20Wear' },
    { id: 'traditional-wear', name: 'Traditional Wear', icon: <OccasionIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/jewellery?prefn1=occasion&prefv1=Traditional%20and%20Ethnic%20Wear' }
  ];

  const genders = [
    { id: 'womens-jewellery', name: 'Women', icon: <GenderIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/womens-jewellery' },
    { id: 'mens-jewellery', name: 'Men', icon: <GenderIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/mens-jewellery' },
    { id: 'kids-jewellery', name: 'Kids & Teens', icon: <GenderIcon style={{ fontSize: '1.2rem' }} />, link: '/shop/kids-jewellery' }
  ];

  const renderContent = () => {
    const items = {
      category: categories,
      price: priceRanges,
      occasion: occasions,
      gender: genders
    }[activeTab];

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {items.map((item) => (
          <Link 
            key={item.id}
            to={item.link}
            className="flex flex-col items-center p-2 rounded hover:bg-amber-50 transition-colors"
            onClick={() => {
              setIsOpen(false);
              setMobileMenuOpen(false);
            }}
          >
            <span className="text-amber-600 mb-1">{item.icon}</span>
            <span className="text-sm font-medium text-amber-800 text-center">{item.name}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Desktop Trigger */}
      <div 
        className="hidden md:block"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button 
          className="flex items-center text-amber-900 hover:text-amber-600 font-medium py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <DiamondIcon style={{ fontSize: '1.2rem', marginRight: '0.5rem' }} />
          All Jewellery
        </button>
      </div>
      
      {/* Mobile Trigger */}
      <div className="md:hidden">
        <button 
          className="flex items-center text-amber-900 hover:text-amber-600 font-medium py-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <DiamondIcon style={{ fontSize: '1.2rem', marginRight: '0.5rem' }} />
          All Jewellery
          {mobileMenuOpen ? (
            <CloseIcon style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }} />
          ) : (
            <ChevronRightIcon style={{ fontSize: '1.2rem', marginLeft: '0.5rem' }} />
          )}
        </button>
      </div>
      
      {/* Desktop Dropdown */}
      {isOpen && (
        <div className="hidden md:block absolute left-0 top-full mt-0 w-[800px] bg-white shadow-xl rounded-b-lg z-20 border border-amber-100">
          <div className="grid grid-cols-5">
            {/* Filters Sidebar */}
            <div className="col-span-1 bg-gray-50 p-4 border-r border-amber-100">
              <button 
                className={`w-full text-left font-bold mb-3 flex items-center ${activeTab === 'category' ? 'text-amber-700' : 'text-amber-800'}`}
                onClick={() => setActiveTab('category')}
              >
                <StarIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Category
              </button>
              <button 
                className={`w-full text-left font-bold mb-3 flex items-center ${activeTab === 'price' ? 'text-amber-700' : 'text-amber-800'}`}
                onClick={() => setActiveTab('price')}
              >
                <PriceIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Price
              </button>
              <button 
                className={`w-full text-left font-bold mb-3 flex items-center ${activeTab === 'occasion' ? 'text-amber-700' : 'text-amber-800'}`}
                onClick={() => setActiveTab('occasion')}
              >
                <OccasionIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Occasion
              </button>
              <button 
                className={`w-full text-left font-bold mb-3 flex items-center ${activeTab === 'gender' ? 'text-amber-700' : 'text-amber-800'}`}
                onClick={() => setActiveTab('gender')}
              >
                <GenderIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
                Gender
              </button>
            </div>
            
            {/* Main Content */}
            <div className="col-span-3 p-4">
              {renderContent()}
              
              <div className="mt-6 flex justify-between items-center">
                <Link 
                  to="/shop/jewellery" 
                  className="text-amber-600 font-medium hover:underline flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  View All Jewellery <ChevronRightIcon style={{ fontSize: '1rem', marginLeft: '0.25rem' }} />
                </Link>
                <div className="w-32 h-20 bg-gradient-to-r from-amber-100 to-amber-200 rounded flex items-center justify-center text-xs text-amber-800">
                  <StarIcon style={{ fontSize: '1rem', marginRight: '0.25rem' }} /> Special Offers
                </div>
              </div>
            </div>
            
            {/* Promotional Banner */}
            <div className="col-span-1 bg-gradient-to-b from-amber-50 to-amber-100 p-4 flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-amber-800 mb-2">New Collection</h3>
                <p className="text-sm text-amber-700 mb-4">Exquisite designs for your special moments</p>
                <Link 
                  to="/shop/elan" 
                  className="text-amber-700 underline flex items-center text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Explore Now <ChevronRightIcon style={{ fontSize: '1rem', marginLeft: '0.25rem' }} />
                </Link>
              </div>
              <div className="w-full h-24 bg-gradient-to-r from-amber-200 to-amber-300 rounded flex items-center justify-center text-amber-800">
                <OfferIcon style={{ fontSize: '2rem' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4 border border-amber-100">
          {/* Mobile Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
            <button 
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium ${activeTab === 'category' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('category')}
            >
              <StarIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Category
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium ${activeTab === 'price' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('price')}
            >
              <PriceIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Price
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium ${activeTab === 'occasion' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('occasion')}
            >
              <OccasionIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Occasion
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium ${activeTab === 'gender' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('gender')}
            >
              <GenderIcon style={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              Gender
            </button>
          </div>
          
          {/* Mobile Content */}
          {renderContent()}
          
          <div className="mt-4 flex flex-col gap-3">
            <Link 
              to="/shop/jewellery" 
              className="w-full text-center py-2 bg-amber-50 text-amber-700 font-medium rounded-lg hover:bg-amber-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              View All Jewellery
            </Link>
            <Link 
              to="/shop/elan" 
              className="w-full text-center py-2 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-800 font-medium rounded-lg hover:opacity-90"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore New Collection
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default JewelleryDropdown;