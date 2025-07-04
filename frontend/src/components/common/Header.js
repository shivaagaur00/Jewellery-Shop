import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./../../store/authSlice";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DiamondIcon from "@mui/icons-material/Diamond";
import { Link } from "react-router-dom";
import JewelleryDropdown from "./JewelleryDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMenuOpen(false);
      }
      if (isAccountMenuOpen && !event.target.closest(".account-menu-container")) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isAccountMenuOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isAccountMenuOpen) setIsAccountMenuOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery("");
  };

  const handleAccountMenuOpen = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsAccountMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-gray-50 to-white shadow-md border-b border-amber-100">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <DiamondIcon className="text-3xl text-amber-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent tracking-wide font-serif">
              Jewelsphere
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-amber-900 hover:text-amber-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-amber-500 after:to-amber-700 hover:after:w-full after:transition-all after:duration-300 py-2"
            >
              Home
            </Link>
            <JewelleryDropdown />
            <Link
              to="/collections"
              className="text-amber-900 hover:text-amber-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-amber-500 after:to-amber-700 hover:after:w-full after:transition-all after:duration-300 py-2"
            >
              Collections
            </Link>
            <Link
              to="/customOrder"
              className="text-amber-900 hover:text-amber-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-amber-500 after:to-amber-700 hover:after:w-full after:transition-all after:duration-300 py-2"
            >
              Custom Orders
            </Link>
            <Link
              to="/ContactUs"
              className="text-amber-900 hover:text-amber-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-amber-500 after:to-amber-700 hover:after:w-full after:transition-all after:duration-300 py-2"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-4 mr-4">
                <Link
                  to="/purchases"
                  className="text-amber-900 hover:text-amber-600 font-medium text-sm px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  My Purchases
                </Link>
                <Link
                  to="/loans"
                  className="text-amber-900 hover:text-amber-600 font-medium text-sm px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  My Loans
                </Link>
                <Link
                  to="/not-delivered-orders"
                  className="text-amber-900 hover:text-amber-600 font-medium text-sm px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  Pending Orders
                </Link>
              </div>
            )}

            <button
              onClick={handleSearchToggle}
              className="p-2 rounded-full hover:bg-amber-50 text-amber-800 hover:text-amber-600 transition-colors"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="hidden sm:block">
                  <button
                    className="p-2 rounded-full hover:bg-amber-50 text-amber-800 hover:text-amber-600 transition-colors relative"
                    aria-label="Wishlist"
                  >
                    <FavoriteBorderIcon />
                  </button>
                </Link>
                <Link to="/cart">
                  <button
                    className="p-2 rounded-full hover:bg-amber-50 text-amber-800 hover:text-amber-600 transition-colors relative"
                    aria-label="Cart"
                  >
                    <ShoppingCartIcon />
                  </button>
                </Link>
              </>
            )}

            <div className="relative account-menu-container hidden md:block">
              <button
                onClick={handleAccountMenuOpen}
                className="p-2 rounded-full hover:bg-amber-50 text-amber-800 hover:text-amber-600 transition-colors"
                aria-label="Account"
              >
                <AccountCircleIcon />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 w-48 z-20 border border-amber-100">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/purchases"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        My Purchases
                      </Link>
                      <Link
                        to="/loans"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        My Loans
                      </Link>
                      <Link
                        to="/not-delivered-orders"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Pending Orders
                      </Link>
                      <div className="border-t border-amber-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-full hover:bg-amber-50 text-amber-800"
              onClick={handleMenuToggle}
              aria-label="Menu"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <div
          className={`mobile-menu-container ${
            isMenuOpen ? "block" : "hidden"
          } md:hidden bg-white shadow-lg rounded-lg mt-2 p-4 border border-amber-100`}
        >
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <JewelleryDropdown mobile onClose={() => setIsMenuOpen(false)} />
            <Link
              to="/collections"
              className="text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/customOrder"
              className="text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Custom Orders
            </Link>
            <Link
              to="/ContactUs"
              className="text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated && (
              <>
                <div className="border-t border-amber-100 pt-2 mt-2"></div>
                <Link
                  to="/purchases"
                  className="text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Purchases
                </Link>
                <Link
                  to="/loans"
                  className="text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Loans
                </Link>
                <Link
                  to="/not-delivered-orders"
                  className="text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pending Orders
                </Link>
              </>
            )}

            <div className="border-t border-amber-100 pt-4 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/cart"
                    className="block text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shopping Cart
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-amber-900 hover:text-amber-600 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-white font-medium py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 transition-opacity text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-amber-800 mb-4">
              Search for Jewelry
            </h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search rings, necklaces, etc..."
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleSearchToggle}
                  className="px-4 py-2 text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;