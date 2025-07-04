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
  Person as PersonIcon,
  ArrowBack
} from '@mui/icons-material';
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Contact Our Jewelry Experts</h1>
          <p className="text-amber-700">We're here to assist with your precious inquiries</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row border border-amber-100">
          {/* Contact Form */}
          <div className="p-8 lg:p-12 flex-1">
            <div className="flex items-center mb-6">
              <Diamond className="text-amber-500 text-3xl mr-3" />
              <h2 className="text-2xl font-serif font-semibold text-amber-900">Send Us a Message</h2>
            </div>
            
            <form className="space-y-6">
              <div className="relative">
                <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition bg-amber-50"
                />
              </div>
              
              <div className="relative">
                <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition bg-amber-50"
                />
              </div>
              
              <div className="relative">
                <textarea 
                  placeholder="Your Message" 
                  rows="5"
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition bg-amber-50"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  Send Message
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>

                <Link to="/" className="flex-1">
                  <button className="w-full bg-white border border-amber-600 text-amber-600 hover:bg-amber-50 font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                    <ArrowBack className="mr-2" />
                    Back to Home
                  </button>
                </Link>
              </div>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="bg-amber-50 p-8 lg:p-12 lg:w-96 border-t lg:border-t-0 lg:border-l border-amber-100">
            <div className="flex items-center mb-6">
              <Diamond className="text-amber-500 text-3xl mr-3" />
              <h2 className="text-2xl font-serif font-semibold text-amber-900">Our Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-2 bg-amber-100 rounded-lg mr-4">
                  <LocationIcon className="text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Visit Our Boutique</h4>
                  <p className="text-amber-700">123 Diamond Street<br />Jewelry District<br />New York, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-amber-100 rounded-lg mr-4">
                  <PhoneIcon className="text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Call Us</h4>
                  <p className="text-amber-700">+1 (212) 555-0100<br />+1 (212) 555-0101</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-amber-100 rounded-lg mr-4">
                  <EmailIcon className="text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Email Us</h4>
                  <p className="text-amber-700">contact@luxejewels.com<br />support@luxejewels.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-amber-100 rounded-lg mr-4">
                  <HoursIcon className="text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Business Hours</h4>
                  <p className="text-amber-700">Monday - Friday: 10AM - 7PM<br />Saturday: 10AM - 5PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-amber-200">
              <h4 className="font-medium text-amber-800 mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-amber-100 hover:bg-amber-200 text-amber-600 p-2 rounded-full transition">
                  <Instagram />
                </a>
                <a href="#" className="bg-amber-100 hover:bg-amber-200 text-amber-600 p-2 rounded-full transition">
                  <Facebook />
                </a>
                <a href="#" className="bg-amber-100 hover:bg-amber-200 text-amber-600 p-2 rounded-full transition">
                  <Twitter />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;