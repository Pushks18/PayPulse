import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <button
          onClick={onClick}
          className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white hover:from-gray-700 hover:via-gray-800 hover:to-black disabled:opacity-50 transition-all rounded-md px-12 py-3"
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default Button;
