import React from "react";
import Heading from "../Components/Heading";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen relative bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="w-full max-w-md p-6 bg-black/60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800 text-center">
        <Heading text="Pay Pulse" className="text-white" />
        <button
          onClick={() => navigate("/signup")}
          className="mt-10 md:mt-20 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-all duration-300 ease-in-out"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;
