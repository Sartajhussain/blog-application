import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
import UserProfileModal from "../components/UserProfileModal"; // ✅ Import modal

const AllUser = () => {
    const navigate = useNavigate();

    const plugin = useRef(
        Autoplay({
            delay: 6000,
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
            className="min-h-[250px] md:min-h-screen py-6 md:py-10"
        >
            <div className="w-full md:max-w-6xl mx-auto py-0 md:py-10 px-4">

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

            {/* ✅ MODAL - Now a separate component */}
            <UserProfileModal 
                isOpen={isModalOpen}
                user={selectedUser}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default AllUser;