import React, { useState, useEffect } from 'react';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,

  Search as SearchIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Save as SaveIcon,
  FilterList as FilterListIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  AttachMoney as AttachMoneyIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { addOrder, deleteOrder, editOrder, getOrder, getOrders } from '../api/owners';
import axios from 'axios';
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonIcon from '@mui/icons-material/Person';

const OrderModal = ({ isOpen, onClose, onSubmit, order, isEdit, customers }) => {
  const [formData, setFormData] = useState({
    customerID: order?.customerID || '',
    transactionMode:order?.transactionMode || 0,
    customerName: order?.customerName || '',
    metalType: order?.metalType || 'Gold',
    itemName: order?.itemName || '',
    orderDescription: order?.orderDescription || '',
    weightExpected: order?.weightExpected || '',
    itemPurity: order?.itemPurity || '18K',
    metalPrice: order?.metalPrice || '',
    priceExpected: order?.priceExpected || '',
    depositedAmount: order?.depositedAmount || 0,
    date: order?.date || new Date().toISOString().split('T')[0],
    expectedDeliverDate: order?.expectedDeliverDate || '',
    status: order?.status || 'pending',
    sp: order?.sp || 0,
    cp: order?.cp || 0,
    weight: order?.weight || 0,
    deliverDate: order?.deliverDate || '',
    image:order?.image || "",
  });
useEffect(() => {
  if (order) {
    setFormData({
      customerID: order.customerID || '',
      transactionMode: order.transactionMode || 0,
      customerName: order.customerName || '',
      metalType: order.metalType || 'Gold',
      itemName: order.itemName || '',
      orderDescription: order.orderDescription || '',
      weightExpected: order.weightExpected || '',
      itemPurity: order.itemPurity || '18K',
      metalPrice: order.metalPrice || '',
      priceExpected: order.priceExpected || '',
      depositedAmount: order.depositedAmount || 0,
      date: order.date || new Date().toISOString().split('T')[0],
      expectedDeliverDate: order.expectedDeliverDate || '',
      status: order.status || 'pending',
      sp: order.sp || 0,
      cp: order.cp || 0,
      weight: order.weight || 0,
      deliverDate: order.deliverDate || '',
      image: order.image || ""
    });
  } else {
    setFormData({
      customerID: '',
      transactionMode: 0,
      customerName: '',
      metalType: 'Gold',
      itemName: '',
      orderDescription: '',
      weightExpected: '',
      itemPurity: '18K',
      metalPrice: '',
      priceExpected: '',
      depositedAmount: 0,
      date: new Date().toISOString().split('T')[0],
      expectedDeliverDate: '',
      status: 'pending',
      sp: 0,
      cp: 0,
      weight: 0,
      deliverDate: '',
      image: ""
    });
  }
}, [order, isOpen]); 
  const [error, setError] = useState('');

  const metalTypes = ['Gold', 'Silver', 'Platinum', 'Palladium', 'Titanium', 'Stainless Steel'];
  const purityOptions = {
    Gold: ['24K', '22K', '18K', '14K'],
    Silver: ['999', '925', '900'],
    Platinum: ['950', '900'],
    Palladium: ['950', '900'],
    'Stainless Steel': ['304', '316'],
    Titanium: ['Grade 1', 'Grade 2', 'Grade 5']
  };

  const statusOptions = ['pending', 'in-progress', 'completed', 'cancelled'];

  useEffect(() => {
    if (formData.metalPrice && formData.weightExpected) {
      const calculatedPrice = parseFloat(formData.metalPrice) * parseFloat(formData.weightExpected);
      setFormData(prev => ({
        ...prev,
        priceExpected: calculatedPrice.toFixed(2)
      }));
    }
  }, [formData.metalPrice, formData.weightExpected]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'customerID') {
      const customer = customers.find(c => c.id === value);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: customer.name
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerID || !formData.itemName || !formData.weightExpected) {
      setError('Please fill all required fields');
      return;
    }
    try {
      await onSubmit(formData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to process order');
    }
  };
  const[isUploading,setIsUploading]=useState(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? 'Edit Order' : 'Add New Order'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && <div className="text-red-500 p-2 bg-red-50 rounded-md">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer <span className="text-red-500">*</span></label>
                <input
                  name="customerID"
                  value={formData.customerID}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder='Enter CustomerID'
                >
                  </input>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type <span className="text-red-500">*</span></label>
                <select
                  name="metalType"
                  value={formData.metalType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {metalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purity <span className="text-red-500">*</span></label>
                <select
                  name="itemPurity"
                  value={formData.itemPurity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {purityOptions[formData.metalType]?.map(purity => (
                    <option key={purity} value={purity}>{purity}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Description</label>
                <input
                  type="text"
                  name="orderDescription"
                  value={formData.orderDescription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Weight (g) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="weightExpected"
                  value={formData.weightExpected}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metal Price (per gram) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="metalPrice"
                  value={formData.metalPrice}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price</label>
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <AttachMoneyIcon className="text-gray-400 mr-2" />
                  <span>{formData.priceExpected || '0.00'}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deposited Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="depositedAmount"
                    value={formData.depositedAmount}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400"><DateRangeIcon fontSize="small" /></span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400"><DateRangeIcon fontSize="small" /></span>
                  <input
                    type="date"
                    name="expectedDeliverDate"
                    value={formData.expectedDeliverDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (SP)</label>
                <input
                  type="number"
                  name="sp"
                  value={formData.sp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (CP)</label>
                <input
                  type="number"
                  name="cp"
                  value={formData.cp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Weight (g)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">transactionMode</label>
                <input
                  type="text"
                  name="transactionMode"
                  value={formData.transactionMode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400"><DateRangeIcon fontSize="small" /></span>
                  <input
                    type="date"
                    name="deliverDate"
                    value={formData.deliverDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <SaveIcon fontSize="small" />
              {isEdit ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [metalFilter, setMetalFilter] = useState('all');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      const data = response.data?.data || [];
      setOrders(data);
      const uniqueCustomers = [];
      const customerMap = new Map();

      data.forEach(order => {
        if (order.customerID && !customerMap.has(order.customerID)) {
          customerMap.set(order.customerID, true);
          uniqueCustomers.push({
            id: order.customerID,
            name: order.customerName || `Customer ${order.customerID}`
          });
        }
      });

      setCustomers(uniqueCustomers);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
const filteredOrders = orders.filter(order => {
  if (!order) return false;
  const idStr = order._id?.toString()?.toLowerCase() || '';
  const nameStr = order.customerName?.toLowerCase() || '';
  const itemStr = order.itemName?.toLowerCase() || '';

  const matchesSearch =
    idStr.includes(searchTerm.toLowerCase()) ||
    nameStr.includes(searchTerm.toLowerCase()) ||
    itemStr.includes(searchTerm.toLowerCase());

  const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
  const matchesMetal = metalFilter === 'all' || order.metalType === metalFilter;

  return matchesSearch && matchesStatus && matchesMetal;
});


  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  const handleAddOrder = async (newOrder) => {
    try {
      const response = await addOrder({ data: newOrder });
      setOrders([...orders, response.data.data]);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message || 'Failed to add order');
    }
  };

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const response = await editOrder({ 
        data: updatedOrder, 
        orderId: currentOrder._id, 
      });
      setOrders(orders.map(order => 
        order._id.toString() === currentOrder._id.toString() ? {...updatedOrder,_id:currentOrder._id} : order
      ));
      setShowAddModal(false);
      setCurrentOrder(null);
    } catch (err) {
      setError(err.message || 'Failed to update order');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder({ orderId: id });
        setOrders(orders.filter(order => order._id.toString() !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete order');
      }
    }
  };

  const resetFilters = () => {
    setSortOption('newest');
    setStatusFilter('all');
    setMetalFilter('all');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
  <header className="bg-gradient-to-b from-yellow-700 to-yellow-600 shadow-lg mb-4">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="bg-yellow-500/20 p-3 rounded-xl backdrop-blur-sm border border-yellow-400/30">
            <InventoryIcon className="text-white text-2xl" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-white tracking-tight font-serif">
              LuxeGold Orders
            </h1>
            <p className="text-yellow-100/90 text-sm mt-1 font-light">
              {orders.length} precious orders in your collection
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-yellow-600" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2.5 border border-yellow-200 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-300 text-gray-700 placeholder-yellow-600/60 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/90 hover:bg-white text-yellow-800 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-yellow-200 shadow-sm hover:shadow-md transition-all"
            >
              <FilterListIcon /> 
              <span>Filters</span>
            </button>
            <button 
              onClick={() => {
                setCurrentOrder(null);
                setIsEdit(false);
                setShowAddModal(true);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg transition-all"
            >
              <AddIcon /> 
              <span>New Order</span>
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
      <div className="bg-white rounded-xl shadow-lg mb-6 border border-yellow-100 overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <FilterListIcon className="mr-2 text-yellow-600" />
              Filter Orders
            </h3>
            <button 
              onClick={resetFilters}
              className="text-sm text-yellow-700 hover:text-yellow-900 flex items-center gap-1 font-medium"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Metal Type</label>
              <select
                value={metalFilter}
                onChange={(e) => setMetalFilter(e.target.value)}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
              >
                <option value="all">All Metals</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Platinum">Platinum</option>
                <option value="Palladium">Palladium</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Orders Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sortedOrders.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-dashed border-amber-200">
          <SearchIcon className="text-gray-400 text-4xl mb-3" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          <button
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
            onClick={() => {
              setCurrentOrder(null);
              setIsEdit(false);
              setShowAddModal(true);
            }}
          >
            <AddIcon className="mr-2" />
            Create New Order
          </button>
        </div>
      ) : (
        sortedOrders.map(order => (
          <div key={order._id.toString()} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Order Image */}
            <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-6 border-b border-amber-100 h-48">
              {order.image ? (
                <img
                  src={order.image}
                  alt={order.itemName}
                  className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-yellow-200">
                  <DiamondIcon className="w-16 h-16" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {order.itemName}
                </h3>
                <span className="text-sm font-medium text-yellow-600">
                  #{order._id.substring(order._id.length - 6)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <PersonIcon className="text-amber-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.customerID}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Metal</p>
                  <p className="font-medium capitalize">{order.metalType} ({order.itemPurity})</p>
                </div>
                <div>
                  <p className="text-gray-500">Weight</p>
                  <p className="font-medium">{order.weightExpected}g</p>
                </div>
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">₹{order.priceExpected}</p>
                </div>
                <div>
                  <p className="text-gray-500">Paid</p>
                  <p className="font-medium">₹{order.depositedAmount}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Order Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEdit(true);
                      setCurrentOrder(order);
                      setShowAddModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id.toString())}
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

  {/* Order Modal */}
  <OrderModal
    isOpen={showAddModal}
    onClose={() => {
      setShowAddModal(false);
      setCurrentOrder(null);
    }}
    onSubmit={isEdit ? handleUpdateOrder : handleAddOrder}
    order={currentOrder}
    isEdit={isEdit}
    customers={customers}
  />
</div>
  );
};

export default Orders;