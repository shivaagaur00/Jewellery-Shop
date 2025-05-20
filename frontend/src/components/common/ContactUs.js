import React from 'react';
import { 
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Instagram,
  Facebook,
  Twitter,
  Diamond,
  AccessTime as HoursIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import {Link} from "react-router-dom";
const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-95 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        <div className="p-8 lg:p-12 flex-1">
          <div className="flex items-center mb-8">
            <Diamond className="text-amber-500 text-4xl mr-3" />
            <h1 className="text-3xl font-serif font-bold text-gray-800">LUXE JEWELS</h1>
          </div>
          
          <h2 className="text-2xl font-serif font-medium text-gray-700 mb-6">Contact Us</h2>
          
          <form className="space-y-6">
            <div className="relative">
              <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition"
              />
            </div>
            
            <div className="relative">
              <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition"
              />
            </div>
            
            <div className="relative">
              <textarea 
                placeholder="Your Message" 
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
            >
              Send Message
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button >

            <Link to="/">
            <button className='bg-amber-500 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center mt-10'>Back to Home </button>
            </Link>
          </form>
        </div>
        
        {/* Right Side - Contact Info */}
        <div className="bg-amber-50 p-8 lg:p-12 lg:w-96 flex flex-col">
          <h3 className="text-xl font-serif font-medium text-gray-700 mb-6">Our Information</h3>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <LocationIcon className="text-amber-500 mt-1 mr-4 text-xl" />
              <div>
                <h4 className="font-medium text-gray-700">Visit Us</h4>
                <p className="text-gray-600">123 Diamond Street<br />Jewelry District<br />New York, NY 10001</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <PhoneIcon className="text-amber-500 mt-1 mr-4 text-xl" />
              <div>
                <h4 className="font-medium text-gray-700">Call Us</h4>
                <p className="text-gray-600">+1 (212) 555-0100<br />+1 (212) 555-0101</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <EmailIcon className="text-amber-500 mt-1 mr-4 text-xl" />
              <div>
                <h4 className="font-medium text-gray-700">Email Us</h4>
                <p className="text-gray-600">contact@luxejewels.com<br />support@luxejewels.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <HoursIcon className="text-amber-500 mt-1 mr-4 text-xl" />
              <div>
                <h4 className="font-medium text-gray-700">Business Hours</h4>
                <p className="text-gray-600">Monday - Friday: 10AM - 7PM<br />Saturday: 10AM - 5PM<br />Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-8">
            <h4 className="font-medium text-gray-700 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-amber-100 hover:bg-amber-200 text-amber-600 p-2 rounded-full transition">
                <Instagram fontSize="small" />
              </a>
              <a href="#" className="bg-amber-100 hover:bg-amber-200 text-amber-600 p-2 rounded-full transition">
                <Facebook fontSize="small" />
              </a>
              <a href="#" className="bg-amber-100 hover:bg-amber-200 text-amber-600 p-2 rounded-full transition">
                <Twitter fontSize="small" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;