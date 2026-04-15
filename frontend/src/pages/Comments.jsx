import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { API_BASE_URL } from "../utils/api";

const Comments = () => {
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {

    try {

      setLoading(true);

      const res = await axios.get( 
        
        `${API_BASE_URL}/api/v1/comment/blog/my-blog/comments`,{withCredentials:true}
        
      );

      if (res.data.success) {
        setAllComments(res.data.comments);
      }

      setLoading(false);

    } catch (err) {

      console.log(err);
      setLoading(false);

    }

  };

  useEffect(() => {

   
      fetchComments();
    

  }, []);

  return (
    <div className="min-h-screen md:ml-[300px] p-4 mt-5 md:p-8 bg-gray-100 dark:bg-slate-900">

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow">

        <div className="p-4 md:p-6 border-b dark:border-slate-700">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">
            Blog Comments
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading comments...</div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm md:text-base">

              <thead className="bg-gray-200 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">Blog Title</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Comment</th>
                  <th className="px-4 py-3 text-center">View</th>
                </tr>
              </thead>

              <tbody>
                {allComments.map((comment) => (
                  <tr
                    key={comment._id}
                    className="border-b dark:border-slate-700"
                  >

                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                      {comment.blog?.title}
                    </td>

                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </td>

                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 break-words max-w-[300px]">
                      {comment.text}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/blog/${comment.blog?._id}`}
                        className="inline-flex items-center justify-center p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

            {allComments.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No comments found
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default Comments;