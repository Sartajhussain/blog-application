import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { API_BASE_URL } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setBlog } from "../redux/blogSlice"; // replace with correct slice

const UpdateBlog = () => {
  const navigate = useNavigate();
  const editor = useRef(null);
  const dispatch = useDispatch();

  const { blog } = useSelector((store) => store.blog);
  const { blogId } = useParams();
  const id = blogId;

  const selectedBlog = blog?.find((b) => b?._id === id);

  /* ===========================
        STATES
  =========================== */
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

  /* ===========================
        SYNC BLOG DATA
  =========================== */
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

  /* ===========================
        HANDLERS
  =========================== */
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

  /* ===========================
        UPDATE BLOG
  =========================== */
  const blogUpdateHandler = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("category", blogData.category);
    formData.append("description", contents);

    if (thumbnail) {
      formData.append("file", thumbnail);
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/blog/${id}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success("Blog Updated Successfully");
        navigate("/dashboard/blog");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
        PUBLISH / UNPUBLISH
  =========================== */
  const publishHandler = async () => {
    if (!id) return toast.error("Invalid blog ID");

    try {
      setPublishLoading(true);

      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${id}/publish`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsPublished(data.blog.isPublished);

        const updatedBlogs = blog.map((b) =>
          b._id === id ? data.blog : b
        );
        dispatch(setBlog(updatedBlogs));

        toast.success(data.message);
        navigate("/blogs");
      } else {
        toast.error(data.message || "Something went wrong");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setPublishLoading(false);
    }
  };

  /* ===========================
        DELETE BLOG
  =========================== */
  const deleteHandler = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);

      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/blog/${id}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Blog Deleted Successfully");
        navigate("/blogs");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ===========================
        UI
  =========================== */
  return (
    <div className="min-h-screen md:ml-72 px-4 py-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Update Blog
          </h1>

          <div className="flex gap-3">
            <button
              onClick={publishHandler}
              disabled={publishLoading}
              className={`px-4 py-2 rounded-lg text-white font-medium transition
                ${isPublished ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}`}
            >
              {publishLoading ? "Processing..." : isPublished ? "Unpublish" : "Publish"}
            </button>

            <button
              onClick={deleteHandler}
              disabled={deleteLoading}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              {deleteLoading ? "Deleting..." : "Remove"}
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="mb-5">
          <input
            type="text"
            value={blogData.title}
            onChange={handleChange}
            name="title"
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-900"
            placeholder="Title"
          />
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={blogData.subtitle}
            onChange={handleChange}
            name="subtitle"
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-900"
            placeholder="Subtitle"
          />
        </div>

        <div className="mb-5">
          <select
            value={blogData.category}
            onChange={selectCategory}
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-900"
          >
            <option value="">Select Category</option>
            <option value="tech">Technology</option>
            <option value="business">Business</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
          </select>
        </div>

        <div className="mb-6">
          <JoditEditor
            ref={editor}
            value={contents}
            config={{
              readonly: false, height: 400, placeholder: "Write your blog content here...",
              style: {
                color: "#000000",
                background: "#ffffff"
              }
            }}
            onChange={(newContent) => setContents(newContent)}
          />
        </div>

        <div className="mb-8">
          <input type="file" accept="image/*" onChange={thumbnailHandler} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-[200px] h-[200px] object-cover rounded-xl mt-4"
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700"
          >
            Back
          </button>

          <button
            
            disabled={loading}
            onClick={blogUpdateHandler}
            className="px-6 py-3 rounded-xl bg-black text-white"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateBlog;