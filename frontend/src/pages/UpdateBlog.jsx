import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { API_BASE_URL } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setBlog } from "../redux/blogSlice";

// ✅ FIXED (IMPORTANT)
import { useNavigate, useParams } from "react-router-dom";

const UpdateBlog = () => {
  const navigate = useNavigate(); // ✅ must call
  const { blogId } = useParams(); // ✅ get id from URL
  const dispatch = useDispatch();
  const editor = useRef(null);

  const { blog } = useSelector((store) => store.blog);

  const selectedBlog = blog?.find((b) => b?._id === blogId);

  /* ================= STATES ================= */
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isPublished, setIsPublished] = useState(false);
  const [contents, setContents] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    category: ""
  });

  /* ================= SYNC DATA ================= */
  useEffect(() => {
    if (selectedBlog) {
      setBlogData({
        title: selectedBlog.title || "",
        subtitle: selectedBlog.subtitle || "",
        category: selectedBlog.category || ""
      });

      setContents(selectedBlog.description || "");
      setIsPublished(selectedBlog.isPublished || false);
      setPreview(selectedBlog.thumbnail || null);
    }
  }, [selectedBlog]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  const selectCategory = (e) => {
    setBlogData({ ...blogData, category: e.target.value });
  };

  const thumbnailHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ================= UPDATE ================= */
  const blogUpdateHandler = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("subtitle", blogData.subtitle);
      formData.append("category", blogData.category);
      formData.append("description", contents);

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/blog/${blogId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (data.success) {
        toast.success("Blog Updated Successfully");

        // ✅ update redux state
        const updatedBlogs = blog.map((b) =>
          b._id === blogId ? data.blog : b
        );
        dispatch(setBlog(updatedBlogs));

        navigate("/dashboard/blog");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PUBLISH ================= */
  const publishHandler = async () => {
    try {
      setPublishLoading(true);

      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${blogId}/publish`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsPublished(data.blog.isPublished);

        const updatedBlogs = blog.map((b) =>
          b._id === blogId ? data.blog : b
        );
        dispatch(setBlog(updatedBlogs));

        toast.success(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setPublishLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      setDeleteLoading(true);

      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/blog/${blogId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Blog Deleted Successfully");

        const updatedBlogs = blog.filter((b) => b._id !== blogId);
        dispatch(setBlog(updatedBlogs));

        navigate("/dashboard/blog");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="min-h-screen pt-20 pb-24 md:ml-72 px-4 py-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Update Blog
        </h1>

        {/* BUTTONS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={publishHandler}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {publishLoading ? "Processing..." : isPublished ? "Unpublish" : "Publish"}
          </button>

          <button
            onClick={deleteHandler}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* TITLE */}
        <input
          type="text"
          name="title"
          value={blogData.title}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
          placeholder="Title"
        />

        {/* SUBTITLE */}
        <input
          type="text"
          name="subtitle"
          value={blogData.subtitle}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
          placeholder="Subtitle"
        />

        {/* CATEGORY */}
        <select
          value={blogData.category}
          onChange={selectCategory}
          className="w-full mb-4 px-4 py-2 border rounded"
        >
          <option value="">Select Category</option>
          <option value="tech">Technology</option>
          <option value="business">Business</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="education">Education</option>
        </select>

        {/* EDITOR */}
        <JoditEditor
          ref={editor}
          value={contents}
          onChange={(newContent) => setContents(newContent)}
        />

        {/* THUMBNAIL */}
        <input
          type="file"
          className="mt-4"
          onChange={thumbnailHandler}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-40 h-40 mt-3 object-cover"
          />
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={blogUpdateHandler}
          className="mt-6 px-6 py-2 bg-black text-white rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
};

export default UpdateBlog;