import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loader2 } from "lucide-react";

const Comments = () => {
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/api/v1/comment/all?page=${page}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setAllComments(res.data.comments || []);
        setTotalPages(res.data.totalPages || 1);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page]);

  return (
    <div className="min-h-screen mt-10 rounded-2xl pt-20 md:ml-[300px] p-4 md:p-8 
    bg-gray-50 dark:bg-slate-950">

      <h2 className="text-lg md:text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        All Blog's Comments
      </h2>

      <div className="bg-white dark:bg-slate-900 
      border border-gray-200 dark:border-slate-700 
      rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-6 flex flex-col items-center justify-center gap-2 text-gray-500">

            <Loader2 className="w-5 h-5 animate-spin" />

            <p className="text-xs">Loading comments...</p>

          </div>
        ) : allComments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No comments found
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Blog</th>
                  <th className="px-4 py-3 text-left font-medium">User</th>
                  <th className="px-4 py-3 text-left font-medium">Comment</th>
                  <th className="px-4 py-3 text-center font-medium">View</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">

                {allComments.map((comment) => (
                  <tr
                    key={comment._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >

                    {/* BLOG */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">

                        <img
                          src={
                            comment.blog?.thumbnail
                              ? comment.blog.thumbnail.startsWith("http")
                                ? comment.blog.thumbnail
                                : `${API_BASE_URL}/${comment.blog.thumbnail}`
                              : "https://via.placeholder.com/100"
                          }
                          alt="blog"
                          className="w-10 h-10 rounded-md object-cover"
                        />

                        <span className="text-gray-800 dark:text-white font-medium truncate max-w-[150px]">
                          {comment.blog?.title || "Untitled"}
                        </span>

                      </div>
                    </td>

                    {/* USER */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </td>

                    {/* COMMENT */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[250px] truncate">
                      {comment.text}
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/view-blog/${comment.blog?._id}`}
                        className="inline-flex items-center justify-center 
                        w-8 h-8 rounded-md 
                        bg-gray-100 dark:bg-slate-700 
                        hover:bg-black hover:text-white 
                        dark:hover:bg-white dark:hover:text-black 
                        transition"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>



            <div className="flex items-center justify-center mt-6">

              <div className="flex items-center gap-2 px-3 py-1.5 
  rounded-full border border-gray-200 dark:border-slate-700 
  bg-white/70 dark:bg-slate-800/60 backdrop-blur-md shadow-sm">

                {/* PREV */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-full 
      hover:bg-gray-100 dark:hover:bg-slate-700 
      disabled:opacity-40 transition"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* PAGE INFO */}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 px-2">
                  {page} / {totalPages}
                </span>

                {/* NEXT */}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-full 
      hover:bg-gray-100 dark:hover:bg-slate-700 
      disabled:opacity-40 transition"
                >
                  <ChevronRight size={16} />
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default Comments;