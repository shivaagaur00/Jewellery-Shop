import React, { useEffect, useState } from "react";
import { editBasicInfo, getCustomer, resetPassword } from "../../../api/customerAPIs";
import { useSelector } from "react-redux";
import { CameraAlt, Delete } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const Profile = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", "ml_default");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dthriaot4/image/upload",
        cloudinaryFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      setBasicInfoForm((prev) => ({
        ...prev,
        image: response.data.secure_url,
      }));
    } catch (err) {
      setErroEditBasicInfoForm(() => "Failed to upload image");
      console.error(err);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };
  const removeImage = () => {
    setImagePreview("");
    setBasicInfoForm((prev) => ({ ...prev, image: "" }));
  };

  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.user?.token);

  const [showResetForm, setShowResetForm] = useState(false);
  const [errorResetForm, setErrorResetForm] = useState("");
  const [resetPasswordForm, setResetPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const handleInputChangePassword = (e) => {
    const { name, value } = e.target;
    setResetPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePasswordChange = async () => {
    try {
      if (
        !resetPasswordForm.currentPassword ||
        !resetPasswordForm.newPassword
      ) {
        setErrorResetForm("Enter Current and New password");
        return;
      }
      const res = await resetPassword(
        {
          current: resetPasswordForm.currentPassword,
          newPassword: resetPasswordForm.newPassword,
        },
        token
      );
      if (res.message === "Password changed successfully")
        setShowResetForm(false);
    } catch (error) {
      console.log("Password reset failed:", error);
    }
  };

  const [showEditBasicInfoForm, setShowEditBasicInfoForm] = useState(false);
  const [errorEditBasicInfoForm, setErroEditBasicInfoForm] = useState("");
  const [basicInfoForm, setBasicInfoForm] = useState({
    name: customer?.name || "",
    image: customer?.image || "",
    address: customer?.address || "",
    contactNumber: customer?.contactNumber || "",
  });
  const handleInputChangeBasicInfo = (e) => {
    const { name, value } = e.target;
    setBasicInfoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeBasicInfo = async () => {
    console.log(0);
    try {
      if (
        !basicInfoForm.name ||
        !basicInfoForm.address ||
        !basicInfoForm.contactNumber ||
        !basicInfoForm.image
      ) {
        setErrorResetForm("Enter all Details");
        return;
      }
      const res = await editBasicInfo(
        {
          name: basicInfoForm.name,
          address: basicInfoForm.address,
          contactNumber: basicInfoForm.contactNumber,
          image: basicInfoForm.image,
        },
        token
      );
      console.log(res);
      if (res.message === "Details Saved Successfully")
        setBasicInfoForm(false);
    } catch (error) {
      console.log("Failed to Save Details", error);
    }
  };
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const customerData = await getCustomer(token);
        console.log(customerData);
        setCustomer(customerData);
        setBasicInfoForm(customerData);
      } catch (err) {
        setError(err.message || "Failed to fetch customer data");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </>
    );
  }
  if (!customer) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">
              No customer data found
            </h2>
          </div>
        </div>
      </>
    );
  }
  const unreadNotifications =
    customer.notifications?.filter((notification) => !notification.isRead) ||
    [];
  const readNotifications =
    customer.notifications?.filter((notification) => notification.isRead) || [];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={customer.image || "/default-profile.png"}
              alt={customer.name}
              className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {customer.name}
              </h1>
              <p className="text-gray-600 mb-2">{customer.address}</p>
              <p className="text-gray-600 mb-2">{customer.contactNumber}</p>
              <p className="text-gray-600">
                Member since: {new Date(customer.date).toLocaleDateString()}
              </p>
            </div>
          </div>
<div className="flex flex-col space-y-3 mr-5">
  <button
    type="button"
    onClick={() => setShowResetForm(true)}
    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
  >
    Reset Password
  </button>
  <button
    type="button"
    onClick={() => setShowEditBasicInfoForm(true)}
    className="px-4 py-2 bg-white border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
  >
    Edit Profile
  </button>
</div>
                
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Unread Notifications
            </h2>
            {unreadNotifications.length > 0 ? (
              <ul className="space-y-3">
                {unreadNotifications.map((notification, index) => (
                  <li
                    key={index}
                    className="border-l-4 border-red-500 pl-4 py-2"
                  >
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No unread notifications</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Recent Notifications
            </h2>
            {readNotifications.length > 0 ? (
              <ul className="space-y-3">
                {readNotifications.map((notification, index) => (
                  <li
                    key={index}
                    className="border-l-4 border-gray-300 pl-4 py-2"
                  >
                    <p className="text-gray-700">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent notifications</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {customer.orders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Delivery
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customer.orders.map((order, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {order.itemName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.orderDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">
                          ${order.priceExpected}
                        </div>
                        <div className="text-sm text-gray-500">
                          Deposit: ${order.depositedAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          order.expectedDeliverDate
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No orders found</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Loans</h2>
          {customer.loan?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customer.loan.map((loan, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {loan.itemType}
                        </div>
                        <div className="text-sm text-gray-500">
                          {loan.itemDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              loan.status === "Active"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">${loan.loanAmount}</div>
                        <div className="text-sm text-gray-500">
                          Paid: ${loan.loanPaidedAmount}
                        </div>
                        <div className="text-sm text-gray-500">
                          Remaining: ${loan.remainingAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No active loans</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Purchases</h2>
          {customer.purchases?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customer.purchases.map((purchase, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${purchase.amountPaid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {purchase.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(purchase.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No purchases found</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          {customer.transactions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customer.transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.transactionMode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${transaction.transactionAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              transaction.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No transactions found</p>
          )}
        </div>
      </div>

      {showResetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-amber-900">
              Reset Password
            </h2>

            {errorResetForm && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {errorResetForm}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={resetPassword.currentPassword}
                  onChange={handleInputChangePassword}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  onChange={handleInputChangePassword}
                  value={resetPassword.newPassword}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetForm(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditBasicInfoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-amber-900">
              Edit Basic Information
            </h2>

            {errorEditBasicInfoForm && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {errorEditBasicInfoForm}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={basicInfoForm.name}
                  onChange={handleInputChangeBasicInfo}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  onChange={handleInputChangeBasicInfo}
                  value={basicInfoForm.address}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter Address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  onChange={handleInputChangeBasicInfo}
                  value={basicInfoForm.contactNumber}
                  className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter contact number"
                  required
                />
              </div>
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition flex items-center gap-2 ${
                      isLoading
                        ? "bg-amber-200"
                        : "bg-amber-100 hover:bg-amber-200"
                    } text-amber-800 text-sm sm:text-base`}
                  >
                    {isLoading && uploadProgress > 0 ? (
                      <>
                        <CircularProgress
                          size={18}
                          variant="determinate"
                          value={uploadProgress}
                        />
                        <span>{uploadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <CameraAlt fontSize="small" />
                        <span>Upload Photo</span>
                      </>
                    )}
                  </div>
                  <div className="relative mt-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100 mb-3 sm:mb-4 overflow-hidden border-2 border-amber-300">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-0 right-0 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600"
                        >
                          <Delete fontSize="small" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-500">
                        <CameraAlt fontSize="large" />
                      </div>
                    )}
                  </div>
                </label>
                {errorEditBasicInfoForm && (
                  <p className="mt-1 text-sm text-rose-600 text-center">
                    {errorEditBasicInfoForm}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditBasicInfoForm(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangeBasicInfo}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
