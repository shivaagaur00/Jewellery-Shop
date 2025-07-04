import React, { useEffect, useState } from 'react';
import { addLoan, updateLoan, deleteLoan, getLoans } from '../api/owners';
import { Link } from 'react-router-dom';
import {
  MonetizationOn as LoanIcon,
  AttachMoney as MoneyIcon,
  Scale as WeightIcon,
  Person as CustomerIcon,
  CalendarToday as DateIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as PaidIcon,
  WatchLater as PendingIcon,
  ArrowDropDown as ArrowIcon,
  Diamond as DiamondIcon,
  Spa as SilverIcon,
  Paid as AmountDueIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
const Loan = () => {
  const LOAN_STATUS = {
    ACTIVE: 'Active',
    PAID: 'Paid',
    DEFAULTED: 'Defaulted',
    PENDING: 'Pending'
  };

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [metalFilter, setMetalFilter] = useState('all');
  const [currentLoan, setCurrentLoan] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    customer: '',
    customerID: '',
    itemType: 'Gold',
    itemDescription: '',
    weight: '',
    purity: '22K',
    loanAmount: '',
    interestRate: 12,
    dateIssued: new Date().toISOString().split('T')[0],
    dueDate: '',
    holderName: '',
    status: LOAN_STATUS.PENDING,
    collateralImages: []
  });

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const data = await getLoans();
        setLoans(data.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load loans. Please try again.");
        console.error("Error fetching loans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const calculateAmountDue = (loan) => {
    if (!loan || loan.status === LOAN_STATUS.PAID) return 0;

    const loanAmount = parseFloat(loan.loanAmount) || 0;
    const interestRate = parseFloat(loan.interestRate) || 0;

    try {
      const issuedDate = new Date(loan.dateIssued);
      const today = new Date();
      let monthsElapsed = (today.getFullYear() - issuedDate.getFullYear()) * 12 +
                          (today.getMonth() - issuedDate.getMonth());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), issuedDate.getDate());
      
      if (isNaN(monthStart.getTime())) {
        monthStart.setDate(1);
      }

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysElapsed = Math.max(0, Math.floor((today - monthStart) / msPerDay));

      const monthlyInterest = (loanAmount * interestRate) / 100;
      const dailyInterest = monthlyInterest / 30;

      const totalInterest = (monthlyInterest * monthsElapsed) + (dailyInterest * daysElapsed);

      return Math.round(loanAmount + totalInterest);
    } catch (e) {
      console.error("Error calculating amount due:", e);
      return loanAmount;
    }
  };

  const calculateDueDate = (issueDate, months = 6) => {
    const date = new Date(issueDate);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case LOAN_STATUS.ACTIVE: return 'bg-amber-100 text-amber-800';
      case LOAN_STATUS.PAID: return 'bg-green-100 text-green-800';
      case LOAN_STATUS.DEFAULTED: return 'bg-red-100 text-red-800';
      case LOAN_STATUS.PENDING: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case LOAN_STATUS.ACTIVE: return <PendingIcon className="text-amber-600" />;
      case LOAN_STATUS.PAID: return <PaidIcon className="text-green-600" />;
      case LOAN_STATUS.DEFAULTED: return <DeleteIcon className="text-red-600" />;
      case LOAN_STATUS.PENDING: return <PendingIcon className="text-blue-600" />;
      default: return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append("upload_preset", "ml_default");
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dthriaot4/image/upload",
          cloudinaryFormData
        );
        
        uploadedImages.push(response.data.secure_url);
      }
      setFormData(prev => ({
        ...prev,
        collateralImages: [...prev.collateralImages, ...uploadedImages]
      }));
      
    } catch (err) {
      setError("Failed to upload images");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentLoan) {
        const loanAmountToPaid = calculateAmountDue(formData);
        const updatedLoan = await updateLoan({
          id: currentLoan._id, 
          updateData: formData,
          loanPaidedAmount: loanAmountToPaid
        });
      } else {
        const newLoan = await addLoan(formData);
        setLoans([...loans, newLoan.data.data]);
      }
      setShowAddModal(false);
    } catch (error) {
      setError(error.message || "Failed to process loan");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await deleteLoan({ loanId: id });
        setLoans(loans.filter(loan => loan._id !== id));
      } catch (error) {
        setError(error.message || "Failed to delete loan");
      }
    }
  };

  const resetFilters = () => {
    setSortOption('newest');
    setStatusFilter('all');
    setMetalFilter('all');
  };

  const filteredLoans = loans.filter(loan => {
    if (statusFilter !== 'all' && loan.status !== statusFilter) return false;
    if (metalFilter !== 'all' && loan.itemType !== metalFilter) return false;
    if (searchTerm && !(
      loan.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.itemDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan._id?.toString().includes(searchTerm)
    )) return false;
    return true;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.dateIssued) - new Date(a.dateIssued);
    } else {
      return new Date(a.dateIssued) - new Date(b.dateIssued);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
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
                <LoanIcon className="text-white text-2xl" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white tracking-tight font-serif">
                  LuxeGold Loans
                </h1>
                <p className="text-yellow-100/90 text-sm mt-1 font-light">
                  {loans.length} active loans in your portfolio
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
                  placeholder="Search loans..."
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
                    setCurrentLoan(null);
                    setFormData({
                      customer: '',
                      customerID: '',
                      itemType: 'Gold',
                      itemDescription: '',
                      weight: '',
                      purity: '22K',
                      loanAmount: '',
                      interestRate: 12,
                      dateIssued: new Date().toISOString().split('T')[0],
                      dueDate: calculateDueDate(new Date().toISOString().split('T')[0]),
                      holderName: '',
                      status: LOAN_STATUS.PENDING,
                      collateralImages: []
                    });
                    setShowAddModal(true);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg transition-all"
                >
                  <AddIcon /> 
                  <span>New Loan</span>
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
                  Filter Loans
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
                    {Object.values(LOAN_STATUS).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
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
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedLoans.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-dashed border-amber-200">
              <SearchIcon className="text-gray-400 text-4xl mb-3" />
              <p className="text-gray-500 text-lg">No loans found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
              <button
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                onClick={() => {
                  setCurrentLoan(null);
                  setShowAddModal(true);
                }}
              >
                <AddIcon className="mr-2" />
                Create New Loan
              </button>
            </div>
          ) : (
            sortedLoans.map(loan => (
              <div key={loan._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Loan Image */}
                <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-6 border-b border-amber-100 h-48">
                  {loan.collateralImages?.[0] ? (
                    <img
                      src={loan.collateralImages[0]}
                      alt={loan.itemDescription}
                      className="w-full h-full object-contain object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-yellow-200">
                      {loan.itemType === 'Gold' ? (
                        <DiamondIcon className="w-16 h-16" />
                      ) : (
                        <SilverIcon className="w-16 h-16" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(loan.status)}`}>
                      {loan.status}
                    </span>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {loan.itemDescription || 'Jewelry Loan'}
                    </h3>
                    <span className="text-sm font-medium text-yellow-600">
                      #{loan._id?.substring(loan._id.length - 6)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <CustomerIcon className="text-amber-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{loan.customer}</p>
                      <p className="text-xs text-gray-500">{loan.customerID}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Metal</p>
                      <p className="font-medium capitalize">
                        {loan.itemType} ({loan.purity})
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Weight</p>
                      <p className="font-medium">{loan.weight}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Loan Amount</p>
                      <p className="font-medium">₹{loan.loanAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount Due</p>
                      <p className="font-medium">
                        ₹{calculateAmountDue(loan)?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Issued Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(loan.dateIssued).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentLoan(loan);
                          setFormData({
                            ...loan,
                            dueDate: loan.dueDate || calculateDueDate(loan.dateIssued)
                          });
                          setShowAddModal(true);
                        }}
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(loan._id)}
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

      {/* Loan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentLoan ? 'Edit Loan Details' : 'Create New Loan'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {error && <div className="text-red-500 p-2 bg-red-50 rounded-md">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="customerID"
                      value={formData.customerID}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type <span className="text-red-500">*</span></label>
                    <select
                      name="itemType"
                      value={formData.itemType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purity <span className="text-red-500">*</span></label>
                    <input
                      name="purity"
                      value={formData.purity}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Description <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      required
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issued Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400"><DateIcon fontSize="small" /></span>
                      <input
                        type="date"
                        name="dateIssued"
                        value={formData.dateIssued}
                        onChange={(e) => {
                          handleInputChange(e);
                          setFormData(prev => ({
                            ...prev,
                            dueDate: calculateDueDate(e.target.value)
                          }));
                        }}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400"><DateIcon fontSize="small" /></span>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Holder Name</label>
                    <input
                      type="text"
                      name="holderName"
                      value={formData.holderName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {Object.values(LOAN_STATUS).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collateral Images</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.collateralImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Collateral ${index + 1}`} 
                            className="h-20 w-20 object-cover rounded border border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                    <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center">
                        <UploadIcon className="text-gray-500 mb-2" />
                        <p className="text-sm text-gray-600">
                          {isUploading ? 'Uploading...' : 'Click to upload images'}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        multiple 
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  disabled={isUploading}
                >
                  <SaveIcon fontSize="small" />
                  {currentLoan ? 'Update Loan' : 'Create Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loan;