import React from "react";
import Heading from "./Heading";
import ProfileIcon from "./ProfileIcon";
import Button from "./Button";

const Modal = ({ to }) => {
  return (
    <div>
      <div className="bg-gray-300 h-[735px] items-center justify-center flex">
        <div className="bg-white flex flex-col  w-[400px]">
          <div className="flex justify-center items-center">
            <Heading text={"Send Money"} />
          </div>

          <div className="flex space-x-2 mt-10 justify-start items-start ml-4">
            <div>
              <ProfileIcon />
            </div>

            <div className="font-semibold text-2xl">{to}Friend's Name</div>
          </div>
          <div className="font-semibold text-lg ml-6 mt-3">Amount (in Rs)</div>
          <div className="ml-6 mt-3 mb-5">
            <input
              type="number"
              placeholder="Enter amount"
              className="w-[350px] rounded-md border border-b-2 border-gray-300 p-2 "
            />
          </div>
          <div className="mb-9">
            <Button text={"Send Money"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
