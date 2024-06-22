import React from "react";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import Heading from "../Components/Heading";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">
        <Heading text={"Pay Pulse"} />
      </div>
      <div className="mt-20">
        <Button onClick={() => navigate("/signup")} button={"Get Started"} />
      </div>
    </div>
  );
};

export default Landing;
