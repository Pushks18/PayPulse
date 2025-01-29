import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

// Register the necessary components of Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Visualization = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    barData: {
      labels: [],
      datasets: [],
    },
    pieData: {
      labels: [],
      datasets: [],
    },
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("No token found. Redirecting to login...");
      navigate("/signin");
      return;
    }

    const fetchTransactionData = async () => {
      setLoading(true);
      let decoded;

      try {
        decoded = jwtDecode(token); // Decode the token
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Failed to decode token. Please log in again.");
        setLoading(false);
        return;
      }

      const userId = decoded.userId;
      try {
        const response = await axios.get(
          `https://paypulse.onrender.com/api/v1/transaction/history?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const transactions = response.data;

        if (transactions.length === 0) {
          setError("No transactions found.");
        } else {
          const barChartData = prepareBarChartData(transactions);
          const pieChartData = preparePieChartData(transactions);
          setChartData({
            barData: barChartData,
            pieData: pieChartData,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setError("Failed to fetch transactions. Please try again.");
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [token, navigate]);

  // Prepare data for the Bar Chart
  const prepareBarChartData = (transactions) => {
    const dates = [];
    const credits = [];
    const debits = [];

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!dates.includes(date)) {
        dates.push(date);
        credits.push(0);
        debits.push(0);
      }

      const index = dates.indexOf(date);
      if (transaction.transactionType === "wallet-to-user") {
        credits[index] += transaction.amount;
      } else {
        debits[index] += transaction.amount;
      }
    });

    return {
      labels: dates,
      datasets: [
        {
          label: "Credits",
          data: credits,
          backgroundColor: "rgba(0, 123, 255, 0.5)",
          borderColor: "rgba(0, 123, 255, 1)",
          borderWidth: 1,
        },
        {
          label: "Debits",
          data: debits,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for the Pie Chart
  const preparePieChartData = (transactions) => {
    const credits = transactions
      .filter((transaction) => transaction.transactionType === "wallet-to-user")
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const debits = transactions
      .filter((transaction) => transaction.transactionType === "user-to-user")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    return {
      labels: ["Credits", "Debits"],
      datasets: [
        {
          data: [credits, debits],
          backgroundColor: [
            "rgba(0, 123, 255, 0.5)",
            "rgba(255, 99, 132, 0.5)",
          ],
          borderColor: ["rgba(0, 123, 255, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    };
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
    <div className="bg-gray-900 text-white">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-6">Data Visualization</h1>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex flex-col sm:flex-row justify-between space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-[48%] mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Daily Credit vs Debit
            </h2>
            <Bar
              data={chartData.barData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: {
                      color: "white",
                    },
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                      color: "white",
                    },
                    ticks: {
                      color: "white",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Amount",
                      color: "white",
                    },
                    ticks: {
                      color: "white",
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-full sm:w-[48%] mb-6 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Credits vs Debits</h2>
            <Pie
              data={chartData.pieData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: "white",
                    },
                  },
                  title: {
                    display: true,
                    text: "Credits vs Debits Proportions",
                    color: "white",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
