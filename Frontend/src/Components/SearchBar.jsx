import React from "react";

const SearchBar = () => {
  return (
    <div>
      <div className="space-x-3">
        <input
          className="border border-gray-300 rounded-md w-[1500px] h-[35px] pl-4"
          type="text"
          placeholder="Search users..."
        />
      </div>
    </div>
  );
};

export default SearchBar;
