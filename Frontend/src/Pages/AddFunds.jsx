import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Heading from "../Components/Heading";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function AddFundsForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signin");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(
        "https://paypulse.onrender.com/api/v1/stripe/create-payment-intent",
        { amount: parseFloat(amount) }
      );
      const { clientSecret } = res.data;
      setClientSecret(clientSecret);

      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent?.status === "succeeded") {
        setSuccess("Payment successful!");
        const token = localStorage.getItem("token");
        await axios.post(
          "https://paypulse.onrender.com/api/v1/account/credit",
          { amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (err) {
      console.error("Error during payment process:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 pt-16 sm:pt-0">
      <div className="w-full max-w-md p-6 bg-black/60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800 mx-4">
        <Heading text="Add Funds" />
        <p className="text-gray-300 mt-2 text-sm md:text-lg">
          Enter the amount you would like to add to your wallet
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-300"
            >
              Enter Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount to add"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Card Details
            </label>
            <div className="px-4 py-3 border border-gray-600 rounded-md bg-gray-800">
              <CardElement
                options={{
                  style: {
                    base: { fontSize: "16px", color: "#fff" },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-3 rounded-md hover:from-gray-700 hover:via-gray-800 hover:to-black disabled:opacity-50 transition-all"
          >
            {loading ? "Processing..." : "Add Funds"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AddFunds() {
  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <Elements stripe={stripePromise}>
        <AddFundsForm />
      </Elements>
    </div>
  );
}
