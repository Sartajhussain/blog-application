import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/authSlice.js";
import {
  FiSearch,
  FiHome,
  FiBookOpen,
  FiInfo,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiPlus,
  FiUser,
} from "react-icons/fi";
import logo from "/src/assets/favIcons.png";
import userimg from "../assets/userprofile.png";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { setUser } from "../redux/authSlice.js";
import { toggleTheme } from "../redux/themeSlice.js";
import { Button } from "../components/ui/button";
import { useLocation } from "react-router-dom";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { BellRingIcon, Combine, CompassIcon, LogOut, MessageCircle, Text, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchResults =
    search.trim() === ""
      ? []
      : blog?.filter((b) =>
        b.title?.toLowerCase().includes(search.toLowerCase())
      );
  const handleClick = (id) => {
    setSearch("");          // 🔥 dropdown hide
    navigate(`/view-blog/${id}`);
  };
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const Logout = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(logoutUser());   // ✅ update redux state
        navigate("/");            // redirect
        toast.success("Logged out successfully");
      }

    } catch (error) {
      console.log("Logout Error:", error);
      console.log("Response:", error?.response);
      console.log("Data:", error?.response?.data);

      toast.error(error?.response?.data?.message || "Error logging out");
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full  fixed top-0 left-0 py-2 bg-white dark:bg-gray-800 border-b z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">

          {/* Logo + Search */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="w-10 h-10" />
              <span className="ml-2 text-xl font-bold dark:text-white">
                MyBlog
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="relative block">

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[150px] md:w-auto pl-10 pr-4 py-1 border rounded-full focus:ring-2 focus:ring-gray-500"
              />

              <FiSearch className="absolute left-3 top-2.5 w-5 h-4 text-gray-500" />

              {/* SEARCH RESULTS */}
              {search && searchResults?.length > 0 && (
                <div
                  className="
absolute mt-2 z-50
left-1/2 -translate-x-1/2 w-[90vw]  
md:left-0 md:translate-x-0 md:w-[300px]
bg-white dark:bg-gray-800 
shadow-lg rounded-lg overflow-hidden 
border border-gray-200 dark:border-gray-700
"
                >

                  {searchResults.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleClick(item._id)}
                      className="flex items-center gap-3 p-3 cursor-pointer
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-10 h-10 rounded object-cover"
                      />

                      <p className="text-sm font-medium line-clamp-1 
        text-gray-800 dark:text-gray-200">
                        {item.title}
                      </p>
                    </div>
                  ))}

                </div>
              )}

            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">

            <Link to="/" className="flex items-center gap-1 hover:text-blue-600">
              <FiHome /> Home
            </Link>

            <Link
              to="/blogs"
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <FiBookOpen /> Blog's
            </Link>

            <Link
              to="/blog-feed"
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <FiBookOpen /> Public Feed
            </Link>

            <Link to="/about" className="flex items-center gap-1 hover:text-blue-600">
              <FiInfo /> About
            </Link>

            {/* Theme Toggle */}
            <div className="relative group flex items-center">

              {/* Toggle Button */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer 
    transition-colors duration-300
    ${theme === "light" ? "bg-gray-500" : "bg-black"}
    `}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md 
      transform transition-transform duration-300
      ${theme === "light" ? "translate-x-0" : "translate-x-5"}
      `}
                />
              </button>

              {/* Tooltip */}
              <span
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 
    text-[10px] px-2 py-1 rounded-md 
    bg-black text-white 
    opacity-0 group-hover:opacity-100 
    transition-opacity duration-200 whitespace-nowrap"
              >
                {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              </span>

            </div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="" className="p-0 bg-transparent hover:bg-transparent">
                      <img
                        src={user?.profilePic || userimg}
                        alt="user"
                        className="w-8 h-8 rounded-full cursor-pointer object-cover 
          ring-2 ring-gray-300 dark:ring-slate-600 
          hover:ring-black dark:hover:ring-white 
          transition"
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 
      bg-white dark:bg-slate-900 
      border border-gray-200 dark:border-slate-700 
      shadow-xl rounded-xl 
      text-gray-800 dark:text-gray-200"
                  >
                    <DropdownMenuLabel className="text-gray-900 dark:text-white font-semibold">
                      My Account
                    </DropdownMenuLabel>

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="cursor-pointer 
          hover:bg-gray-100 dark:hover:bg-slate-800 
          rounded-md transition"
                        onClick={() => navigate("/dashboard/profile")}
                      >
                        Profile
                        <DropdownMenuShortcut>
                          <User />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer 
          hover:bg-gray-100 dark:hover:bg-slate-800 
          rounded-md transition"
                        onClick={() => navigate("/dashboard/blog")}
                      >
                        Your Blogs
                        <DropdownMenuShortcut>
                          <BellRingIcon />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer 
          hover:bg-gray-100 dark:hover:bg-slate-800 
          rounded-md transition"
                        onClick={() => navigate("/dashboard/comments")}
                      >
                        Comments
                        <DropdownMenuShortcut>
                          <Combine />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer 
          hover:bg-gray-100 dark:hover:bg-slate-800 
          rounded-md transition"
                        onClick={() => navigate("/dashboard/create-blogs")}
                      >
                        Create Blog
                        <DropdownMenuShortcut>
                          <Text />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-700" />

                    <DropdownMenuItem
                      className="cursor-pointer 
        text-red-600 dark:text-red-400
        hover:bg-red-50 dark:hover:bg-red-900/30 
        rounded-md transition"
                      onClick={Logout}
                    >
                      Log out
                      <DropdownMenuShortcut>
                        <LogOut />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/signup">
                  <button className="bg-black text-sm text-white px-4 py-2 rounded-full cursor-pointer">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login">
                  <button className="bg-black text-sm text-white px-4 py-2 rounded-full cursor-pointer">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(true)}>
              <FiMenu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* mobile view navbar */}
      {/* 🔥 Mobile Bottom Navigation - App Style */}
      {/* 📱 Android Style Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full md:hidden bg-white dark:bg-gray-900 border-t shadow-lg z-50">

        <div className="flex justify-around items-center py-2">

          {/* Home */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <div className="flex flex-col items-center text-[11px]">

              <div className={`p-2 rounded-full transition
        ${isActive("/") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                <FiHome className="text-2xl" />
              </div>

              <span className="text-gray-600 dark:text-gray-300">Home</span>
            </div>
          </Link>

          {/* Blogs */}
          <Link to={user ? "/blogs" : "/login"} onClick={() => window.scrollTo(0, 0)}>
            <div className="flex flex-col items-center text-[11px]">

              <div className={`p-2 rounded-full transition
        ${isActive("/blogs") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                <FiBookOpen className="text-2xl" />
              </div>

              <span className="text-gray-600 dark:text-gray-300">Blogs</span>
            </div>
          </Link>

          {/* Create Button */}
          {user && (
            <Link
              to="/dashboard/create-blogs"
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="relative -top-7 bg-[oklch(0.71_0.2_46.45)] text-white p-4 rounded-full shadow-xl">
                <FiPlus className="text-2xl" />
              </div>
            </Link>
          )}

          {/* Feed */}
          <Link to={user ? "/blog-feed" : "/login"} onClick={() => window.scrollTo(0, 0)}>
            <div className="flex flex-col items-center text-[11px]">

              <div className={`p-2 rounded-full transition
        ${isActive("/blog-feed") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                <FiBookOpen className="text-2xl" />
              </div>

              <span className="text-gray-600 dark:text-gray-300">Feed</span>
            </div>
          </Link>

          {/* Profile */}
          {user ? (
            <Link to="/dashboard/profile">
              <div className="flex flex-col items-center text-[11px]">

                <div className={`p-2 rounded-full transition
          ${isActive("/dashboard/profile") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                  <img
                    src={user?.profilePic || userimg}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </div>

                <span className="text-gray-600 dark:text-gray-300">Profile</span>
              </div>
            </Link>
          ) : (
            <Link to="/login">
              <div className="flex flex-col items-center text-[11px]">

                <div className={`p-2 rounded-full transition
          ${isActive("/login") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                  <FiUser className="text-2xl" />
                </div>

                <span className="text-gray-600 dark:text-gray-300">Login</span>
              </div>
            </Link>
          )}

        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-[#000000ad] bg-opacity-40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      ></div>

      {/* 📱 Mobile App Style Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-50 
  transform transition-transform duration-300 shadow-2xl
  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">

          <div className="flex items-center gap-3"
            onClick={() => {
              setIsOpen(false);
              navigate(user ? "/dashboard/profile" : "/login");
            }}

          >
            <img
              src={user?.profilePic || userimg}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold text-sm">
                {user
                  ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.name
                  : "Guest User"}
              </p>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${user?.email}`}
                  className="text-xs text-gray-500 hover:underline truncate max-w-[160px]"
                >
                  {user?.email}
                </a>
              </div>
            </div>
          </div>

          <button onClick={() => setIsOpen(false)}>
            <FiX className="w-6 h-6" />
          </button>

        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 p-4">

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <FiHome />
            </div>
            Home
          </Link>

          <Link
            to="/dashboard/blog"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <FiBookOpen />
            </div>
            Blogs
          </Link>

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg
            
            
            hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <FiInfo />
            </div>
            About
          </Link>
          <Link
            to="/comments"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg
            
            
            hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <MessageCircle />
            </div>
            Comments
          </Link>

          {/* Theme */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {theme === "light" ? <FiSun /> : <FiMoon />}
            </div>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          {/* Auth */}
          {!user ? (
            <>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-lg bg-black text-white text-center"
              >
                Sign Up
              </Link>

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-lg border text-center"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={Logout}
              className="mt-3 p-3 rounded-lg bg-[oklch(0.71_0.2_46.45)] text-white"
            >
              Logout
            </button>
          )}
        </div>
      </div>


    </>
  );
};

export default Navbar;