import React, { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  LocalAtm as CashIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { addTransactions, deleteTransaction, editTransaction, getTransactions, getCustomers } from '../api/owners';

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction, isEdit, customers }) => {
  const [formData, setFormData] = useState({
    transactionMode: transaction?.transactionMode || 'credit-card',
    transactionAmount: transaction?.transactionAmount || '',
    customerID: transaction?.customerID || '',
    customerName: transaction?.customerName || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    status: transaction?.status || 'pending',
    description: transaction?.description || '',
    hasCustomerID: transaction?.customerID ? true : false
  });

  const [error, setError] = useState('');

  const paymentMethods = [
    { value: 'credit-card', label: 'Credit Card', icon: <CreditCardIcon fontSize="small" /> },
    { value: 'bank-transfer', label: 'Bank Transfer', icon: <PaymentIcon fontSize="small" /> },
    { value: 'cash', label: 'Cash', icon: <CashIcon fontSize="small" /> },
    { value: 'upi', label: 'UPI Payment', icon: <PaymentIcon fontSize="small" /> }
  ];

  const statusOptions = ['pending', 'completed', 'failed', 'refunded'];

  useEffect(() => {
    if (transaction) {
      setFormData({
        transactionMode: transaction.transactionMode || 'credit-card',
        transactionAmount: transaction.transactionAmount || '',
        customerID: transaction.customerID || '',
        customerName: transaction.customerName || '',
        date: transaction.date || new Date().toISOString().split('T')[0],
        status: transaction.status || 'pending',
        description: transaction.description || '',
        hasCustomerID: transaction.customerID ? true : false
      });
    } else {
      setFormData({
        transactionMode: 'credit-card',
        transactionAmount: '',
        customerID: '',
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        description: '',
        hasCustomerID: false
      });
    }
  }, [transaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCustomerToggle = (hasID) => {
    setFormData({
      ...formData,
      hasCustomerID: hasID,
      customerID: hasID ? '' : null,
      customerName: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.transactionAmount || !formData.customerName) {
      setError('Please fill all required fields');
      return;
    }

    // Prepare the data to submit
    const submitData = {
      ...formData,
      customerID: formData.hasCustomerID ? formData.customerID : null
    };

    onSubmit(submitData);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && <div className="text-red-500 p-2 bg-red-50 rounded-md">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Identification</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasCustomerID"
                      checked={!formData.hasCustomerID}
                      onChange={() => handleCustomerToggle(false)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-gray-700">New Customer (No ID)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasCustomerID"
                      checked={formData.hasCustomerID}
                      onChange={() => handleCustomerToggle(true)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-gray-700">Existing Customer (With ID)</span>
                  </label>
                </div>
                
                {formData.hasCustomerID ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer <span className="text-red-500">*</span></label>
                    <select
                      name="customerID"
                      value={formData.customerID}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer._id} value={customer._id}>
                          {customer.name} ({customer.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {paymentMethods.map(method => (
                    <label 
                      key={method.value}
                      className={`flex items-center p-2 border rounded-md cursor-pointer ${
                        formData.transactionMode === method.value 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="transactionMode"
                        value={method.value}
                        checked={formData.transactionMode === method.value}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600">{method.icon}</span>
                        <span>{method.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">₹</span>
                  <input
                    type="number"
                    name="transactionAmount"
                    value={formData.transactionAmount}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400"><CalendarIcon fontSize="small" /></span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
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
            >
              <SaveIcon fontSize="small" />
              {isEdit ? 'Update Transaction' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, customersRes] = await Promise.all([
          getTransactions(),
          getCustomers()
        ]);
        
        setTransactions(transactionsRes.data.data || []);
        setCustomers(customersRes.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [transactions]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.customerID && transaction.customerID.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || transaction.transactionMode === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  const handleAddTransaction = async (newTransaction) => {
    try {
      const res = await addTransactions(newTransaction);
      // setTransactions([...transactions, res.data.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction) => {
    try {
      const res = await editTransaction({
        id: currentTransaction._id,
        ...updatedTransaction
      });
      // setTransactions(transactions.map(txn => 
      //   txn._id === res.data.data._id ? res.data.data : txn
      // ));
      setShowAddModal(false);
      setCurrentTransaction(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        console.log(id);
        await deleteTransaction({id:id});
        setTransactions(transactions.filter(txn => txn._id !== id));
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const resetFilters = () => {
    setSortOption('newest');
    setStatusFilter('all');
    setMethodFilter('all');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'credit-card': return <CreditCardIcon fontSize="small" className="text-amber-600" />;
      case 'bank-transfer': return <PaymentIcon fontSize="small" className="text-amber-600" />;
      case 'cash': return <CashIcon fontSize="small" className="text-amber-600" />;
      case 'upi': return <PaymentIcon fontSize="small" className="text-amber-600" />;
      default: return <PaymentIcon fontSize="small" className="text-amber-600" />;
    }
  };

  const getMethodLabel = (method) => {
    switch(method) {
      case 'credit-card': return 'Credit Card';
      case 'bank-transfer': return 'Bank Transfer';
      case 'cash': return 'Cash';
      case 'upi': return 'UPI';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transaction Records</h1>
          <p className="text-gray-600 mt-1">
            Total: {transactions.length} transactions | ₹{
              transactions.reduce((sum, txn) => sum + parseFloat(txn.transactionAmount || 0), 0).toLocaleString('en-IN')
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                setCurrentTransaction(null);
                setIsEdit(false);
                setShowAddModal(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
            >
              <AddIcon /> New Transaction
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-amber-50 p-4 rounded-lg shadow-md mb-6 border border-amber-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Filter Options</h3>
            <button 
              onClick={resetFilters}
              className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Methods</option>
                <option value="credit-card">Credit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setCurrentTransaction(null);
        }}
        onSubmit={isEdit ? handleUpdateTransaction : handleAddTransaction}
        transaction={currentTransaction}
        isEdit={isEdit}
        customers={customers}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-200">
            <thead className="bg-amber-600">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Method</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-100">
              {sortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <SearchIcon className="text-amber-400 text-4xl mb-2" />
                      <p className="text-gray-500 text-lg">No transactions found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedTransactions.map(transaction => (
                  <tr key={transaction._id} className="hover:bg-amber-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.customerName}</div>
                      {transaction.customerID && (
                        <div className="text-xs text-gray-500">{transaction.customerID}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{parseFloat(transaction.transactionAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(transaction.transactionMode)}
                        <span className="text-sm text-gray-700">
                          {getMethodLabel(transaction.transactionMode)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentTransaction(transaction);
                            setIsEdit(true);
                            setShowAddModal(true);
                          }}
                          className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-100"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction._id)}
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

export default Transactions;