import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiSearch,
} from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";
import userimg from "../assets/userprofile.png";

const AllUserProfile = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch users
  const getUsers = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/user/all-users`,
        { withCredentials: true }
      );
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedUser]);

  // 🔥 FILTER USERS (SEARCH)
  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-10">

      {/* HEADER */}
      <h2 className="text-4xl pt-20 font-bold text-center text-gray-900 dark:text-white mb-6">
        Total Author's: {filteredUsers.length}
        <hr className="w-1/3 border-t-4 border-gray-600 mx-auto mt-4" />
      </h2>

      {/* 🔥 SEARCH BAR */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">

          <FiSearch className="absolute left-3 top-3 text-gray-500" />

          <input
            type="text"
            placeholder="Search user by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full 
            border bg-white dark:bg-gray-800 
            text-gray-800 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-black"
          />

        </div>
      </div>

      {/* USERS GRID */}
      <div className="
        grid 
        grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-4 md:gap-6 pb-10
      ">

        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className="flex flex-col items-center gap-2 p-3 
            bg-white dark:bg-gray-800 rounded-xl shadow 
            hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={user.profilePic || userimg}
              alt={user.firstName}
              className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover border"
              onError={(e) => (e.target.src = userimg)}
            />

            <p className="text-sm font-semibold text-center capitalize text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </p>
          </div>
        ))}

      </div>

      {/* MODAL (same as yours, unchanged) */}
     {isModalOpen && selectedUser && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-3">
    
    <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl p-6 md:p-10 relative">

      {/* Close Button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 text-2xl font-bold"
      >
        &times;
      </button>

      <div className="flex flex-col md:flex-row gap-10">

        {/* LEFT */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">

          <div className="relative">
            <img
              src={selectedUser.profilePic || userimg}
              alt="profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-200 dark:border-slate-600 object-cover"
              onError={(e) => (e.target.src = userimg)}
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4 capitalize">
            {selectedUser.firstName} {selectedUser.lastName}
          </h2>

          {/* ✅ FIXED EMAIL LINK */}
          <a
            href={`mailto:${selectedUser.email}`}
            className="text-sm text-gray-500 dark:text-gray-400 mt-1 hover:underline"
          >
            {selectedUser.email}
          </a>

          {/* SOCIALS */}
          <div className="flex gap-4 mt-5">
            {[
              { icon: FiInstagram, url: selectedUser.instagram },
              { icon: FiLinkedin, url: selectedUser.linkedin },
              { icon: FiGithub, url: selectedUser.github },
              { icon: FiFacebook, url: selectedUser.facebook },
            ].map(
              (item, i) =>
                item.url && (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                  >
                    <item.icon />
                  </a>
                )
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-2/3 text-center md:text-left">

          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
            {selectedUser.firstName} {selectedUser.lastName || "User"}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed capitalize">
            {selectedUser.bio || "No bio available."}
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

            <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedUser.totalViews || 0}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Views
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedUser.totalBlogs || 0}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Blogs
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedUser.comments || 0}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Comments
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedUser.likes || 0}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Likes
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AllUserProfile;