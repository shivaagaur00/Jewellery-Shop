import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ownerSignUpApi } from '../../../api/ownerApi';

const OwnerSignUp = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [erros, setErrors] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: ""
    };
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
        const response=await ownerSignUpApi({
          ID: formData.email,
      password: formData.password,
        }
        );
      // Here you would typically send the data to your backend
      // Example: 
      // axios.post('/api/owner/signup', formData)
      //   .then(response => {
      //     // Handle success
      //   })
      //   .catch(error => {
      //     // Handle error
      //   });

      alert('Account created successfully!');
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
      });
    }
    else{
      console.log(erros);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10'>
        <div className='p-8'>
          <div className='flex flex-col items-center mb-8'>
            <div className='w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 flex items-center justify-center shadow-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7a2 2 0 012-2h6a2 2 0 012 2v1a2 2 0 01-2 2h-2a2 2 0 00-2 2v1h4v4h-4v1a2 2 0 01-2 2H9a2 2 0 01-2-2v-1H5v-4h2v-1a2 2 0 00-2-2H3a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-white'>Create Owner Account</h1>
            <p className='text-white/60 mt-1'>Register for store management</p>
          </div>
          
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-white/80 mb-1'>
                Full Name
              </label>
              <input
                name='fullname'
                type='text'
                value={formData.fullname}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-white/30'
                placeholder='Enter your full name'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-white/80 mb-1'>
                Email Address
              </label>
              <input
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-white/30'
                placeholder='Enter your email'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-white/80 mb-1'>
                Phone Number
              </label>
              <input
                name='phone'
                type='tel'
                value={formData.phone}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-white/30'
                placeholder='Enter your phone number'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-white/80 mb-1'>
                Password
              </label>
              <input
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-white/30'
                placeholder='Create a password'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-white/80 mb-1'>
                Confirm Password
              </label>
              <input
                name='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-white/30'
                placeholder='Confirm your password'
              />
            </div>

            <div className='flex items-start'>
              <input
                name='agreeToTerms'
                type='checkbox'
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className='h-4 w-4 mt-1 text-amber-500 focus:ring-amber-400 border-white/10 rounded bg-white/5'
              />
              <label className='ml-2 block text-sm text-white/70'>
                I agree to the <Link to="/terms" className='text-amber-400 hover:text-amber-300'>Terms and Conditions</Link>
              </label>
            </div>

            <div className='pt-2'>
              <button
                type='submit'
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400'
              >
                Register Now
              </button>
            </div>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-white/70'>
              Already have an account?{' '}
              <Link to="/ownerLogin" className='font-medium text-amber-400 hover:text-amber-300'>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSignUp;