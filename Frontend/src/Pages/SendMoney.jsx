import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import InputField from "../Components/InputField";

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    setLoading(false);
  }, [navigate]);

  const handleSendMoney = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    try {
      const response = await axios.post(
        "https://paypulse.onrender.com/api/v1/account/transfer",
        { to: id, amount: parseFloat(amount) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Money sent successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Error during the transaction:", err);
      toast.error("Failed to send money. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Toaster />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="w-full max-w-md p-6 bg-black/60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800">
        <Heading text="Send Money" />
        <p className="text-gray-300 mt-2 text-sm md:text-lg">
          Send money to {name}
        </p>
        <div className="space-y-4 mt-4">
          <InputField
            onChange={(e) => setAmount(e.target.value)}
            label="Amount"
            type="number"
            placeholder="Enter amount"
            className="text-white bg-gray-800"
          />
          <div className="flex justify-center mt-5">
            <Button onClick={handleSendMoney} text="Send Money" />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default SendMoney;
