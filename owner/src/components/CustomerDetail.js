import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  LocalAtm as LoanIcon,
  SwapHoriz as ExchangeIcon,
  CardGiftcard as OfferIcon,
  AccountBalanceWallet as TransactionIcon,
  Lock as SecurityIcon,
  Work as OrderIcon,
  ShoppingBasket as PurchaseIcon,
  Description as NotesIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material';
import { getSpecificCustomer } from '../api/owners';

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { customerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await getSpecificCustomer({customerId});
        setCustomer(data.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSectionHeader = (icon, title) => (
    <div className="flex items-center mb-4 pb-2 border-b border-amber-100">
      {React.createElement(icon, { className: "text-amber-600 mr-2" })}
      <h2 className="text-xl font-semibold text-amber-800">{title}</h2>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-50">
        <div className="text-center">
          <DiamondIcon className="animate-pulse text-amber-500 text-5xl mb-4" />
          <p className="text-amber-800 text-lg">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-50">
        <div className="text-center">
          <DiamondIcon className="text-amber-500 text-5xl mb-4" />
          <p className="text-amber-800 text-lg mb-6">Customer not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg flex items-center mx-auto transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowBackIcon className="mr-2" /> Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowBackIcon className="mr-2" /> Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
          <DiamondIcon className="text-amber-600 mr-2" />
          Customer Details
        </h1>
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-amber-500">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0 relative">
            <img 
              src={customer.image || 'https://via.placeholder.com/150'} 
              alt={customer.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-100 shadow-md"
              onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
            />
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full p-2 shadow-lg">
              <DiamondIcon fontSize="small" />
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start bg-amber-50 p-3 rounded-lg">
              <PersonIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-800">Name</h3>
                <p className="text-gray-700">{customer.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start bg-amber-50 p-3 rounded-lg">
              <EmailIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-800">Email/ID</h3>
                <p className="text-gray-700">{customer.id || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start bg-amber-50 p-3 rounded-lg">
              <PhoneIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-800">Contact</h3>
                <p className="text-gray-700">{customer.contactNumber || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start bg-amber-50 p-3 rounded-lg">
              <LocationIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-800">Address</h3>
                <p className="text-gray-700">{customer.address || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start bg-amber-50 p-3 rounded-lg">
              <CalendarIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-800">Member Since</h3>
                <p className="text-gray-700">{formatDate(customer.date)}</p>
              </div>
            </div>
            <div className="flex items-start bg-amber-50 p-3 rounded-lg">
              <SecurityIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-800">Password</h3>
                <p className="text-gray-700">••••••••</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-400">
          {renderSectionHeader(OrderIcon, "Orders")}
          {customer.orders?.length > 0 ? (
            <div className="space-y-4">
              {customer.orders.map((order, index) => (
                <div key={index} className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-amber-900">
                      {order.itemName} <span className="text-amber-600">({order.metalType})</span>
                    </h3>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
                      ₹{order.priceExpected}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Weight:</span> 
                      <span className="text-gray-700">{order.weight}g</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Purity:</span> 
                      <span className="text-gray-700">{order.itemPurity}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Paid:</span> 
                      <span className="text-gray-700">₹{order.paidAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Date:</span> 
                      <span className="text-gray-700">{formatDate(order.date)}</span>
                    </div>
                  </div>
                  {order.orderDescription && (
                    <div className="mt-3 flex bg-white p-2 rounded">
                      <NotesIcon className="text-amber-500 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-600 italic">{order.orderDescription}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-amber-50 rounded-lg">
              <DiamondIcon className="text-amber-300 text-4xl mx-auto mb-2" />
              <p className="text-amber-800">No orders found</p>
            </div>
          )}
        </div>

        {/* Purchases Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-400">
          {renderSectionHeader(PurchaseIcon, "Purchases")}
          {customer.purchases?.length > 0 ? (
            <div className="space-y-4">
              {customer.purchases.map((purchase, index) => (
                <div key={index} className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-amber-900">Purchase #{index + 1}</h3>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
                      ₹{purchase.amountToBePaid}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Item ID:</span> 
                      <span className="text-gray-700">{purchase.itemName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Weight:</span> 
                      <span className="text-gray-700">{purchase.quantity}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Paid:</span> 
                      <span className="text-gray-700">₹{purchase.depositeAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Date:</span> 
                      <span className="text-gray-700">{formatDate(purchase.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-amber-50 rounded-lg">
              <DiamondIcon className="text-amber-300 text-4xl mx-auto mb-2" />
              <p className="text-amber-800">No purchases found</p>
            </div>
          )}
        </div>

        {/* Loans Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-400">
          {renderSectionHeader(LoanIcon, "Loans")}
          {customer.loan?.length > 0 ? (
            <div className="space-y-4">
              {customer.loan.map((loan, index) => (
                <div key={index} className={`rounded-lg p-4 border-l-4 ${
                  loan.status === 'Active' ? 'border-green-500 bg-green-50' : 
                  loan.status === 'Defaulted' ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'
                } shadow-sm`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-amber-900">{loan.itemType}</h3>
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      loan.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      loan.status === 'Defaulted' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Amount:</span> 
                      <span className="text-gray-700">₹{loan.loanAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Interest:</span> 
                      <span className="text-gray-700">{loan.interestRate}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Paid:</span> 
                      <span className="text-gray-700">₹{loan.loanPaidedAmount || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Due:</span> 
                      <span className="text-gray-700">{formatDate(loan.dueDate)}</span>
                    </div>
                    <div className="col-span-2 flex items-start">
                      <span className="text-amber-600 mr-1">Collateral:</span> 
                      <span className="text-gray-700">{loan.itemDescription}</span>
                    </div>
                  </div>
                  {loan.totalPayable && (
                    <div className="mt-3 bg-white p-2 rounded text-sm">
                      <span className="text-amber-600 mr-1">Total Payable:</span> 
                      <span className="text-gray-700 font-medium">₹{loan.totalPayable}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-amber-50 rounded-lg">
              <DiamondIcon className="text-amber-300 text-4xl mx-auto mb-2" />
              <p className="text-amber-800">No loans found</p>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-400">
          {renderSectionHeader(TransactionIcon, "Transactions")}
          {customer.transactions?.length > 0 ? (
            <div className="space-y-3">
              {customer.transactions.map((txn, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-amber-50 transition-colors">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      txn.status === 'Success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <TransactionIcon fontSize="small" />
                    </div>
                    <div>
                      <h3 className="font-medium capitalize text-amber-900">{txn.transactionMode}</h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(txn.date)} • {txn.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    txn.status === 'Success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{txn.transactionAmount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-amber-50 rounded-lg">
              <DiamondIcon className="text-amber-300 text-4xl mx-auto mb-2" />
              <p className="text-amber-800">No transactions found</p>
            </div>
          )}
        </div>

        {/* Exchange Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-400">
          {renderSectionHeader(ExchangeIcon, "Exchanges")}
          {customer.exchange?.length > 0 ? (
            <div className="space-y-4">
              {customer.exchange.map((exchange, index) => (
                <div key={index} className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-amber-900">
                      {exchange.itemName} <span className="text-amber-600">({exchange.metalType})</span>
                    </h3>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
                      ₹{exchange.amountToBeGiven}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Weight:</span> 
                      <span className="text-gray-700">{exchange.weight}g</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Purity:</span> 
                      <span className="text-gray-700">{exchange.itemPurity}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-600 mr-1">Metal Price:</span> 
                      <span className="text-gray-700">₹{exchange.metalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-amber-50 rounded-lg">
              <DiamondIcon className="text-amber-300 text-4xl mx-auto mb-2" />
              <p className="text-amber-800">No exchanges found</p>
            </div>
          )}
        </div>

        {/* Offers Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-400">
          {renderSectionHeader(OfferIcon, "Offers")}
          {customer.offers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customer.offers.map((offer, index) => (
                <div key={index} className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm">
                  <div className="flex items-start">
                    <OfferIcon className="text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-900">{offer.name}</h3>
                      <p className="text-sm text-amber-800 mt-1">{offer.offerDescription}</p>
                      <div className="flex justify-between items-center mt-3 text-xs">
                        <span className="text-amber-700">Valid until: {offer.validity}</span>
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-bold">
                          {offer.discountPercentage}% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-amber-50 rounded-lg">
              <DiamondIcon className="text-amber-300 text-4xl mx-auto mb-2" />
              <p className="text-amber-800">No offers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;