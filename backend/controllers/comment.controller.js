// controllers/comment.controller.js

import Comment from "../models/comment.model.js";

export { addReply } from "./addReply.controller.js";
export { getComments } from "./getCommentReply.controller.js";
export { likeComment } from "./likeComment.controller.js";

// ================= ADD COMMENT =================
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: blogId } = req.params;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text required",
      });
    }

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID required",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const comment = await Comment.create({
      blog: blogId,
      user: req.user.id,
      text,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "firstName lastName profilePic")
      .populate("blog", "title thumbnail");

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });

  } catch (err) {
    console.log("COMMENT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Comment failed",
    });
  }
};

// ================= GET ALL COMMENTS (🔥 NEW - IMPORTANT) =================
export const getAllComments = async (req, res) => {
  try {
    // page & limit query se lo
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // 🔥 fixed 5 comments per page
    const skip = (page - 1) * limit;

    // total count
    const totalComments = await Comment.countDocuments();

    const comments = await Comment.find()
      .populate("user", "firstName lastName profilePic")
      .populate("blog", "title thumbnail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      comments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments
    });

  } catch (err) {
    console.log("GET ALL COMMENTS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

// ================= UPDATE =================
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text required",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    comment.text = text;
    await comment.save();

    const updated = await Comment.findById(comment._id)
      .populate("user", "firstName lastName profilePic")
      .populate("blog", "title");

    res.json({
      success: true,
      comment: updated,
    });

  } catch (err) {
    console.log("UPDATE COMMENT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to update comment",
    });
  }
};

// ================= DELETE =================
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: "Comment deleted",
    });

  } catch (err) {
    console.log("DELETE COMMENT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};