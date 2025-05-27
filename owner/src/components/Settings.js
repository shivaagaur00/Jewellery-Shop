import React, { useState } from 'react';
import {
  Save as SaveIcon,
  Settings as SettingsIcon,
  CloudUpload as UploadIcon,
  LocalAtm as CurrencyIcon,
  Inventory as InventoryIcon,
  Diamond as DiamondIcon,
  Category as CategoryIcon,
  AssignmentReturn as ReturnIcon,
  LocalShipping as ShippingIcon,
  VerifiedUser as WarrantyIcon,
  PhotoCamera as LogoIcon,
  Style as MetalIcon,
  Palette as GemstoneIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    shopName: 'Luxury Gems & Co.',
    description: 'Exquisite handcrafted jewelry since 1985',
    currency: 'USD',
    inventoryManagement: true,
    lowStockThreshold: 5,
    metalTypes: ['Gold', 'Platinum'],
    gemstoneTypes: ['Diamond', 'Sapphire'],
    categories: ['Rings', 'Necklaces'],
    returnPolicy: '30-day return policy for unused items with original packaging and certificate.',
    shippingPolicy: 'Free insured shipping on all orders over $500. International shipping available.',
    warrantyInfo: 'Lifetime warranty on craftsmanship. 1-year warranty on gemstone settings.',
    notificationEmail: '',
    appoinmentBooking: true,
    customizationService: false,
    goldPurityOptions: ['14K', '18K', '22K', '24K'],
    selectedPurity: ['18K'],
    priceDisplay: 'with-tax',
    taxRate: 7.5
  });

  const metalTypes = ['Gold', 'Silver', 'Platinum', 'Palladium', 'Titanium', 'Stainless Steel'];
  const gemstoneTypes = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Opal', 'Topaz', 'Amethyst'];
  const jewelryCategories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches', 'Pendants', 'Brooches', 'Anklets'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
  const priceDisplayOptions = [
    { value: 'with-tax', label: 'Show prices with tax included' },
    { value: 'without-tax', label: 'Show prices without tax' },
    { value: 'both', label: 'Show both prices' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving settings:', settings);
    // API call would go here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center mb-8 border-b pb-4">
        <SettingsIcon className="text-amber-600 text-3xl mr-3" />
        <h1 className="text-2xl font-serif font-bold text-gray-800">Jewelry Boutique Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Shop Information */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <LogoIcon className="text-amber-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-700">Shop Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={settings.shopName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Logo</label>
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <UploadIcon className="text-amber-600 mr-2" />
                <span>Upload Logo</span>
                <input type="file" className="hidden" accept="image/*" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
            <textarea
              name="description"
              value={settings.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <InventoryIcon className="text-amber-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-700">Inventory Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inventoryManagement"
                name="inventoryManagement"
                checked={settings.inventoryManagement}
                onChange={handleChange}
                className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="inventoryManagement" className="ml-2 block text-sm text-gray-700">
                Enable Inventory Management
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                name="lowStockThreshold"
                value={settings.lowStockThreshold}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Product Settings */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <DiamondIcon className="text-amber-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-700">Product Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <MetalIcon className="text-amber-500 mr-1 text-lg" />
                  Metal Types
                </span>
              </label>
              <select
                multiple
                name="metalTypes"
                value={settings.metalTypes}
                onChange={(e) => handleMultiSelect('metalTypes', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 h-auto min-h-[42px]"
              >
                {metalTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <GemstoneIcon className="text-amber-500 mr-1 text-lg" />
                  Gemstone Types
                </span>
              </label>
              <select
                multiple
                name="gemstoneTypes"
                value={settings.gemstoneTypes}
                onChange={(e) => handleMultiSelect('gemstoneTypes', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 h-auto min-h-[42px]"
              >
                {gemstoneTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <CategoryIcon className="text-amber-500 mr-1 text-lg" />
                  Jewelry Categories
                </span>
              </label>
              <select
                multiple
                name="categories"
                value={settings.categories}
                onChange={(e) => handleMultiSelect('categories', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 h-auto min-h-[42px]"
              >
                {jewelryCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gold Purity Options</label>
              <select
                multiple
                name="goldPurityOptions"
                value={settings.selectedPurity}
                onChange={(e) => handleMultiSelect('selectedPurity', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 h-auto min-h-[42px]"
              >
                {settings.goldPurityOptions.map(purity => (
                  <option key={purity} value={purity}>{purity}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Business Policies */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <ReturnIcon className="text-amber-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-700">Business Policies</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <ReturnIcon className="text-amber-500 mr-1 text-lg" />
                  Return Policy
                </span>
              </label>
              <textarea
                name="returnPolicy"
                value={settings.returnPolicy}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <ShippingIcon className="text-amber-500 mr-1 text-lg" />
                  Shipping Policy
                </span>
              </label>
              <textarea
                name="shippingPolicy"
                value={settings.shippingPolicy}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <WarrantyIcon className="text-amber-500 mr-1 text-lg" />
                  Warranty Information
                </span>
              </label>
              <textarea
                name="warrantyInfo"
                value={settings.warrantyInfo}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <SettingsIcon className="text-amber-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-700">Additional Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <CurrencyIcon className="text-amber-500 mr-1 text-lg" />
                  Default Currency
                </span>
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Display</label>
              <select
                name="priceDisplay"
                value={settings.priceDisplay}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
              >
                {priceDisplayOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center">
                  <NotificationIcon className="text-amber-500 mr-1 text-lg" />
                  Notification Email
                </span>
              </label>
              <input
                type="email"
                name="notificationEmail"
                value={settings.notificationEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
                placeholder="orders@yourjewelryshop.com"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="appoinmentBooking"
                name="appoinmentBooking"
                checked={settings.appoinmentBooking}
                onChange={handleChange}
                className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="appoinmentBooking" className="ml-2 block text-sm text-gray-700">
                Enable Appointment Booking
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="customizationService"
                name="customizationService"
                checked={settings.customizationService}
                onChange={handleChange}
                className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="customizationService" className="ml-2 block text-sm text-gray-700">
                Offer Customization Service
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
          >
            <SaveIcon className="mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;