import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Heading from "./Heading";

const Navbar = ({ title }) => {
  const [firstName, setFirstName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          "https://paypulse.onrender.com/api/v1/users/details",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFirstName(response.data.firstName);
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    axios
      .post("https://paypulse.onrender.com/api/v1/users/logout")
      .then(() => navigate("/"))
      .catch((error) => console.error("Error during sign-out:", error));
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-md shadow-lg border-b-2 border-gray-600 relative z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between text-white">
        {/* <Heading text={title} /> */}
        <h1 className="text-xl font-bold">PayPulse</h1>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-4">
          <Link to="/dashboard" className="hover:text-indigo-300 font-semibold">
            Home
          </Link>
          <Link to="/add-funds" className="hover:text-indigo-300 font-semibold">
            Add Funds
          </Link>
          <Link
            to="/visualization"
            className="hover:text-indigo-300 font-semibold"
          >
            Visualization
          </Link>
          <Link
            to="/transaction-log"
            className="hover:text-indigo-300 font-semibold"
          >
            Transaction Log
          </Link>
          <span>Hello, {firstName || "Guest"}</span>
          <button
            onClick={handleSignOut}
            className="hover:text-red-400 font-semibold"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-white focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute sm:hidden top-full right-0 w-full mt-1 bg-gradient-to-r from-gray-800 to-gray-900 text-center z-50 rounded-b-lg shadow-xl ${
            showMenu ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col py-2">
            <Link
              to="/dashboard"
              className="py-2 hover:text-indigo-300 font-semibold"
              onClick={() => setShowMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/add-funds"
              className="py-2 hover:text-indigo-300 font-semibold"
              onClick={() => setShowMenu(false)}
            >
              Add Funds
            </Link>
            <Link
              to="/visualization"
              className="py-2 hover:text-indigo-300 font-semibold"
              onClick={() => setShowMenu(false)}
            >
              Visualization
            </Link>
            <Link
              to="/transaction-log"
              className="py-2 hover:text-indigo-300 font-semibold"
              onClick={() => setShowMenu(false)}
            >
              Transaction Log
            </Link>
            <div className="py-2 text-white font-medium">
              Hello, {firstName || "Guest"}
            </div>
            <button
              onClick={handleSignOut}
              className="py-2 hover:text-red-400 font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
