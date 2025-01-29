import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomWarning from "../Components/BottomWarning";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import InputField from "../Components/InputField";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        "https://paypulse.onrender.com/api/v1/users/signup",
        {
          firstName,
          lastName,
          username,
          password,
        }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="w-full max-w-md p-6 bg-black/60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800">
        <Heading text="Sign Up" />
        <p className="text-gray-300 mt-2 text-sm md:text-lg">
          Enter your information to create an account
        </p>
        <div className="space-y-4 mt-4">
          <InputField
            onChange={(e) => setFirstName(e.target.value)}
            label="First Name"
            type="text"
            placeholder="John"
            className="text-white bg-gray-800"
          />
          <InputField
            onChange={(e) => setLastName(e.target.value)}
            label="Last Name"
            type="text"
            placeholder="Doe"
            className="text-white bg-gray-800"
          />
          <InputField
            onChange={(e) => setUsername(e.target.value)}
            label="Email"
            type="email"
            placeholder="johndoe@example.com"
            className="text-white bg-gray-800"
          />
          <div className="flex items-center">
            <InputField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              className="text-white bg-gray-800 flex-grow"
            />
            <button
              onClick={toggleShowPassword}
              className="ml-2 text-sm text-white bg-gray-700 hover:bg-gray-600 mt-8 px-2 py-1 rounded transition-colors duration-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Button onClick={handleSignup} text="Sign Up" />
        </div>
        <BottomWarning
          label="Already have an account?"
          buttonText="Sign In"
          to="/signin"
        />
      </div>
    </div>
  );
}

export default Signup;
