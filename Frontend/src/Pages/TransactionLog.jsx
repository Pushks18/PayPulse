import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const TransactionLog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionsAndUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const decoded = jwtDecode(token);
      try {
        const response = await axios.get(
          `https://paypulse.onrender.com/api/v1/transaction/history?userId=${decoded.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userIds = [
          ...new Set(response.data.map((tx) => [tx.from, tx.to]).flat()),
        ].filter((id) => id !== "wallet" && /^[0-9a-fA-F]{24}$/.test(id));

        const userDetails =
          userIds.length > 0 ? await fetchUserDetails(userIds, token) : {};
        const enrichedTransactions = response.data.map((tx) => ({
          ...tx,
          fromUserName:
            tx.from === "wallet"
              ? "Wallet"
              : userDetails[tx.from]?.firstName || "N/A",
          toUserName:
            tx.to === "wallet"
              ? "Wallet"
              : userDetails[tx.to]?.firstName || "N/A",
        }));

        setTransactions(enrichedTransactions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        setError("Failed to fetch transactions");
        setLoading(false);
      }
    };

    fetchTransactionsAndUsers();
  }, [navigate]);

  const fetchUserDetails = async (userIds, token) => {
    const params = new URLSearchParams({
      userIds: userIds.join(","),
    }).toString();
    const response = await axios.get(
      `https://paypulse.onrender.com/api/v1/users/user-details?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-6 text-white">
          Transaction History
        </h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Stacked layout for mobile */}
        <div className="space-y-4 sm:hidden">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <div className="text-white">
                <div>
                  <span className="font-semibold">From:</span>{" "}
                  {transaction.from}
                </div>
                <div>
                  <span className="font-semibold">From Name:</span>{" "}
                  {transaction.fromUserName}
                </div>
                <div>
                  <span className="font-semibold">To:</span> {transaction.to}
                </div>
                <div>
                  <span className="font-semibold">To Name:</span>{" "}
                  {transaction.toUserName}
                </div>
                <div>
                  <span className="font-semibold">Amount:</span>{" "}
                  {transaction.amount}
                </div>
                <div>
                  <span className="font-semibold">Type:</span>{" "}
                  {transaction.transactionType}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  {transaction.status}
                </div>
                <div>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(transaction.date).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regular table for larger screens */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-gray-800 text-white rounded-lg shadow-md">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left">From</th>
                <th className="px-4 py-2 text-left">From Name</th>
                <th className="px-4 py-2 text-left">To</th>
                <th className="px-4 py-2 text-left">To Name</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{transaction.from}</td>
                  <td className="px-4 py-2">{transaction.fromUserName}</td>
                  <td className="px-4 py-2">{transaction.to}</td>
                  <td className="px-4 py-2">{transaction.toUserName}</td>
                  <td className="px-4 py-2">{transaction.amount}</td>
                  <td className="px-4 py-2">{transaction.transactionType}</td>
                  <td className="px-4 py-2">{transaction.status}</td>
                  <td className="px-4 py-2">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionLog;
