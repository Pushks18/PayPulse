import React from "react";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={navigate("/signup")} button={"Sign Up"} />
    </div>
  );
};

export default Landing;
