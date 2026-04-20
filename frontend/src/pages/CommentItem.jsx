import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaRegHeart, FaTrash, FaPencilAlt, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const CommentItem = ({ comment, currentUserId, onCommentUpdated, onCommentDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  const isOwner = currentUserId === comment.user?._id;

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = async () => {
    if (!editText.trim()) return;

    try {
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/comment/${comment._id}`,
        { text: editText },
        { withCredentials: true }
      );

      if (data.success) {
        onCommentUpdated(data.comment);
        setIsEditing(false);
        setShowMenu(false);
        toast.success("Comment updated!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to edit comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/v1/comment/${comment._id}`,
        { withCredentials: true }
      );

      if (data.success) {
        onCommentDeleted(comment._id);
        toast.success("Comment deleted!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="flex gap-3 relative">
      {/* User Avatar */}
      <img
        src={comment.user?.profilePic}
        alt=""
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1 space-y-2">
        {/* Comment Box */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl relative">
          <p className="font-semibold text-sm">
            {comment.user?.firstName} {comment.user?.lastName}
          </p>

          {/* Edit mode */}
          {isEditing ? (
            <div className="flex gap-2 mt-2">
              <input
                autoFocus
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-3 rounded text-sm hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-3 rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
          )}

          {/* 3-dot menu */}
          {isOwner && !isEditing && (
            <div className="absolute top-2 right-2" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <FaEllipsisV className="text-sm text-gray-500" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-700 border rounded shadow-md z-10 flex flex-col w-20">
                  <button
                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="px-2 py-1 text-left hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1 text-xs"
                  >
                    <FaPencilAlt /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-2 py-1 text-left hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1 text-xs"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Likes */}
        <div className="flex items-center gap-5 text-xs text-gray-500">
          <button className="flex items-center gap-1">
            <FaRegHeart className="text-xs" />
            0
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;