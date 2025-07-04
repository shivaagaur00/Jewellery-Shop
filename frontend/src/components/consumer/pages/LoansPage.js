import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  DiamondOutlined as GemIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  Scale as WeightIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  Warning as WarningIcon,
  
} from '@mui/icons-material';
import { Favorite, Home, Settings } from '@mui/icons-material';
import { getLoansOfCustomer } from '../../../api/customerAPIs';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeLoans: 0,
    totalBorrowed: 0,
    pendingPayments: 0
  });
  const token = useSelector((state) => state.auth.user?.token);
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await getLoansOfCustomer(token);
      console.log(res);
      setLoans(res.data.loans || []);
      calculateStats(res.data.loans || []);
    } catch (error) {
      console.error("Failed to fetch loans", error);
      setLoans([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (loanData) => {
  let activeLoans = 0;
  let totalBorrowed = 0;
  let pendingPayments = 0;

  loanData.forEach(loan => {
    const loanAmount = loan.loanAmount || 0;
    const paidAmount = loan.loanPaidedAmount || 0;
    totalBorrowed += loanAmount;
    if (loan.status === 'Active') {
      activeLoans++;
      pendingPayments+=(loanAmount-paidAmount);
    }
  });
  console.log(activeLoans);
  setStats({ activeLoans, totalBorrowed, pendingPayments });
};


  useEffect(() => {
    if (token) {
      fetchLoans();
    }
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><ClockIcon fontSize="small" /> Active</span>;
      case 'Completed':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircleIcon fontSize="small" /> Completed</span>;
      case 'Defaulted':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><WarningIcon fontSize="small" /> Defaulted</span>;
      case 'Pending':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><ClockIcon fontSize="small" /> Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-50 flex items-center justify-center">
        <WarningIcon className="text-amber-600" size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Your Jewelry Loans</h1>
          <p className="text-amber-700 text-lg">Manage your pledged jewelry items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500">
            <h3 className="text-gray-500 text-sm">Active Loans</h3>
            <p className="text-2xl font-bold text-amber-700">{stats.activeLoans}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm">Total Borrowed</h3>
            <p className="text-2xl font-bold text-amber-700">{formatCurrency(stats.totalBorrowed)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">Pending Payments</h3>
            <p className="text-2xl font-bold text-amber-700">{formatCurrency(stats.pendingPayments)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loans.length === 0 ? (
            <div className="p-12 text-center">
              <GemIcon className="text-amber-400 mx-auto text-5xl mb-4" />
              <h3 className="text-xl font-medium text-amber-900">No active loans found</h3>
              <p className="text-amber-600">Your jewelry loan details will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-amber-100">
              {loans.map((loan) => (
                <div key={loan._id} className="p-6 hover:bg-amber-50 transition-colors">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/4 lg:w-1/5 bg-amber-100 rounded-lg flex items-center justify-center relative h-40">
                      <GemIcon className="text-amber-400 text-4xl" />
                      {loan.collateralImages?.length > 0 && (
                        <span className="absolute bottom-2 right-2 bg-white bg-opacity-80 text-black px-2 py-1 rounded text-xs font-medium shadow">
                          {loan.collateralImages.length} {loan.collateralImages.length === 1 ? 'image' : 'images'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-amber-900">{loan.itemType}</h3>
                          <p className="text-sm text-amber-600">{loan.itemDescription}</p>
                        </div>
                        {getStatusBadge(loan.status)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MoneyIcon className="text-amber-500" fontSize="small" />
                          <div>
                            <p className="text-xs text-amber-600">Loan Amount</p>
                            <p className="font-medium">{formatCurrency(loan.loanAmount)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <PercentIcon className="text-amber-500" fontSize="small" />
                          <div>
                            <p className="text-xs text-amber-600">Interest Rate</p>
                            <p className="font-medium">{loan.interestRate}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <WeightIcon className="text-amber-500" fontSize="small" />
                          <div>
                            <p className="text-xs text-amber-600">Weight & Purity</p>
                            <p className="font-medium">{loan.weight || '-'} ({loan.purity || '-'})</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="text-amber-500" fontSize="small" />
                          <div>
                            <p className="text-xs text-amber-600">Issued Date</p>
                            <p className="font-medium">{formatDate(loan.dateIssued)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="text-amber-500" fontSize="small" />
                          <div>
                            <p className="text-xs text-amber-600">Due Date</p>
                            <p className="font-medium">{formatDate(loan.dueDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MoneyIcon className="text-amber-500" fontSize="small" />
                          <div>
                            <p className="text-xs text-amber-600">Paid Amount</p>
                            <p className="font-medium">{formatCurrency(loan.loanPaidedAmount)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-amber-700 mb-1">
                          <span>Payment Progress</span>
                          <span>{formatCurrency(loan.loanPaidedAmount)} of {formatCurrency(loan.loanAmount)}</span>
                        </div>
                        <div className="w-full bg-amber-200 rounded-full h-2.5">
                          <div 
                            className="bg-amber-600 h-2.5 rounded-full" 
                            style={{ 
                              width: `${((loan.loanPaidedAmount || 0) / loan.loanAmount * 100)}%`,
                              maxWidth: '100%'
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
                          Make Payment
                        </button>
                        {loan.status === 'Active' && (
                          <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            Request Extension
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h4 className="font-medium text-lg text-amber-900 mb-4">Loan Status Guide</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-sm">Active - Currently ongoing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-sm">Completed - Fully repaid</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-sm">Defaulted - Payment overdue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-sm">Pending - Approval needed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;