import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { setBlog } from "../redux/blogSlice"; // ✅ FIX 1 (MISSING IMPORT)

const Blog = () => {
  const dispatch = useDispatch();

  // ✅ FIX 2 (SAFE STATE)
  const blog = useSelector((state) => state.blog?.blog || []);

  const navigate = useNavigate();

  // ✅ FETCH BLOGS
  const getOwnBlogs = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/blog/my-blogs`,
        { withCredentials: true }
      );

      console.log("MY BLOGS RESPONSE:", res.data);

      if (res.data?.success) {
        const blogsData = res.data.blogs || res.data.blog || [];

        dispatch(setBlog(blogsData));
      }
    } catch (error) {
      console.log("GET BLOG ERROR:", error);
      toast.error("Failed to load blogs");
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

  useEffect(() => {
    getOwnBlogs();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-0 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl md:ml-[310px] mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Blog List
        </h1>

        {/* DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr>
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
                  <tr key={b._id}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={b.thumbnail}
                          alt={b.title}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <span
                          className="font-medium cursor-pointer hover:underline"
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
                      <button
                        onClick={() =>
                          navigate(`/dashboard/write-blog/${b._id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteBlogHandler(b._id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default Blog;