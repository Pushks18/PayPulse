import { BrowserRouter, Route, Routes } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import socket from "./socket";
import { useEffect } from "react";
import Navbar from "./Components/Navbar"; // Ensure Navbar is imported
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Dashboard from "./Pages/Dashboard";
import SendMoney from "./Pages/SendMoney";
import Landing from "./Pages/Landing";
import AddFunds from "./Pages/AddFunds";
import Notification from "./Components/Notification";
import Visualization from "./Pages/Visualization";
import TransactionLog from "./Pages/TransactionLog";
import ErrorPage from "./Pages/ErrorPage";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // console.log("Connecting to WebSocket...");
      socket.connect();
      socket.emit("authenticate", { token });
      socket.on("connect", () => {});
      socket.on("balance-update", (data) => {
        if (data && data.message) {
          toast.custom(<Notification message={data.message} />);
        }
      });
      socket.on("disconnect", () => {});
      return () => socket.disconnect();
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/send"
            element={
              <>
                <Navbar />
                <SendMoney />
              </>
            }
          />
          <Route
            path="/add-funds"
            element={
              <>
                <Navbar />
                <AddFunds />
              </>
            }
          />
          <Route
            path="/visualization"
            element={
              <>
                <Navbar />
                <Visualization />
              </>
            }
          />
          <Route
            path="/transaction-log"
            element={
              <>
                <Navbar />
                <TransactionLog />
              </>
            }
          />
          <Route
            path="/error"
            element={
              <>
                <Navbar />
                <ErrorPage />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
