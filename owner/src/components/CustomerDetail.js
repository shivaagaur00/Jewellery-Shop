import React, { useEffect, useState } from 'react';
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
  CloudUpload as CloudUploadIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import axios from 'axios';
import { getSpecificCustomer } from '../api/owners';

const CustomerModal = ({ isOpen, onClose, onSubmit, customer, isEdit }) => {
  const [formData, setFormData] = useState({
    id: customer?.id || '',
    name: customer?.name || '',
    email: customer?.id || '', // Using id as email based on your data structure
    password: customer?.password || '',
    image: customer?.image || '',
    address: customer?.address || '',
    contactNumber: customer?.contactNumber || ''
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
            {isEdit ? 'Edit Customer' : 'Add Customer'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (ID)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
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
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchCustomer = async (customerId) => {
      try {
        const { data } = await getSpecificCustomer({ customerId: customerId });
        setCustomer(data.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer(customerId);
  }, [customerId]);

  const handleUpdateCustomer = (updatedData) => {
    setCustomer(prev => ({ 
      ...prev, 
      ...updatedData,
      id: updatedData.email // Ensure id is updated if email changes
    }));
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading customer data...</h2>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer not found</h2>
          <button 
            onClick={() => navigate('/ownerLayout')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <ArrowBackIcon /> Back to Customers
          </button>
        </div>
      </div>
    );
  }

  // Format the join date
  const joinDate = new Date(customer.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
          onClick={() => navigate('/ownerLayout')}
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
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <EmailIcon className="mr-2 text-amber-600" />
                <span>{customer.id}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <PhoneIcon className="mr-2 text-amber-600" />
                <span>{customer.contactNumber || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarTodayIcon className="mr-2 text-amber-600" />
                <span>Member since {joinDate}</span>
              </div>
              {customer.address && (
                <div className="flex items-start text-gray-600 col-span-1 md:col-span-2 lg:col-span-3">
                  <LocationIcon className="mr-2 text-amber-600 mt-1" />
                  <span>{customer.address}</span>
                </div>
              )}
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
            {customer.purchases && customer.purchases.length > 0 ? (
              customer.purchases.map(purchase => (
                <div key={purchase.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Order #{purchase.id}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {purchase.items && purchase.items.join(', ')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      purchase.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      purchase.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {purchase.status || 'pending'}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{purchase.date}</span>
                    <span className="font-medium">${purchase.amount ? purchase.amount.toLocaleString() : '0'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No purchases found</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <HistoryIcon className="mr-2 text-amber-600" /> Account Activity
            </h2>
          </div>
          <div className="p-6">
            {customer.transactions && customer.transactions.length > 0 ? (
              <div className="space-y-4">
                {customer.transactions.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleString()}</p>
                    </div>
                    <span className={`font-medium ${
                      transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No recent activity</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <p className="text-sm text-gray-500 mt-1">Last changed: {joinDate}</p>
              </div>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                <LockResetIcon fontSize="small" /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <PersonIcon className="mr-2 text-amber-600" /> Additional Information
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Loans</h3>
              {customer.loan && customer.loan.length > 0 ? (
                <ul className="space-y-2">
                  {customer.loan.map((loan, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">${loan.amount}</span> - {loan.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No active loans</p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Exchanges</h3>
              {customer.exchange && customer.exchange.length > 0 ? (
                <ul className="space-y-2">
                  {customer.exchange.map((exchange, index) => (
                    <li key={index} className="text-sm">
                      {exchange.item} - {exchange.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No exchange requests</p>
              )}
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-900 mb-2">Offers</h3>
              {customer.offers && customer.offers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {customer.offers.map((offer, index) => (
                    <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                      {offer}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No offers available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;