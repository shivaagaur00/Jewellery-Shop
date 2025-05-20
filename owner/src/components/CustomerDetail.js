import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LockReset as LockResetIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import axios from 'axios';

const CustomerModal = ({ isOpen, onClose, onSubmit, customer, isEdit }) => {
  const [formData, setFormData] = useState({
    id: customer?.id || '',
    name: customer?.name || '',
    email: customer?.email || '',
    password: customer?.password || '',
    image: customer?.image || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = async (files) => {
    try {
      setIsUploading(true);
      setError('');
      
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", files[0]);
      cloudinaryFormData.append("upload_preset", "ml_default");
      
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dthriaot4/image/upload",
        cloudinaryFormData
      );
      
      setFormData(prev => ({
        ...prev,
        image: response.data.secure_url
      }));
      
    } catch (err) {
      setError("Failed to upload image");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Customer
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              {formData.image && (
                <div className="mb-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-full border border-gray-200"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2">
                  <CloudUploadIcon fontSize="small" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    disabled={isUploading}
                  />
                </label>
                {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
              </div>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center gap-2"
              disabled={isUploading}
            >
              <SaveIcon fontSize="small" />
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerDetail = ({ customers, setCustomers }) => {
  const { customerId } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const customer = customers.find(c => c.id === customerId);

  const handleUpdateCustomer = (updatedData) => {
    const updatedCustomers = customers.map(c => 
      c.id === customerId ? { ...c, ...updatedData } : c
    );
    setCustomers(updatedCustomers);
    setShowEditModal(false);
  };

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer not found</h2>
          <button 
            onClick={() => navigate('/customers')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <ArrowBackIcon /> Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CustomerModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateCustomer}
        customer={customer}
        isEdit={true}
      />

      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/customers')}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ArrowBackIcon /> Back to Customers
        </button>
        <button 
          onClick={() => setShowEditModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <EditIcon /> Edit Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-shrink-0">
            <img 
              className="h-24 w-24 rounded-full border-2 border-amber-200" 
              src={customer.image} 
              alt={customer.name} 
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <PersonIcon className="mr-2 text-amber-600" />
                <span>{customer.id}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <EmailIcon className="mr-2 text-amber-600" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarTodayIcon className="mr-2 text-amber-600" />
                <span>Member since {customer.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <ReceiptIcon className="mr-2 text-amber-600" /> Purchase History
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {customer.purchases.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No purchases found</div>
            ) : (
              customer.purchases.map(purchase => (
                <div key={purchase.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Order #{purchase.id}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {purchase.items.join(', ')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      purchase.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      purchase.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {purchase.status}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{purchase.date}</span>
                    <span className="font-medium">${purchase.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <HistoryIcon className="mr-2 text-amber-600" /> Account History
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {customer.history.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No history found</div>
            ) : (
              customer.history.map((item, index) => (
                <div key={index} className="p-6">
                  <div className="flex justify-between">
                    <p className="text-gray-800">{item.action}</p>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <SecurityIcon className="mr-2 text-amber-600" /> Account Security
            </h2>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-500 mt-1">Last changed: {customer.joinDate}</p>
              </div>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                <LockResetIcon fontSize="small" /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <PersonIcon className="mr-2 text-amber-600" /> Preferences
            </h2>
          </div>
          <div className="p-6">
            {customer.preferences.length === 0 ? (
              <p className="text-gray-500">No preferences recorded</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {customer.preferences.map((pref, index) => (
                  <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {pref}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;