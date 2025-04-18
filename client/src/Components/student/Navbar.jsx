import React, { useContext } from "react";
import { assets } from "../../assets/assets"; // Ensure the path to assets is correct
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    console.error("AppContext is not provided. Ensure AppContext.Provider wraps this component.");
    return null; // Render nothing if context is missing
  }

  const { navigate, isEducator, setIsEducator, getToken } = appContext;
  const location = useLocation(); // Correctly retrieve location
  const isCourseListPage = location.pathname.includes("courses-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(
        "http://localhost:7474/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between h-20 px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src="/src/assets/Skillfy_logo-removebg-preview.svg"
        alt=""
        className="w-auto h-20 object-cover bg-no-repeat"
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div>
          {user && (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |
              <Link to="/my-enrollments">My enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>
      {/* for phone screen */}
      <div className="md:hidden flex items-center gap-5 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-2 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |
              <Link to="/my-enrollments">My enrollments</Link>
            </>
          )}{" "}
        </div>
        {/* Corrected path here */}
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
