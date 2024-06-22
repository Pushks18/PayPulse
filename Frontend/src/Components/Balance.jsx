import axios from "axios";
import React, { useEffect, useState } from "react";

const Balance = () => {
  const [balance, setBalance] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setBalance(res.data.balance);
      });
  }, []);
  return (
    <div>
      <div className="flex flex-col">
        <div className="text-2xl font-bold">Your Balance ${balance}</div>
      </div>

      <div className="text-3xl font-bold mt-3">Users</div>
    </div>
  );
};

export default Balance;
