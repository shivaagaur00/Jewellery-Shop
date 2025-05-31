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
  Close as CloseIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { getSpecificCustomer } from '../api/owners';
import axios from 'axios';

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { customerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await getSpecificCustomer({ customerId });
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
    <div className="flex items-center mb-4 border-b pb-2">
      {React.createElement(icon, { className: "text-amber-600 mr-2" })}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading customer details...</div>;
  }

  if (!customer) {
    return (
      <div className="text-center py-8">
        <p>Customer not found</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 bg-amber-600 text-white px-4 py-2 rounded flex items-center"
        >
          <ArrowBackIcon className="mr-1" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="bg-amber-600 text-white px-4 py-2 rounded flex items-center"
        >
          <ArrowBackIcon className="mr-1" /> Back
        </button>
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <img 
              src={customer.image || 'https://via.placeholder.com/150'} 
              alt={customer.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-100"
              onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
            />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start">
              <PersonIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold">Name</h3>
                <p>{customer.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <EmailIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold">Email/ID</h3>
                <p>{customer.id || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <PhoneIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold">Contact</h3>
                <p>{customer.contactNumber || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <LocationIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>{customer.address || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <CalendarIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold">Member Since</h3>
                <p>{formatDate(customer.date)}</p>
              </div>
            </div>
            <div className="flex items-start">
              <SecurityIcon className="text-amber-600 mr-2 mt-1" />
              <div>
                <h3 className="font-semibold">Password</h3>
                <p>••••••••</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderSectionHeader(OrderIcon, "Orders")}
          {customer.orders?.length > 0 ? (
            <div className="space-y-4">
              {customer.orders.map((order, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{order.itemName} ({order.metalType})</h3>
                    <span className="text-amber-600">₹{order.priceExpected}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">Weight:</span> {order.weight}g
                    </div>
                    <div>
                      <span className="text-gray-500">Purity:</span> {order.itemPurity}
                    </div>
                    <div>
                      <span className="text-gray-500">Paid:</span> ₹{order.paidAmount}
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span> {formatDate(order.date)}
                    </div>
                  </div>
                  {order.orderDescription && (
                    <div className="mt-2 flex">
                      <NotesIcon className="text-amber-600 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-600">{order.orderDescription}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No orders found</p>
          )}
        </div>

        {/* Purchases Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderSectionHeader(PurchaseIcon, "Purchases")}
          {customer.purchases?.length > 0 ? (
            <div className="space-y-4">
              {customer.purchases.map((purchase, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Purchase #{index + 1}</h3>
                    <span className="text-amber-600">₹{purchase.amountToBePaid}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">Item ID:</span> {purchase.itemName}
                    </div>
                    <div>
                      <span className="text-gray-500">Weight:</span> {purchase.quantity}
                    </div>
                    <div>
                      <span className="text-gray-500">Paid:</span> ₹{purchase.depositeAmount}
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span> {formatDate(purchase.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No purchases found</p>
          )}
        </div>

        {/* Loans Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderSectionHeader(LoanIcon, "Loans")}
          {customer.loan?.length > 0 ? (
            <div className="space-y-4">
              {customer.loan.map((loan, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{loan.itemType}</h3>
                    <span className={`${
                      loan.status === 'Active' ? 'text-green-600' : 
                      loan.status === 'Defaulted' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span> ₹{loan.loanAmount}
                    </div>
                    <div>
                      <span className="text-gray-500">Interest:</span> {loan.interestRate}%
                    </div>
                    <div>
                      <span className="text-gray-500">Paid:</span> ₹{loan.loanPaidedAmount || 0}
                    </div>
                    <div>
                      <span className="text-gray-500">Due:</span> {formatDate(loan.dueDate)}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Collateral:</span> {loan.itemDescription}
                    </div>
                  </div>
                  {loan.totalPayable && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Total Payable:</span> ₹{loan.totalPayable}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No loans found</p>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderSectionHeader(TransactionIcon, "Transactions")}
          {customer.transactions?.length > 0 ? (
            <div className="space-y-3">
              {customer.transactions.map((txn, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0">
                  <div>
                    <h3 className="font-medium capitalize">{txn.transactionMode}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(txn.date)} • {txn.description || 'No description'}
                    </p>
                  </div>
                  <span className={`font-medium ${
                    txn.status === 'Success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{txn.transactionAmount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No transactions found</p>
          )}
        </div>

        {/* Exchange Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderSectionHeader(ExchangeIcon, "Exchanges")}
          {customer.exchange?.length > 0 ? (
            <div className="space-y-4">
              {customer.exchange.map((exchange, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{exchange.itemName} ({exchange.metalType})</h3>
                    <span className="text-amber-600">₹{exchange.amountToBeGiven}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">Weight:</span> {exchange.weight}g
                    </div>
                    <div>
                      <span className="text-gray-500">Purity:</span> {exchange.itemPurity}
                    </div>
                    <div>
                      <span className="text-gray-500">Metal Price:</span> ₹{exchange.metalPrice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No exchanges found</p>
          )}
        </div>

        {/* Offers Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderSectionHeader(OfferIcon, "Offers")}
          {customer.offers?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {customer.offers.map((offer, index) => (
                <div key={index} className="bg-amber-50 px-4 py-2 rounded-lg">
                  <h3 className="font-medium text-amber-800">{offer.name}</h3>
                  <p className="text-sm text-amber-700">{offer.offerDescription}</p>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span>Valid until: {offer.validity}</span>
                    <span className="bg-amber-100 px-2 py-1 rounded">
                      {offer.discountPercentage}% off
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No offers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;