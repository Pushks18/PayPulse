import React from "react";

const Notification = ({ message }) => (
  <div className="bg-blue-100 text-blue-800 p-3 rounded-md shadow-md">
    {message}
  </div>
);

export default Notification;
