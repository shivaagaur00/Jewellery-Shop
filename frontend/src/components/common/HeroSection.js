import React from 'react';
import DiamondIcon from '@mui/icons-material/Diamond';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  
  return (
    <section id="home" className="relative bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-300 blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-amber-400 blur-xl"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0 relative z-10">
          <div className="flex items-center mb-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 mr-3">
              <DiamondIcon className="text-amber-600" fontSize="small" />
            </div>
            <span className="text-amber-600 font-medium tracking-wider">Premium Jewelry</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Exquisite <span className="text-amber-600">Gold & Silver</span> Jewelry Collections
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
            Discover timeless pieces crafted with precision and passion. Each item tells a story of elegance and tradition.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-medium flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-200/50">
              Shop Now <ArrowForwardIcon className="ml-2" />
            </button>
            <Link to="/collections">
            <button className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-md">
              Explore Collections
            </button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3].map((item) => (
                  <img 
                    key={item}
                    src={`https://randomuser.me/api/portraits/women/${item + 20}.jpg`}
                    alt="Happy customer"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">500+ Happy Customers</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Authentic Quality</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center relative z-10">
          <div className="relative">
            <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center overflow-hidden shadow-2xl transform rotate-2">
              <img 
                src="https://d25g9z9s77rn4i.cloudfront.net/uploads/product/1341/1707916623_f37993843c432aa445d4.png"
                alt="Gold Necklace" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white p-5 rounded-xl shadow-xl border border-amber-100 transform -rotate-6">
              <div className="text-amber-600 font-bold text-2xl">₹15,999</div>
              <div className="text-gray-600 text-sm">Gold Plated Necklace</div>
            </div>
            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-amber-100/50 backdrop-blur-sm flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-200/70 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;