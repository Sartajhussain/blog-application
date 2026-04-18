import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
    FiInstagram,
    FiFacebook,
    FiLinkedin,
    FiGithub
} from "react-icons/fi";
import { useSelector } from "react-redux";
import Autoplay from "embla-carousel-autoplay";

import backgroundimg from "../assets/background-dark.jpg";
import userimg from "../assets/userprofile.png";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";

import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

const AllUser = () => {
    const navigate = useNavigate();

    const plugin = useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: false,
        })
    );

    const { user } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // ✅ FIXED API CALL
    const getUsers = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/api/v1/user/all-users`,
                { withCredentials: true }
            );

            if (data?.success) {
                setUsers(data.users || []);
            }
        } catch (error) {
            console.log("GET USERS ERROR:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div
            style={{
                backgroundImage: `url(${backgroundimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="min-h-screen py-10"
        >
            <div className="w-full md:max-w-6xl mx-auto py-10 px-4">

                <h2 className="text-4xl md:text-5xl font-bold text-gray-100 text-center py-10">
                    Our Authors
                    <hr className="w-1/2 md:w-1/3 border-t-4 border-gray-600 mx-auto mt-4" />
                </h2>

                {/* CAROUSEL */}
                <Carousel
                    plugins={[plugin.current]}
                    opts={{ align: "start", loop: true }}
                    className="w-full overflow-hidden"
                >
                    <CarouselContent className="-ml-2">

                        {users.map((u) => (
                            <CarouselItem
                                key={u._id}
                                className="basis-full sm:basis-1/2 md:basis-1/3 pl-2"
                            >
                                <div
                                    onClick={() => handleUserClick(u)}
                                    className="flex flex-col items-center gap-2 p-4 
                  bg-white dark:bg-gray-900 rounded-xl shadow 
                  hover:shadow-lg transition cursor-pointer"
                                >
                                    <img
                                        src={u?.profilePic || userimg}
                                        alt={u?.firstName}
                                        className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full object-cover border"
                                        onError={(e) => (e.target.src = userimg)}
                                    />

                                    <p className="text-sm font-semibold capitalize text-center">
                                        {u.firstName} {u.lastName}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}

                    </CarouselContent>

                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                </Carousel>

                <h2
                    className="flex justify-center mt-6 text-sm cursor-pointer underline text-white"
                    onClick={() => navigate("/AllUserProfile")}
                >
                    View All User Profile
                </h2>
            </div>

            {/* MODAL */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-3xl px-6 py-8 relative text-gray-900 dark:text-white">

                        {/* CLOSE */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-2xl text-gray-700 dark:text-white"
                        >
                            &times;
                        </button>

                        <div className="flex flex-col md:flex-row gap-10">

                            {/* LEFT */}
                            <div className="w-full md:w-1/3 flex flex-col items-center text-center">

                                <img
                                    src={selectedUser.profilePic || userimg}
                                    alt="profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
                                    onError={(e) => (e.target.src = userimg)}
                                />

                                <h2 className="text-2xl font-semibold mt-4 capitalize text-gray-900 dark:text-white">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </h2>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <a href={`mailto:${selectedUser.email}`}>
                                        {selectedUser.email}
                                    </a>
                                </p>

                                {/* SOCIALS */}
                                <div className="flex gap-4 mt-5 text-gray-700 dark:text-gray-300 text-xl">

                                    {selectedUser.instagram && (
                                        <a href={selectedUser.instagram} target="_blank">
                                            <FiInstagram />
                                        </a>
                                    )}

                                    {selectedUser.linkedin && (
                                        <a href={selectedUser.linkedin} target="_blank">
                                            <FiLinkedin />
                                        </a>
                                    )}

                                    {selectedUser.github && (
                                        <a href={selectedUser.github} target="_blank">
                                            <FiGithub />
                                        </a>
                                    )}

                                    {selectedUser.facebook && (
                                        <a href={selectedUser.facebook} target="_blank">
                                            <FiFacebook />
                                        </a>
                                    )}

                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="w-full md:w-2/3">

                                <h2 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </h2>

                                <p className="mt-4 text-gray-600 dark:text-gray-300">
                                    {selectedUser.bio || "No bio available"}
                                </p>

                                {/* STATS */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {selectedUser.totalViews || 0}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">Total Views</p>
                                    </div>

                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {selectedUser.totalBlogs || 0}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">Blogs</p>
                                    </div>

                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {selectedUser.comments || 0}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">Comments</p>
                                    </div>

                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {selectedUser.likes || 0}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">Likes</p>
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

export default AllUser;