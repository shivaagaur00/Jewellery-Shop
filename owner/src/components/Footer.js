import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Jewelers</h3>
            <p className="text-gray-400 mb-4">
              Crafting exquisite jewelry since 1995. Our pieces reflect tradition, elegance, and timeless beauty.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                <FacebookIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                <InstagramIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                <TwitterIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                <PinterestIcon />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Collections</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Shop</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Return Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Payment Options</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Size Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <LocationOnIcon className="mr-2 mt-1 text-amber-400" />
                <span className="text-gray-400">123 Jewel Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="mr-2 text-amber-400" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <EmailIcon className="mr-2 text-amber-400" />
                <span className="text-gray-400">info@jewelers.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Jewelers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;