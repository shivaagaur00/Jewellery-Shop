import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { addCustomer, getCustomers, deleteCustomer } from '../api/owners'; // Added deleteCustomer import

const CustomerModal = ({ isOpen, onClose, onSubmit, customer, isEdit }) => {
  const [formData, setFormData] = useState({
    id: customer?.id || '',
    name: customer?.name || '',
    password: customer?.password || '',
    image: customer?.image || '',
    address: customer?.address || '',
    contactNumber: customer?.contactNumber || '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (files) => {
    if (!files.length) return;
    
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

  useEffect(() => {
    // Reset form when customer prop changes
    if (customer) {
      setFormData({
        id: customer.id || '',
        name: customer.name || '',
        password: customer.password || '',
        image: customer.image || '',
        address: customer.address || '',
        contactNumber: customer.contactNumber || '',
      });
    } else {
      setFormData({
        id: '',
        name: '',
        password: '',
        image: '',
        address: '',
        contactNumber: '',
      });
    }
  }, [customer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email ID*</label>
              <input
                id="email"
                type="email"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                required
                disabled={isEdit}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                id="contact"
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              {formData.image && (
                <div className="mb-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-full border-2 border-amber-200"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <label htmlFor="image-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                  <CloudUploadIcon fontSize="small" />
                  Upload Image
                  <input
                    id="image-upload"
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
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center gap-2 transition-colors duration-200"
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

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await getCustomers();
        setCustomers(data.data || []);
        console.log(customers);
        console.log(data.data)
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        setError("Failed to fetch customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filterCustomers = () => {
    return customers.filter(customer =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortAndFilterCustomers = (filtered) => {
    return [...filtered]
      .filter(customer => {
        if (membershipFilter === 'all') return true;
        return membershipFilter === 'premium' 
          ? customer.purchases?.length > 5
          : customer.purchases?.length <= 5;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') {
          return new Date(b.date || 0) - new Date(a.date || 0);
        }
        return new Date(a.date || 0) - new Date(b.date || 0);
      });
  };
const formatDate=(isoString)=>{
  const date = new Date(isoString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}


  const handleAddCustomer = async (formData) => {
    try {
      const newCustomer = {
        ...formData,
        joinDate: new Date().toISOString(),
        purchases: [],
        preferences: [],
        history: [],
      };

      const res = await addCustomer({ customerData: newCustomer });
      if (res.status === 201) {
        setCustomers(prev => [...prev, newCustomer]);
        setShowAddModal(false);
      } else {
        setError(res.message || "Failed to add customer");
      }
    } catch (error) {
      console.error("Failed to add customer:", error);
      setError("Failed to add customer. Please try again.");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer({id:id}); 
        setCustomers(prev => prev.filter(customer => customer.id !== id));
      } catch (error) {
        console.error("Failed to delete customer:", error);
        setError("Failed to delete customer. Please try again.");
      }
    }
  };

  const resetFilters = () => {
    setSortOption('newest');
    setMembershipFilter('all');
  };

  const filteredCustomers = filterCustomers();
  const sortedAndFilteredCustomers = sortAndFilterCustomers(filteredCustomers);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Jewelry Shop Customers</h1>
          <p className="text-gray-600 mt-1">{customers.length} customers registered</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search customers"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-300 transition-colors duration-200"
              aria-label="Toggle filters"
            >
              <FilterListIcon /> Filters
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors duration-200"
              aria-label="Add customer"
            >
              <AddIcon /> Add Customer
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Filter Options</h3>
            <button 
              onClick={resetFilters}
              className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1"
              aria-label="Reset filters"
            >
              <ClearIcon fontSize="small" /> Reset
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                id="sort-by"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div>
              <label htmlFor="membership" className="block text-sm font-medium text-gray-700 mb-1">Membership</label>
              <select
                id="membership"
                value={membershipFilter}
                onChange={(e) => setMembershipFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Customers</option>
                <option value="premium">Premium</option>
                <option value="regular">Regular</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <CustomerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setError("");
        }}
        onSubmit={handleAddCustomer}
        isEdit={false}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amber-600">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Email ID</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Member Since</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <SearchIcon className="text-gray-400 text-4xl mb-2" />
                        <p className="text-gray-500 text-lg">No customers found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedAndFilteredCustomers.map(customer => (
                    <tr key={customer.id} className="hover:bg-amber-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full object-cover border-2 border-amber-100" 
                              src={customer.image || 'https://via.placeholder.com/40'} 
                              alt={customer.name} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.purchases?.length || 0} purchases</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link 
                          to={`/customer/${customer.id}`} 
                          className="text-amber-600 hover:text-amber-800 hover:underline transition-colors duration-200"
                        >
                          {customer.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.contactNumber || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/customer/${customer._id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors duration-200"
                            title="View Details"
                            aria-label={`View details for ${customer.name}`}
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors duration-200"
                            title="Delete"
                            aria-label={`Delete customer ${customer.name}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;