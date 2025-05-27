import React, { useState } from 'react';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  AttachMoney as AttachMoneyIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';

// Dummy data for orders
const initialOrders = [
  {
    id: 'ORD001',
    customerID: 'CUST001',
    customerName: 'John Doe',
    metalType: 'gold',
    itemName: 'Gold Ring',
    orderDescription: 'Wedding ring with diamond',
    weightExpected: '10',
    itemPurity: '22k',
    metalPrice: '5000',
    priceExpected: '50000',
    paidAmount: 25000,
    date: '2023-05-15',
    status: 'pending'
  },
  {
    id: 'ORD002',
    customerID: 'CUST002',
    customerName: 'Jane Smith',
    metalType: 'silver',
    itemName: 'Silver Bracelet',
    orderDescription: 'Custom engraved bracelet',
    weightExpected: '25',
    itemPurity: '925',
    metalPrice: '800',
    priceExpected: '20000',
    paidAmount: 20000,
    date: '2023-06-20',
    status: 'completed'
  },
  {
    id: 'ORD003',
    customerID: 'CUST003',
    customerName: 'Robert Johnson',
    metalType: 'platinum',
    itemName: 'Platinum Necklace',
    orderDescription: 'Design #1234 with pendant',
    weightExpected: '15',
    itemPurity: '950',
    metalPrice: '3000',
    priceExpected: '45000',
    paidAmount: 15000,
    date: '2023-07-10',
    status: 'in-progress'
  }
];

// Dummy customers for dropdown
const dummyCustomers = [
  { id: 'CUST001', name: 'John Doe' },
  { id: 'CUST002', name: 'Jane Smith' },
  { id: 'CUST003', name: 'Robert Johnson' },
  { id: 'CUST004', name: 'Alice Brown' },
  { id: 'CUST005', name: 'Michael Wilson' }
];

const OrderModal = ({ isOpen, onClose, onSubmit, order, isEdit }) => {
  const [formData, setFormData] = useState({
    id: order?.id || `ORD${Math.floor(1000 + Math.random() * 9000)}`,
    customerID: order?.customerID || '',
    customerName: order?.customerName || '',
    metalType: order?.metalType || 'gold',
    itemName: order?.itemName || '',
    orderDescription: order?.orderDescription || '',
    weightExpected: order?.weightExpected || '',
    itemPurity: order?.itemPurity || '22k',
    metalPrice: order?.metalPrice || '',
    priceExpected: order?.priceExpected || '',
    paidAmount: order?.paidAmount || 0,
    date: order?.date || new Date().toISOString().split('T')[0],
    status: order?.status || 'pending'
  });

  const [error, setError] = useState('');

  const metalTypes = ['gold', 'silver', 'platinum', 'diamond'];
  const purityOptions = {
    gold: ['24k', '22k', '18k', '14k'],
    silver: ['999', '925', '900'],
    platinum: ['950', '900'],
    diamond: ['D', 'E', 'F', 'G', 'H']
  };

  const statusOptions = ['pending', 'in-progress', 'completed', 'cancelled'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-set customer name when ID is selected
    if (name === 'customerID') {
      const customer = dummyCustomers.find(c => c.id === value);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: customer.name
        }));
      }
    }

    // Recalculate price if metalPrice or weight changes
    if ((name === 'metalPrice' || name === 'weightExpected') && formData.metalPrice && formData.weightExpected) {
      const calculatedPrice = parseFloat(formData.metalPrice) * parseFloat(formData.weightExpected);
      setFormData(prev => ({
        ...prev,
        priceExpected: calculatedPrice.toFixed(2)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customerID || !formData.itemName || !formData.weightExpected) {
      setError('Please fill all required fields');
      return;
    }

    onSubmit(formData);
    setError('');
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer <span className="text-red-500">*</span></label>
                <select
                  name="customerID"
                  value={formData.customerID}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Customer</option>
                  {dummyCustomers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name} ({customer.id})</option>
                  ))}
                </select>
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
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
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
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [metalFilter, setMetalFilter] = useState('all');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const handleAddOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
    setShowAddModal(false);
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setShowAddModal(false);
    setCurrentOrder(null);
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const handleEditOrder = (order) => {
    setCurrentOrder(order);
    setIsEdit(true);
    setShowAddModal(true);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-600 mt-1">{orders.length} orders total</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-300"
            >
              <FilterListIcon /> Filters
            </button>
            <button 
              onClick={() => {
                setCurrentOrder(null);
                setIsEdit(false);
                setShowAddModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
            >
              <AddIcon /> New Order
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Filter Options</h3>
            <button 
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ClearIcon fontSize="small" /> Reset
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
              <select
                value={metalFilter}
                onChange={(e) => setMetalFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Metals</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setCurrentOrder(null);
        }}
        onSubmit={isEdit ? handleUpdateOrder : handleAddOrder}
        order={currentOrder}
        isEdit={isEdit}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Item</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Metal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Weight</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <SearchIcon className="text-gray-400 text-4xl mb-2" />
                      <p className="text-gray-500 text-lg">No orders found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedOrders.map(order => (
                  <tr key={order.id} className="hover:bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerID}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.itemName}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{order.orderDescription}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="capitalize">{order.metalType}</span> ({order.itemPurity})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.weightExpected}g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">${order.priceExpected}</div>
                      <div className="text-xs">Paid: ${order.paidAmount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                          title="Delete"
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
    </div>
  );
};

export default Orders;