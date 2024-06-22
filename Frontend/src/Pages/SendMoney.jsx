import React, { useState } from "react";
import Heading from "../Components/Heading";
import ProfileIcon from "../Components/ProfileIcon";
import Button from "../Components/Button";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendMoney = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          to: id,
          amount: parseFloat(amount), // Ensure amount is a number
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setSuccess("Money sent successfully!");
      setError("");
      setTimeout(() => {
        navigate("/dashboard"); // Navigate to dashboard after success
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to send money. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="bg-gray-300 h-[735px] items-center justify-center flex">
      <div className="bg-white flex flex-col w-[400px] p-6 rounded-md">
        <div className="flex justify-center items-center">
          <Heading text={"Send Money"} />
        </div>

        <div className="flex space-x-2 mt-10 justify-start items-start ml-4">
          <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
            <div className="flex flex-col justify-center h-full text-xl">
              {name[0].toUpperCase()}
            </div>
          </div>

          <div className="font-semibold text-2xl">{name}</div>
        </div>

        <div className="font-semibold text-lg ml-6 mt-3">Amount (in Rs)</div>
        <div className="ml-6 mt-3 mb-5">
          <input
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            type="number"
            placeholder="Enter amount"
            className="w-[350px] rounded-md border border-b-2 border-gray-300 p-2"
          />
        </div>

        {error && <div className="text-red-500 text-center mb-3">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-3">{success}</div>
        )}

        <div className="mb-9 flex justify-center">
          <Button onClick={handleSendMoney} button={"Send Money"} />
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
