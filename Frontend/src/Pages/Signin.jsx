import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import BottomWarning from "../Components/BottomWarning";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import InputField from "../Components/InputField";

function Signin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignin = async () => {
    try {
      const res = await axios.post(
        "https://paypulse.onrender.com/api/v1/users/signin",
        { username, password }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("You are signed in");
        navigate("/dashboard");
      } else {
        toast.error("Wrong credentials. Try again");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("Sign-in failure. Try again");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="w-full max-w-md p-6 bg-black/60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800">
        <Heading text="Sign In" />
        <p className="text-gray-300 mt-2 text-sm md:text-lg">
          Enter your credentials to access your account
        </p>
        <div className="space-y-4 mt-4">
          <InputField
            onChange={(e) => setUsername(e.target.value)}
            label="Username"
            type="email"
            placeholder="johndoe@example.com"
            className="text-white bg-gray-800"
          />
          <div className="flex items-center space-x-2">
            <InputField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type={showPassword ? "text" : "password"}
              className="text-white bg-gray-800 flex-grow"
            />
            <button
              onClick={toggleShowPassword}
              className="text-sm text-white bg-gray-700 hover:bg-gray-600 mt-8 px-2 py-1 rounded transition-colors duration-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex justify-center mt-5">
            <Button onClick={handleSignin} text="Sign In" />
          </div>
          <BottomWarning
            label="Don't have an account?"
            buttonText="Signup"
            to="/signup"
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Signin;
