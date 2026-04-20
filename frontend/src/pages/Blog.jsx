import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { setBlog } from "../redux/blogSlice";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import userimg from "../assets/userprofile.png";

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blog = useSelector((state) => state.blog?.blog || []);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH BLOGS ================= */
  const getOwnBlogs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/api/v1/blog/my-blogs`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setBlog(res.data.blogs || []));
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE BLOG ================= */
  const deleteBlogHandler = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

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
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("Blog deleted");

      const updatedBlogs = blog.filter((b) => b._id !== id);
      dispatch(setBlog(updatedBlogs));

    } catch (err) {
      toast.error("Error deleting blog");
    }
  };

  /* ================= IMAGE FALLBACK ================= */
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = userimg;
  };

  /* ================= USE EFFECT ================= */
  useEffect(() => {
    dispatch(setBlog([]));
    getOwnBlogs();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-5xl md:ml-[310px] mx-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-0 px-4 bg-gray-50 dark:bg-gray-900">

      <div className="max-w-5xl md:ml-[310px] mx-auto 
      bg-white/80 dark:bg-slate-800/80 
      backdrop-blur-md 
      p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Blogs
          </h1>
          <span className="text-xs text-gray-500">
            {blog.length} items
          </span>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 text-xs text-gray-500">
                <th className="py-2 px-3 text-left">Blog</th>
                <th className="py-2 px-3 text-left">Category</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {blog.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-xs text-gray-500">
                    No blogs found
                  </td>
                </tr>
              ) : (
                blog.map((b) => (
                  <tr
                    key={b._id}
                    className="border-b border-gray-100 dark:border-slate-700 
                    hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >

                    {/* BLOG */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">

                        <img
                          src={b.thumbnail || userimg}
                          alt={b.title}
                          className="w-10 h-10 object-cover rounded-md"
                          onError={handleImageError}
                        />

                        <div>
                          <p
                            onClick={() => navigate(`/view-blog/${b._id}`)}
                            className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer hover:underline line-clamp-1"
                          >
                            {b.title}
                          </p>

                          {/* <span className="text-[11px] text-gray-400">
                            #{b._id.slice(-6)}
                          </span> */}
                        </div>

                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="py-2 px-3 text-xs text-gray-500 capitalize">
                      {b.category}
                    </td>

                    {/* DATE */}
                    <td className="py-2 px-3 text-xs text-gray-400">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-2 px-3">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            navigate(`/dashboard/write-blog/${b._id}`)
                          }
                          className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                        >
                          <FiEdit2 size={14} />
                        </button>

                        <button
                          onClick={() => deleteBlogHandler(b._id)}
                          className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                        >
                          <FiTrash2 size={14} className="text-red-500" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-2">
          {blog.length === 0 ? (
            <p className="text-center text-xs text-gray-500">
              No blogs found
            </p>
          ) : (
            blog.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between gap-2 
                p-3 rounded-lg border border-gray-200 dark:border-slate-700 
                bg-white dark:bg-slate-800"
              >

                <div className="flex items-center gap-2 flex-1">

                  <img
                    src={b.thumbnail || userimg}
                    alt={b.title}
                    className="w-10 h-10 rounded-md object-cover"
                    onError={handleImageError}
                  />

                  <div className="flex-1">
                    <p
                      onClick={() => navigate(`/view-blog/${b._id}`)}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1"
                    >
                      {b.title}
                    </p>

                    <p className="text-[11px] text-gray-500">
                      {b.category} •{" "}
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>

                </div>

                <div className="flex gap-2">
                  <FiEdit2
                    size={14}
                    className="text-gray-600"
                    onClick={() =>
                      navigate(`/dashboard/write-blog/${b._id}`)
                    }
                  />
                  <FiTrash2
                    size={14}
                    className="text-red-500"
                    onClick={() => deleteBlogHandler(b._id)}
                  />
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