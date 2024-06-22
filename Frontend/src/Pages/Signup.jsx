import { useContext, useState } from "react";
import BottomWarning from "../Components/BottomWarning";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import InputField from "../Components/InputField";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const res = await axios.post(
      "https://paypulse.onrender.com/api/v1/user/signup",
      {
        firstName,
        lastName,
        username,
        password,
      }
    );
    // console.log(res.data);
    localStorage.setItem("token", res.data.token);
    setFirstName(res.data.firstName);
    navigate("/dashboard");
  };
  return (
    <div className="">
      <div className="bg-gray-300 items-center justify-center flex h-[735px] ">
        <div className="bg-white w-[400px] flex flex-col items-center justify-center rounded-md p-6">
          <Heading text="Sign Up" />
          <div className="flex items-center justify-center text-gray-500 mt-3 text-lg">
            Enter your information to create an account
          </div>

          <div className="flex flex-col justify-start space-y-4 mt-3">
            <div className="flex flex-col ">
              <InputField
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                label={"First Name"}
                type={"text"}
                placeholder={"John"}
              />
            </div>
            <div className="flex flex-col ">
              <InputField
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                label={"Last Name"}
                type={"text"}
                placeholder={"Doe"}
              />
            </div>
            <div className="flex flex-col ">
              <InputField
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                label={"Email"}
                type={"email"}
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
            <Button onClick={handleSignup} button="Sign Up" />
          </div>
          <div className="flex items-center justify-center mt-1">
            <BottomWarning
              label={"Already have an account?"}
              buttonText={"Signin"}
              to={"/signin"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
