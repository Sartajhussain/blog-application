import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FiInstagram,
    FiFacebook,
    FiLinkedin,
    FiGithub
} from "react-icons/fi";
import userimg from "../assets/userprofile.png";
import { API_BASE_URL } from "../utils/api";

const UserProfileModal = ({ isOpen, user, onClose }) => {
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchUserStats();
        }
    }, [isOpen, user]);

    const fetchUserStats = async () => {
        if (!user?._id) return;
        
        setLoading(true);
        try {
            console.log("Fetching stats for user:", user._id);
            
            let totalBlogs = 0;
            let totalComments = 0;
            
            // Try different blog endpoints
            let blogsRes = null;
            
            // Try 1: /api/v1/blog/user/:userId
            try {
                blogsRes = await axios.get(
                    `${API_BASE_URL}/api/v1/blog/user/${user._id}`,
                    { withCredentials: true }
                );
                console.log("Blogs from /user/:userId:", blogsRes.data);
            } catch (err) {
                console.log("Endpoint /user/:userId failed");
            }
            
            // Try 2: /api/v1/blog/my-blogs (current user only)
            if (!blogsRes?.data?.success) {
                try {
                    blogsRes = await axios.get(
                        `${API_BASE_URL}/api/v1/blog/my-blogs`,
                        { withCredentials: true }
                    );
                    console.log("Blogs from /my-blogs:", blogsRes.data);
                    
                    // Filter blogs by author if needed
                    if (blogsRes.data.success && blogsRes.data.blogs) {
                        const filteredBlogs = blogsRes.data.blogs.filter(
                            blog => blog.author?._id === user._id || blog.author === user._id
                        );
                        totalBlogs = filteredBlogs.length;
                        blogsRes.data.blogs = filteredBlogs;
                    }
                } catch (err) {
                    console.log("Endpoint /my-blogs failed");
                }
            }
            
            // Try 3: /api/v1/blog/author/:userId
            if (!blogsRes?.data?.success) {
                try {
                    blogsRes = await axios.get(
                        `${API_BASE_URL}/api/v1/blog/author/${user._id}`,
                        { withCredentials: true }
                    );
                    console.log("Blogs from /author/:userId:", blogsRes.data);
                } catch (err) {
                    console.log("Endpoint /author/:userId failed");
                }
            }
            
            if (blogsRes?.data?.success) {
                totalBlogs = blogsRes.data.blogs?.length || 0;
                
                // Fetch comments for each blog
                const blogs = blogsRes.data.blogs || [];
                for (const blog of blogs) {
                    try {
                        // Try different comment endpoints
                        let commentsRes = null;
                        
                        // Try 1: /api/v1/comment/blog/:blogId
                        try {
                            commentsRes = await axios.get(
                                `${API_BASE_URL}/api/v1/comment/blog/${blog._id}`,
                                { withCredentials: true }
                            );
                        } catch (err) {
                            console.log(`Comment endpoint /blog/${blog._id} failed`);
                        }
                        
                        // Try 2: /api/v1/comment/my-comments (current user)
                        if (!commentsRes?.data?.success) {
                            try {
                                commentsRes = await axios.get(
                                    `${API_BASE_URL}/api/v1/comment/my-comments`,
                                    { withCredentials: true }
                                );
                                if (commentsRes.data.success) {
                                    const userComments = commentsRes.data.comments.filter(
                                        comment => comment.blog === blog._id
                                    );
                                    totalComments += userComments.length;
                                }
                            } catch (err) {
                                console.log("Endpoint /my-comments failed");
                            }
                        }
                        
                        if (commentsRes?.data?.success && commentsRes.data.comments) {
                            totalComments += commentsRes.data.comments?.length || 0;
                        }
                    } catch (err) {
                        console.log(`Error fetching comments for blog ${blog._id}`);
                    }
                }
            }
            
            console.log("Final totals - Blogs:", totalBlogs, "Comments:", totalComments);
            
            setUserStats({
                totalBlogs: totalBlogs,
                totalComments: totalComments,
                totalViews: user.totalViews || 0,
                likes: user.likes || 0
            });
            
        } catch (error) {
            console.error("Error fetching user stats:", error);
            setUserStats({
                totalBlogs: 0,
                totalComments: 0,
                totalViews: user.totalViews || 0,
                likes: user.likes || 0
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-3xl px-4 md:px-6 py-6 md:py-8 relative text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-xl md:text-2xl text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition"
                >
                    &times;
                </button>

                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* LEFT SECTION */}
                    <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                        <img
                            src={user.profilePic || userimg}
                            alt="profile"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
                            onError={(e) => (e.target.src = userimg)}
                        />

                        <h2 className="text-lg md:text-2xl font-semibold mt-3 capitalize text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                        </h2>

                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 break-all">
                            <a href={`mailto:${user.email}`} className="hover:underline">
                                {user.email}
                            </a>
                        </p>

                        <div className="flex gap-3 mt-4 text-gray-700 dark:text-gray-300 text-lg md:text-xl">
                            {user.instagram && (
                                <a href={user.instagram} target="_blank" rel="noopener noreferrer" 
                                   className="hover:scale-110 transition-transform">
                                    <FiInstagram className="text-pink-500"/>
                                </a>
                            )}
                            {user.linkedin && (
                                <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                                   className="hover:scale-110 transition-transform">
                                    <FiLinkedin className="text-[#0A66C2]" />
                                </a>
                            )}
                            {user.github && (
                                <a href={user.github} target="_blank" rel="noopener noreferrer"
                                   className="hover:scale-110 transition-transform">
                                    <FiGithub className="text-black dark:text-white" />
                                </a>
                            )}
                            {user.facebook && (
                                <a href={user.facebook} target="_blank" rel="noopener noreferrer"
                                   className="hover:scale-110 transition-transform">
                                    <FiFacebook className="text-[#1877F2]"/>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="w-full md:w-2/3">
                        <h2 className="text-xl md:text-3xl font-bold capitalize text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                        </h2>

                        <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
                            {user.bio || "No bio available"}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
                            <div className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center transition hover:scale-105">
                                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                    {loading ? "..." : (userStats?.totalViews || 0)}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Views</p>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center transition hover:scale-105">
                                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                    {loading ? "..." : (userStats?.totalBlogs || 0)}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Blogs</p>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center transition hover:scale-105">
                                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                    {loading ? "..." : (userStats?.totalComments || 0)}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Comments</p>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center transition hover:scale-105">
                                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                    {userStats?.likes || 0}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Likes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;