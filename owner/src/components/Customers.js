import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { addCustomer, getCustomers, deleteCustomer } from "../api/owners";

const CustomerModal = ({ isOpen, onClose, onSubmit, customer, isEdit }) => {
  const [formData, setFormData] = useState({
    id: customer?.id || "",
    name: customer?.name || "",
    password: customer?.password || "",
    image: customer?.image || "",
    address: customer?.address || "",
    contactNumber: customer?.contactNumber || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (files) => {
    if (!files.length) return;

    try {
      setIsUploading(true);
      setError("");
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", files[0]);
      cloudinaryFormData.append("upload_preset", "ml_default");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dthriaot4/image/upload",
        cloudinaryFormData
      );

      setFormData((prev) => ({
        ...prev,
        image: response.data.secure_url,
      }));
    } catch (err) {
      setError("Failed to upload image");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id || "",
        name: customer.name || "",
        password: customer.password || "",
        image: customer.image || "",
        address: customer.address || "",
        contactNumber: customer.contactNumber || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        password: "",
        image: "",
        address: "",
        contactNumber: "",
      });
    }
  }, [customer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Customer" : "Add New Customer"}
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
            {error && <div className="text-red-500 p-2 bg-red-50 rounded-md">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                required
                disabled={isEdit}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
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
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
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
              {isEdit ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await getCustomers();
        setCustomers(data.data || []);
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
    return customers.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortAndFilterCustomers = (filtered) => {
    return [...filtered]
      .filter((customer) => {
        if (membershipFilter === "all") return true;
        return membershipFilter === "premium"
          ? customer.purchases?.length > 5
          : customer.purchases?.length <= 5;
      })
      .sort((a, b) => {
        if (sortOption === "newest") {
          return new Date(b.date || 0) - new Date(a.date || 0);
        }
        return new Date(a.date || 0) - new Date(b.date || 0);
      });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
        setCustomers((prev) => [...prev, newCustomer]);
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
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer({ id: id });
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      } catch (error) {
        console.error("Failed to delete customer:", error);
        setError("Failed to delete customer. Please try again.");
      }
    }
  };

  const resetFilters = () => {
    setSortOption("newest");
    setMembershipFilter("all");
  };

  const filteredCustomers = filterCustomers();
  const sortedAndFilteredCustomers = sortAndFilterCustomers(filteredCustomers);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Header */}
      <header className="bg-gradient-to-b from-yellow-700 to-yellow-600  shadow-lg mb-4">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-amber-500/20 p-3 rounded-xl backdrop-blur-sm border border-amber-400/30">
                <PersonIcon className="text-white text-2xl" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white tracking-tight font-serif">
                  LuxeGold Customers
                </h1>
                <p className="text-amber-100/90 text-sm mt-1 font-light">
                  {customers.length} valued customers in your records
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-amber-600" />
                </div>
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10 pr-4 py-2.5 border border-amber-200 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 text-gray-700 placeholder-amber-600/60 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white/90 hover:bg-white text-amber-800 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-amber-200 shadow-sm hover:shadow-md transition-all"
                >
                  <FilterListIcon /> 
                  <span>Filters</span>
                </button>
                <button 
                  onClick={() => {
                    setShowAddModal(true);
                  }}
                  className="bg-yellow-600/20 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg transition-all"
                >
                  <AddIcon /> 
                  <span>New Customer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 -mt-6">
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg mb-6 border border-amber-100 overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <FilterListIcon className="mr-2 text-amber-600" />
                  Filter Customers
                </h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-amber-700 hover:text-amber-900 flex items-center gap-1 font-medium"
                >
                  <ClearIcon fontSize="small" /> Reset
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
                
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Membership</label>
                  <select
                    value={membershipFilter}
                    onChange={(e) => setMembershipFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                  >
                    <option value="all">All Customers</option>
                    <option value="premium">Premium</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredCustomers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-dashed border-amber-200">
              <SearchIcon className="text-gray-400 text-4xl mb-3" />
              <p className="text-gray-500 text-lg">No customers found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
              <button
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                onClick={() => setShowAddModal(true)}
              >
                <AddIcon className="mr-2" />
                Add New Customer
              </button>
            </div>
          ) : (
            sortedAndFilteredCustomers.map(customer => (
              <div key={customer.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Customer Image */}
                <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-6 border-b border-amber-100 h-48">
                  {customer.image ? (
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-200">
                      <PersonIcon className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      customer.purchases?.length > 5 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.purchases?.length > 5 ? 'Premium' : 'Regular'}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {customer.name}
                    </h3>
                    <span className="text-sm font-medium text-amber-600">
                      {customer.purchases?.length || 0} purchases
                    </span>
                  </div>

                  <div className="space-y-3 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium truncate">{customer.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p className="font-medium">{customer.contactNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Member Since</p>
                      <p className="font-medium">{formatDate(customer.date)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Last Purchase</p>
                      <p className="text-sm text-gray-600">
                        {customer.purchases?.length ? formatDate(customer.purchases[0].date) : 'Never'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/customer/${customer.id}`)}
                        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <VisibilityIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                        }}x
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setError("");
        }}
        onSubmit={handleAddCustomer}
        isEdit={false}
      />
    </div>
  );
};

export default Customers;