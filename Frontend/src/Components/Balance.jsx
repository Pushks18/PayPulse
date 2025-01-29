import axios from "axios";
import React, { useEffect, useState } from "react";

const Balance = () => {
  const [balance, setBalance] = useState();

  useEffect(() => {
    axios
      .get("https://paypulse.onrender.com/api/v1/account/balance", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // Round the balance to two decimal places and add trailing zeroes
        const roundedBalance = res.data.balance.toFixed(2);
        setBalance(roundedBalance);
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
