import React, { useEffect, useState } from 'react';
import {
  ShoppingBag as ShoppingBagIcon,
  CalendarToday as CalendarIcon,
  LocalOffer as PriceTagIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
  Store as StoreIcon,
  Receipt as ReceiptIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material';
import { Rating } from '@mui/material';
import { getPurchasesOfCustomer } from '../../../api/customerAPIs';
import { useSelector } from 'react-redux';

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalAmount: 0,  averageRating: 0 });
  const token = useSelector((state) => state.auth.user?.token);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await getPurchasesOfCustomer(token);
      const data = res.data?.data || [];
      setPurchases(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to fetch purchases", error);
      setPurchases([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };
const calculateStats = (data) => {
  let totalAmount = 0;
  let totalRating = 0;
  let ratedItems = 0;

  for (const purchase of data) {
    totalAmount += parseFloat(purchase.amountPaid || 0);
    if (purchase.rating) {
      totalRating += purchase.rating;
      ratedItems++;
    }
  }

  setStats({
    total: data.length,
    totalAmount,
    totalRating,
    ratedItems,
    averageRating: ratedItems ? (totalRating / ratedItems).toFixed(1) : 0
  });
};
  useEffect(() => {
    if (token) fetchPurchases();
  }, [token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (status) {
      case 'Delivered':
        return <span className={`${baseClass} bg-emerald-50 text-emerald-800`}><CheckCircleIcon fontSize="small" /> Delivered</span>;
      case 'Shipped':
        return <span className={`${baseClass} bg-blue-50 text-blue-800`}><PaymentIcon fontSize="small" /> Shipped</span>;
      case 'Processing':
        return <span className={`${baseClass} bg-amber-50 text-amber-800`}><ReceiptIcon fontSize="small" /> Processing</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <DiamondIcon className="text-amber-500 animate-pulse text-5xl mb-4" />
          <p className="text-amber-800">Loading your precious purchases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Your Jewelry Collection</h1>
          <p className="text-amber-700 font-medium">Timeless pieces you've acquired</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ShoppingBagIcon className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Purchases</h3>
                <p className="text-2xl font-bold text-amber-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PriceTagIcon className="text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Investment</h3>
                <p className="text-2xl font-bold text-amber-800">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </div>
          
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <StarIcon className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Your Average Rating</h3>
                <div className="flex items-center gap-1">
                  <Rating value={parseFloat(stats.averageRating)} precision={0.5} readOnly size="small" />
                  <span className="text-xl font-bold text-amber-800">{stats.averageRating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchases List */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100">
          {purchases.length === 0 ? (
            <div className="p-12 text-center">
              <DiamondIcon className="text-amber-300 mx-auto text-5xl mb-4" />
              <h3 className="text-xl font-medium text-amber-900">Your Jewelry Collection Awaits</h3>
              <p className="text-amber-600">Your precious purchases will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-amber-100">
              {purchases.map((purchase, index) => (
                <div key={index} className="p-6 hover:bg-amber-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-sm">Order #{purchase.itemId}</span>
                        {getStatusBadge(purchase.status)}
                      </h3>
                      <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
                        <CalendarIcon fontSize="small" />
                        {formatDate(purchase.date)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-1 text-sm bg-amber-50 px-3 py-2 rounded-lg">
                        <PriceTagIcon fontSize="small" className="text-amber-600" />
                        <span className="font-medium text-amber-800">{formatCurrency(purchase.amountPaid)}</span>
                      </div>
                      <button className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm">
                        View Invoice
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-1/4 lg:w-1/5 h-48 bg-amber-100 rounded-xl overflow-hidden flex items-center justify-center">
                      {purchase.itemInfo?.image ? (
                        <img 
                          src={purchase.itemInfo.image} 
                          alt={purchase.itemInfo.itemName} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <DiamondIcon className="text-amber-300 text-5xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg text-amber-900 mb-2">{purchase.itemInfo?.itemName || "Designer Jewelry Piece"}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="bg-amber-50 p-3 rounded-lg">
                          <p className="text-xs text-amber-600">Weight</p>
                          <p className="font-medium">{purchase.itemInfo?.weight || 'Not specified'}</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg">
                          <p className="text-xs text-amber-600">Purity</p>
                          <p className="font-medium">{purchase.itemInfo?.itemPurity || 'Not specified'}</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg">
                          <p className="text-xs text-amber-600">Category</p>
                          <p className="font-medium">{purchase.itemInfo?.category || 'Jewelry'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        {purchase.rating ? (
                          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg w-fit">
                            <Rating 
                              value={purchase.rating} 
                              precision={0.5} 
                              readOnly 
                              icon={<StarIcon className="text-green-600" />}
                              emptyIcon={<StarBorderIcon className="text-green-600" />}
                            />
                            <span className="text-sm text-green-800">You rated this piece</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg w-fit">
                            <Rating 
                              value={0} 
                              precision={0.5} 
                              size="medium" 
                              icon={<StarIcon className="text-blue-600" />} 
                              emptyIcon={<StarBorderIcon className="text-blue-600" />} 
                            />
                            <span className="text-sm text-blue-800">Rate this masterpiece</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasesPage;