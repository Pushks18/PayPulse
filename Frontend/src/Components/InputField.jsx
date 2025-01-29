import React from "react";

const InputField = ({ label, type, placeholder, onChange, className }) => {
  return (
    <div className="flex flex-col w-full text-left">
      <label className="text-white mb-2 font-semibold">{label}</label>
      <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        className={`p-2 border border-gray-300 rounded-md ${className}`}
      />
    </div>
  );
};

export default InputField;
