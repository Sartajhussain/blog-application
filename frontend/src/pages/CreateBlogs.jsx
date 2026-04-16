import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBlog } from "../redux/blogSlice";
import { useEffect } from "react";
import { API_BASE_URL } from "../utils/api";

const CreateBlogs = () => {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 SAFE SELECTOR (null-proof)
  const blog = useSelector((store) => store.blog.blog || []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getSelectedCategory = (e) => {
    setCategory(e.target.value);
  };

  const createBlogHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("FORM SUBMITTED");

    if (!title || !category) {
      toast.error("Title and category are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/blog`,
        { title, category },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setBlog([...blog, res.data.blog]));
        toast.success("Blog Created Successfully");
        navigate(`/dashboard/write-blog/${res.data.blog._id}`);
      } else {
        toast.error("Something went wrong");
      }

    } catch (error) {
      console.error("CREATE BLOG ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Error creating blog"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center pt-24 pb-24 md:pt-12 md:pb-12 md:ml-72 px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Let’s Create a Blog
        </h1>

        {/* Paragraph */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-8">
          Share your thoughts, ideas, and stories with the world. Fill in the details below to publish your blog.
         
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={createBlogHandler} noValidate>

          {/* Title Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Blog Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-gray-900 dark:text-white dark:bg-[rgba(255,255,255,0.08)] outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={getSelectedCategory}
              className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border border-[rgba(255,255,255,0.15)] text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Category</option>
              <option value="tech">Technology</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="education">Education</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gray-900 hover:bg-black transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Create Blog"
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateBlogs;
