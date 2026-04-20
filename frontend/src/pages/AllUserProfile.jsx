import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiGithub,
  FiSearch,
} from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";
import userimg from "../assets/userprofile.png";
import UserProfileModal from "../components/UserProfileModal"; // ✅ Import modal

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

      {/* ✅ MODAL - Using separate component */}
      <UserProfileModal 
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AllUserProfile;