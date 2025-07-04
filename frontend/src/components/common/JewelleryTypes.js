import React from 'react';
import DiamondIcon from '@mui/icons-material/Diamond';
import CelebrationIcon from '@mui/icons-material/Celebration';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WomanIcon from '@mui/icons-material/Woman';
import SpaIcon from '@mui/icons-material/Spa';
import WatchIcon from '@mui/icons-material/Watch';
import VerifiedIcon from '@mui/icons-material/Verified'; 
import GppGoodIcon from '@mui/icons-material/GppGood';
import BuildIcon from '@mui/icons-material/Build';
import DesignServicesIcon from '@mui/icons-material/DesignServices'; 
const JewelleryTypes = () => {
  const categories = [
    {
      id: 1,
      icon: <DiamondIcon className="text-amber-600" fontSize="large" />,
      title: 'Exquisite Collections',
      description: 'Discover our breathtaking collections featuring handcrafted pieces that blend traditional craftsmanship with contemporary designs.',
      highlights: ['Bridal sets', 'Statement necklaces', 'Heritage designs']
    },
    {
      id: 2,
      icon: <CelebrationIcon className="text-amber-600" fontSize="large" />,
      title: 'For Every Occasion',
      description: 'From festive celebrations to intimate moments, find the perfect jewellery to complement your special occasions.',
      highlights: ['Wedding jewellery', 'Festival collections', 'Everyday elegance']
    },
    {
      id: 3,
      icon: <FavoriteIcon className="text-amber-600" fontSize="large" />,
      title: 'Timeless Classics',
      description: 'Our signature pieces that transcend trends and become family heirlooms passed through generations.',
      highlights: ['Diamond solitaires', 'Gold bangles', 'Pearl sets']
    },
    {
      id: 4,
      icon: <SpaIcon className="text-amber-600" fontSize="large" />,
      title: 'Bridal Jewellery',
      description: 'Magnificent collections designed to make brides shine on their most special day.',
      highlights: ['Kundan sets', 'Polki jewellery', 'Temple collections']
    },
    {
      id: 5,
      icon: <WomanIcon className="text-amber-600" fontSize="large" />,
      title: 'For Her',
      description: 'Elegant designs that celebrate femininity in all its forms, from delicate to bold statements.',
      highlights: ['Chandelier earrings', 'Layered necklaces', 'Stackable rings']
    },
    {
      id: 6,
      icon: <WatchIcon className="text-amber-600" fontSize="large" />,
      title: 'For Him',
      description: 'Sophisticated pieces that add a touch of luxury to masculine style.',
      highlights: ['Signet rings', 'Gold chains', 'Cufflinks']
    }
  ];

  const promises = [
    {
      text: '22K Hallmarked Gold',
      icon: <VerifiedIcon className="text-amber-600 mr-2" />
    },
    {
      text: 'Conflict-Free Diamonds',
      icon: <GppGoodIcon className="text-amber-600 mr-2" />
    },
    {
      text: 'Lifetime Maintenance',
      icon: <BuildIcon className="text-amber-600 mr-2" />
    },
    {
      text: 'Custom Designs',
      icon: <DesignServicesIcon className="text-amber-600 mr-2" />
    }
  ];

  return (
    <section id="jewellery-types" className="py-20 bg-amber-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-amber-800 font-serif">Jewellery Sphere Collections</h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-amber-900 max-w-2xl mx-auto text-lg">
            Explore our world of handcrafted luxury where every piece tells a story
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category) => (
            <div key={category.id} className="bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl border-t-4 border-amber-600">
              <div className="text-center mb-4">
                <div className="inline-block p-4 bg-amber-100 rounded-full">
                  {category.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center text-amber-800 mb-4 font-serif">{category.title}</h3>
              <p className="text-gray-700 mb-6 text-center">{category.description}</p>
              <ul className="space-y-2">
                {category.highlights.map((item, index) => (
                  <li key={index} className="flex items-center text-amber-900">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-amber-800 mb-6 font-serif">Our Craftsmanship Promise</h3>
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-amber-200">
            <p className="text-amber-900 mb-6 text-lg">
              At Jewellery Sphere, each piece undergoes rigorous quality checks by our master craftsmen. 
              We use only ethically sourced diamonds and 22K pure gold to create jewellery that lasts generations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {promises.map((promise, index) => (
                <div key={index} className="bg-amber-100 px-4 py-3 rounded-md text-amber-800 font-medium flex items-center justify-center">
                  {promise.icon}
                  {promise.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JewelleryTypes;