import React from "react";

const Button = ({ button, onClick }) => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <button
          onClick={onClick}
          className="bg-black text-white border rounded-md px-12 py-3"
        >
          {button}
        </button>
      </div>
    </div>
  );
};

export default Button;
