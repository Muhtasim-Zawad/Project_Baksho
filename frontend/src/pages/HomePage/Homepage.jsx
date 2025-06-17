import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div>
      <Link to={"/login"}>
        <button className=" p-2 border-2 rounded-md">Login</button>
      </Link>
      <Link to={"/register"}>
        <button className="p-2 rounded-md border-2">Register</button>
      </Link>
    </div>
  );
};

export default Homepage;
