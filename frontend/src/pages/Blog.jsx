import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { setBlog } from "../redux/blogSlice";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import userimg from "../assets/userprofile.png";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBlog } from "../redux/blogSlice";
import { API_BASE_URL } from "../utils/api";
const Blog = () => {
  const dispatch = useDispatch();

  const blog = useSelector((state) => state.blog?.blog || []);
  const navigate = useNavigate();

  // ✅ FETCH BLOGS
  const getOwnBlogs = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/blog/my-blogs`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setBlog(res.data.blogs || []));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ DELETE BLOG
  const deleteBlogHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/blog/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Blog not found");
        return;
      }

      toast.success(data.message || "Blog deleted successfully");

      const updatedBlogs = blog.filter((b) => b._id !== id);
      dispatch(setBlog(updatedBlogs));

    } catch (err) {
      toast.error("Error deleting blog");
    }
  };

  // ✅ SAFE IMAGE HANDLER (NO LOOP ERROR)
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = userimg;
  };

  useEffect(() => {
    getOwnBlogs();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-0 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl md:ml-[310px] mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Blog List
        </h1>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {blog.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    No blogs found
                  </td>
                </tr>
              ) : (
                blog.map((b) => (
                  <tr
                    key={b._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">

                        {/* ✅ IMAGE FIX (SAFE) */}
                        <img
                          src={b.thumbnail || userimg}
                          alt={b.title}
                          className="w-14 h-14 object-cover rounded-lg"
                          onError={handleImageError}
                        />

                        <span
                          className="font-medium capitalize hover:underline cursor-pointer"
                          onClick={() => navigate(`/view-blog/${b._id}`)}
                        >
                          {b.title}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 capitalize">
                      {b.category}
                    </td>

                    <td className="py-4 px-4">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex gap-3">

                        {/* EDIT */}
                        <button
                          className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md hover:bg-black transition flex items-center gap-1"
                          onClick={() =>
                            navigate(`/dashboard/write-blog/${b._id}`)
                          }
                        >
                          <FiEdit2 size={14} /> Edit
                        </button>

                        {/* DELETE */}
                        <button
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-1"
                          onClick={() => deleteBlogHandler(b._id)}
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARD VIEW ================= */}
        <div className="md:hidden space-y-4">
          {blog.length === 0 ? (
            <p className="text-center text-gray-500">
              No blogs found
            </p>
          ) : (
            blog.map((b) => (
              <div
                key={b._id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow"
              >
                <div className="flex gap-4">

                  <img
                    src={b.thumbnail || userimg}
                    alt={b.title}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={handleImageError}
                  />

                  <div className="flex-1">
                    <h2
                      className="font-semibold capitalize cursor-pointer hover:underline"
                      onClick={() => navigate(`/view-blog/${b._id}`)}
                    >
                      {b.title}
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {b.category}
                    </p>

                    <p className="text-sm text-gray-500">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">

                  <button
                    className="flex-1 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-black transition flex items-center justify-center gap-1"
                    onClick={() =>
                      navigate(`/dashboard/write-blog/${b._id}`)
                    }
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>

                  <button
                    className="flex-1 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center justify-center gap-1"
                    onClick={() => deleteBlogHandler(b._id)}
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Blog;