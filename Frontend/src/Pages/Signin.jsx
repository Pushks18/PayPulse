import axios from "axios";
import BottomWarning from "../Components/BottomWarning";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import InputField from "../Components/InputField";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

function Signin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSignin = async () => {
    const res = await axios.post("http://localhost:3000/api/v1/user/signin", {
      username,
      password,
    });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      toast.success("You are signed in");
      navigate("/dashboard");
    } else {
      toast.error("Wrong credentials. Try again");
    }
  };
  return (
    <div className="">
      <div className="bg-gray-300 items-center justify-center flex h-[735px] ">
        <div className="bg-white w-[450px] flex flex-col items-center justify-center rounded-md p-6">
          <Heading text="Sign In" />
          <div className="flex items-center justify-center text-gray-500 mt-3 text-lg">
            Enter your credentials to access your account
          </div>

          <div className="flex flex-col justify-start space-y-4 mt-3">
            <div className="flex flex-col ">
              <InputField
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                label={"Username"}
                placeholder={"johdoe@example.com"}
              />
            </div>
            <div className="flex flex-col ">
              <InputField
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                label={"Password"}
                type={"password"}
                placeholder={""}
              />
            </div>
          </div>
          <div className="w-full flex justify-center mt-5">
            <Button onClick={handleSignin} button="Sign In" />
          </div>
          <div className="flex items-center justify-center mt-1">
            <BottomWarning
              label={"Don't have an account?"}
              buttonText={"Signup"}
              to={"/signup"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
