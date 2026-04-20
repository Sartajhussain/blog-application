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
    <div className="min-h-screen mt-10 pt-20 md:ml-[300px] p-4 md:p-8 
bg-gray-50 dark:bg-slate-950">

      <h2 className="text-base md:text-lg font-semibold mb-5 text-gray-800 dark:text-white">
        All Blog's Comments
      </h2>

      <div className="bg-white dark:bg-slate-900 
  border border-gray-200 dark:border-slate-700 
  rounded-xl overflow-hidden">

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="p-6 flex flex-col items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-xs">Loading comments...</p>
          </div>
        ) : allComments.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No comments found
          </div>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left">Blog</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Comment</th>
                    <th className="px-4 py-3 text-center">View</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {allComments.map((comment) => (
                    <tr key={comment._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800 transition">

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
                            className="w-10 h-10 rounded-md object-cover"
                          />

                          <span className="truncate max-w-[160px]">
                            {comment.blog?.title}
                          </span>

                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </td>

                      <td className="px-4 py-3 truncate max-w-[250px]">
                        {comment.text}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Link to={`/view-blog/${comment.blog?._id}`}>
                          <ExternalLink size={16} />
                        </Link>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-slate-700">

              {allComments.map((comment) => (
                <div key={comment._id}
                  className="p-3 flex gap-3 items-start">

                  {/* IMAGE */}
                  <img
                    src={
                      comment.blog?.thumbnail
                        ? comment.blog.thumbnail.startsWith("http")
                          ? comment.blog.thumbnail
                          : `${API_BASE_URL}/${comment.blog.thumbnail}`
                        : "https://via.placeholder.com/100"
                    }
                    className="w-12 h-12 rounded-md object-cover"
                  />

                  {/* CONTENT */}
                  <div className="flex-1">

                    <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                      {comment.blog?.title}
                    </p>

                    <p className="text-[11px] text-gray-500">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {comment.text}
                    </p>

                  </div>

                  {/* VIEW */}
                  <Link
                    to={`/view-blog/${comment.blog?._id}`}
                    className="p-2 rounded-md 
                bg-gray-100 dark:bg-slate-700"
                  >
                    <ExternalLink size={14} />
                  </Link>

                </div>
              ))}

            </div>

            {/* ================= PAGINATION ================= */}
            <div className="flex justify-center mt-5 pb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 
          rounded-full border border-gray-200 dark:border-slate-700">

                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1 rounded-full disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="text-xs text-gray-600">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1 rounded-full disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>

              </div>
            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default Comments;