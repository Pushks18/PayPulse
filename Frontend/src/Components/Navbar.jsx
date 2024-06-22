import React, { useContext, useEffect } from "react";
import Heading from "./Heading";
import ProfileIcon from "./ProfileIcon";

const Navbar = ({ title }) => {
  return (
    <div>
      <div className="bg-white">
        <div className="flex justify-between">
          <div>
            <Heading text={title} />
          </div>
          <div className="flex">
            <div className="font-semibold text-lg mt-9 mr-2">Hello</div>
            <div className="mt-8 mr-2">
              <ProfileIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
