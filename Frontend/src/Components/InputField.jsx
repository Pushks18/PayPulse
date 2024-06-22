import React, { useState } from "react";

const InputField = ({ label, type, placeholder, onChange }) => {
  const [, setInput] = useState("");
  return (
    <div>
      <div className="flex flex-col w-full text-left">
        <label className="mb-2 text-left font-semibold">{label}</label>
        <input
          onChange={onChange}
          type={type}
          className="p-2 border border-gray-300 rounded-md"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default InputField;
