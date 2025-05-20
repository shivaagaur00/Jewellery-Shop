import React, { useEffect, useState } from 'react';
import { addLoan, updateLoan, deleteLoan, getLoans } from '../api/owners';
import {
  MonetizationOn as LoanIcon,
  AttachMoney as MoneyIcon,
  Scale as WeightIcon,
  LocalOffer as ItemIcon,
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
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import axios from 'axios';
const Loan = () => {
  const LOAN_STATUS = {
    ACTIVE: 'Active',
    PAID: 'Paid',
    DEFAULTED: 'Defaulted',
    PENDING: 'Pending'
  };
  const [loans, setLoans] = useState([]);
  const [loading,setLoading]=useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customer: '',
    itemType: 'Gold',
    itemDescription: '',
    weight: '',
    purity: '22K',
    loanAmount: '',
    interestRate: 12,
    dateIssued: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: LOAN_STATUS.PENDING,
    collateralImages: []
  });
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const data = await getLoans();
        console.log(data.data.data);
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

    // Calculate full months elapsed
    let monthsElapsed = (today.getFullYear() - issuedDate.getFullYear()) * 12 +
                        (today.getMonth() - issuedDate.getMonth());

    // Get start of current month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), issuedDate.getDate());
    
    // Handle case where the issue date day is greater than today's day (e.g., 31st issued, today is 19th)
    if (isNaN(monthStart.getTime()) || monthStart > today) {
      // fallback: use first day of month
      monthStart.setDate(1);
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysElapsed = Math.max(0, Math.floor((today - monthStart) / msPerDay));

    const monthlyInterest = (loanAmount * interestRate) / 100;
    const dailyInterest = monthlyInterest / 30; // approx daily interest

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
    const baseStyle = "flex items-center gap-1 font-semibold";
    switch(status) {
      case LOAN_STATUS.ACTIVE: return `${baseStyle} text-amber-600`;
      case LOAN_STATUS.PAID: return `${baseStyle} text-emerald-600`;
      case LOAN_STATUS.DEFAULTED: return `${baseStyle} text-red-600`;
      case LOAN_STATUS.PENDING: return `${baseStyle} text-blue-600`;
      default: return baseStyle;
    }
  };
  const getStatusIcon = (status) => {
    switch(status) {
      case LOAN_STATUS.ACTIVE: return <PendingIcon className="text-amber-600" />;
      case LOAN_STATUS.PAID: return <PaidIcon className="text-emerald-600" />;
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
        const updatedLoan = await updateLoan({id:currentLoan._id,updateData:formData});
        setLoans(loans.map(loan => 
          loan._id === updatedLoan._id ? updatedLoan : loan
        ));
      } else {
        console.log(formData);
        const newLoan = await addLoan(formData);
          
      }
      setShowForm(false);
    } catch (error) {
      // setError(error.message);
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await deleteLoan({loanId:id});
        setLoans(loans.filter(loan => loan.id !== id));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Filter loans based on search and status
  const filteredLoans = loans.filter(loan => {
    if (statusFilter !== 'ALL' && loan.status !== statusFilter) return false;
    if (searchTerm && !(
      loan.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan._id.toString().includes(searchTerm)
    )) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6 font-sans">
      {/* Header and controls */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 flex items-center">
            <LoanIcon className="mr-2 text-amber-600" />
            Jewelry Loan Management
          </h1>
          <button 
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
            onClick={() => {
              setCurrentLoan(null);
              setFormData({
                customer: '',
                itemType: 'Gold',
                itemDescription: '',
                weight: '',
                purity: '22K',
                loanAmount: '',
                interestRate: 12,
                dateIssued: new Date().toISOString().split('T')[0],
                dueDate: calculateDueDate(new Date().toISOString().split('T')[0]),
                status: LOAN_STATUS.PENDING,
                collateralImages: []
              });
              setShowForm(true);
            }}
          >
            <AddIcon /> New Loan
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-700" />
            <input
              type="text"
              placeholder="Search loans by customer, item, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <button 
              className="flex items-center justify-between gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-lg shadow transition-colors min-w-[150px]"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {statusFilter === 'ALL' ? 'All Status' : statusFilter}
              <ArrowIcon />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-full bg-white rounded-lg shadow-lg z-10 border border-amber-100">
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 transition-colors"
                  onClick={() => {
                    setStatusFilter('ALL');
                    setShowDropdown(false);
                  }}
                >
                  All Status
                </button>
                {Object.values(LOAN_STATUS).map(status => (
                  <button
                    key={status}
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 transition-colors"
                    onClick={() => {
                      setStatusFilter(status);
                      setShowDropdown(false);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-600 text-white">
              <tr>
                <th className="p-3 text-left">Loan ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Collateral</th>
                <th className="p-3 text-left">Weight</th>
                <th className="p-3 text-left">Loan Amount</th>
                <th className="p-3 text-left">Amount Due</th>
                <th className="p-3 text-left">Issued Date</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Holder Name</th>
                
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map(loan => (
                <tr key={loan._id} className="border-b border-amber-50 hover:bg-amber-50 transition-colors text-[14px]">
                  <td className="p-3 text-[9px]">#{loan._id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <CustomerIcon className="text-amber-700" />
                      {loan.customer}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {loan.itemType === 'Gold' ? 
                        <DiamondIcon className="text-amber-500" /> : 
                        <SilverIcon className="text-gray-400" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        loan.itemType === 'Gold' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {loan.itemType}
                      </span>
                      {loan.itemDescription}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <WeightIcon className="text-amber-700" />
                      {loan.weight}g ({loan.purity})
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <MoneyIcon className="text-amber-700" />
                      ₹{loan.loanAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className={`flex items-center gap-2 ${
                      loan.status === LOAN_STATUS.PAID ? 'text-gray-500' : 'text-amber-800 font-medium'
                    }`}>
                      <AmountDueIcon className={loan.status === LOAN_STATUS.PAID ? 'text-gray-500' : 'text-amber-600'} />
                      ₹{calculateAmountDue(loan).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <DateIcon className="text-amber-700" />
                      {new Date(loan.dateIssued).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <DateIcon className="text-amber-700" />
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className={getStatusStyle(loan.status)}>
                      {getStatusIcon(loan.status)}
                      {loan.status}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        className="text-amber-700 hover:text-amber-900 transition-colors"
                        onClick={() => {
                          setCurrentLoan(loan);
                          setFormData({
                            ...loan,
                            dueDate: loan.dueDate || calculateDueDate(loan.dateIssued)
                          });
                          setShowForm(true);
                        }}
                      >
                        <EditIcon />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => handleDelete(loan._id)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-amber-100 p-4">
              <h2 className="text-xl font-bold text-amber-900">
                {currentLoan ? 'Edit Loan Details' : 'Create New Loan'}
              </h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <form className="p-4">
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customer"
                    className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={formData.customer}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Collateral Type</label>
                  <select
                    name="itemType"
                    className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={formData.itemType}
                    onChange={handleInputChange}
                  >
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-amber-900 mb-1">Item Description</label>
                <input
                  type="text"
                  name="itemDescription"
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  placeholder="e.g., 22K Gold Chain, Silver Coins, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    name="weight"
                    className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter weight in grams"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Purity Only Percentage value(eg. 100% then only give input 100)</label>
                  <input 
                    name="purity"
                    className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={formData.purity}
                    onChange={handleInputChange}
                  >
                    </input>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Loan Amount (₹)</label>
                  <input
                    type="number"
                    name="loanAmount"
                    className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    placeholder="Enter loan amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    name="interestRate"
                    className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    placeholder="Enter interest rate"
                    step="0.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Issued Date</label>
                  <input
                    type="date"
                    name="dateIssued"
                    className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={formData.dateIssued}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({
                        ...prev,
                        dueDate: calculateDueDate(e.target.value)
                      }));
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-amber-900 mb-1">Status</label>
                <select
                  name="status"
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {Object.values(LOAN_STATUS).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Collateral Images
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.collateralImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Collateral ${index + 1}`} 
                        className="h-20 w-20 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-amber-300 border-dashed rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100">
                  <div className="flex flex-col items-center justify-center">
                    <UploadIcon className="text-amber-600 mb-2" />
                    <p className="text-sm text-amber-700">
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

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-100">
                <button 
                  type="button"
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  onClick={handleSubmit}
                  disabled={isUploading}
                >
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