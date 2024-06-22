import Heading from "../Components/Heading";
import HorizontalLine from "../Components/HorizontalLine";
import Navbar from "../Components/Navbar";
import SearchBar from "../Components/SearchBar";
import Button from "../Components/Button";
import UserComponent from "../Components/UserComponent";
import Modal from "../Components/Modal";
import { useEffect, useState } from "react";
import axios from "axios";
import Balance from "../Components/Balance";

function Dashboard() {
  return (
    <div>
      <div className="bg-white space-y-4 space-x-4">
        <div className="ml-4">
          <Navbar title={"Payments App"} />
        </div>
        <div>
          <Balance />
        </div>
        <div>
          <HorizontalLine />
        </div>

        {/* <div className="">
          <SearchBar />
        </div> */}

        <div className="space-y-5 mt-3">
          <UserComponent />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
