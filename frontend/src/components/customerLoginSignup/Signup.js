import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Person, Mail, Lock, CameraAlt, Delete, Phone } from '@mui/icons-material';
import DiamondIcon from '@mui/icons-material/Diamond';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { signUp } from '../../api/customerAPIs';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    contactNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    profileImage: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'contactNumber') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    try {
      setIsLoading(true);
      setErrors(prev => ({ ...prev, profileImage: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", "ml_default");
      
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dthriaot4/image/upload",
        cloudinaryFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        profileImage: response.data.secure_url
      }));
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        profileImage: 'Failed to upload image'
      }));
      console.error(err);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, profileImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.id.trim()) newErrors.id = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.id)) newErrors.id = 'Email is invalid';
    if (!formData.contactNumber) newErrors.contactNumber = 'Phone number is required';
    else if (formData.contactNumber.length < 10) newErrors.contactNumber = 'Phone number must be 10 digits';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.profileImage) newErrors.profileImage = 'Profile image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const res=signUp(formData);
        console.log(res);
        alert('Account created successfully!');
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          server: err.response?.data?.message || 'Signup failed'
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amber-500 to-amber-700 flex-col items-center justify-center p-8 lg:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <DiamondIcon className="text-white text-4xl lg:text-5xl" />
              <h1 className="text-3xl lg:text-4xl font-bold text-white font-serif">Jewelsphere</h1>
            </div>
            <p className="text-amber-100 text-lg lg:text-xl max-w-md">
              Create your account and explore our exquisite jewelry collection
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-6 text-center">
              <div className="flex justify-center items-center gap-2 mb-3">
                <DiamondIcon className="text-amber-600 text-3xl" />
                <h2 className="text-2xl font-bold text-amber-800 font-serif">Jewelsphere</h2>
              </div>
              <p className="text-amber-600">Create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100 mb-3 sm:mb-4 overflow-hidden border-2 border-amber-300">
                  {imagePreview ? (
                    <>
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-500">
                      <CameraAlt fontSize="large" />
                    </div>
                  )}
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition flex items-center gap-2 ${
                    isLoading ? 'bg-amber-200' : 'bg-amber-100 hover:bg-amber-200'
                  } text-amber-800 text-sm sm:text-base`}>
                    {isLoading && uploadProgress > 0 ? (
                      <>
                        <CircularProgress size={18} variant="determinate" value={uploadProgress} />
                        <span>{uploadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <CameraAlt fontSize="small" />
                        <span>Upload Photo</span>
                      </>
                    )}
                  </div>
                </label>
                {errors.profileImage && (
                  <p className="mt-1 text-sm text-rose-600 text-center">{errors.profileImage}</p>
                )}
              </div>
              <div>
                <label htmlFor="name" className="block text-sm sm:text-base font-medium text-amber-800 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Person className="text-amber-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 text-sm sm:text-base border ${errors.name ? 'border-rose-500' : 'border-amber-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="id" className="block text-sm sm:text-base font-medium text-amber-800 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-amber-500" />
                  </div>
                  <input
                    type="email"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 text-sm sm:text-base border ${errors.id ? 'border-rose-500' : 'border-amber-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.id && <p className="mt-1 text-sm text-rose-600">{errors.id}</p>}
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm sm:text-base font-medium text-amber-800 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-amber-500" />
                  </div>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 text-sm sm:text-base border ${errors.contactNumber ? 'border-rose-500' : 'border-amber-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    placeholder="9876543210"
                    maxLength="10"
                    disabled={isLoading}
                  />
                </div>
                {errors.contactNumber && <p className="mt-1 text-sm text-rose-600">{errors.contactNumber}</p>}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm sm:text-base font-medium text-amber-800 mb-1">
                  Address (Optional)
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm sm:text-base border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  placeholder="123 Main St, City"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm sm:text-base font-medium text-amber-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-amber-500" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 text-sm sm:text-base border ${errors.password ? 'border-rose-500' : 'border-amber-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-medium text-amber-800 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-amber-500" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 text-sm sm:text-base border ${errors.confirmPassword ? 'border-rose-500' : 'border-amber-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 mt-4 rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </button>
              {errors.server && (
                <p className="text-sm text-rose-600 text-center mt-2">{errors.server}</p>
              )}
              <div className="text-center pt-4">
                <p className="text-sm sm:text-base text-amber-800">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-amber-600 hover:text-amber-800 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;