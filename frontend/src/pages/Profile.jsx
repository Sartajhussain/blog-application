import { API_BASE_URL } from "../utils/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { setUser, setLoading } from "../redux/authSlice.js";
import {
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiEdit,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    instagram: "",
    linkedin: "",
    github: "",
    facebook: "",
    file: null,
  });

  // ✅ Sync input with user
  useEffect(() => {
    if (user) {
      setInput({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        instagram: user.instagram || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        facebook: user.facebook || "",
        file: null,
      });
    }
  }, [user]);

  // ✅ FIX: login ke baad / refresh ke baad user fetch
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/user/profile`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const fileHnadler = (e) => {
    setInput((prev) => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in input) {
      formData.append(key, input[key]);
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.put(
        `${API_BASE_URL}/api/v1/user/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(" Profile Updated Successfully");

        // ✅ merge fix (important)
        dispatch(setUser({
          ...user,
          ...res.data.user
        }));

        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ FINAL FIX (no fallback now — correct data flow)
  const socials = [
    { icon: FiInstagram, url: user?.instagram },
    { icon: FiLinkedin, url: user?.linkedin },
    { icon: FiGithub, url: user?.github },
    { icon: FiFacebook, url: user?.facebook },
  ];

  return (
    <>
      {/* ================= PROFILE ================= */}
      <div className="min-h-screen pt-20 pb-24 md:pb-0 md:pt-0 flex items-center justify-center md:ml-64 
bg-gray-50 dark:bg-slate-900 
px-4 md:px-8 py-12">

        <div className="w-full max-w-5xl 
  bg-white dark:bg-slate-800 
  rounded-3xl p-6 md:p-10 shadow-xl 
  border border-gray-200 dark:border-slate-700 
  flex flex-col md:flex-row gap-10">

          {/* LEFT */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={user?.profilePic || userimg}
                alt="profile"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full 
          border-4 border-gray-200 dark:border-slate-600 
          object-cover"
                onError={(e) => (e.target.src = userimg)}
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 
        bg-green-500 rounded-full 
        border-2 border-white dark:border-slate-800" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4 capitalize">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
              <FiMail /> {user?.email}
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-5">
              {socials.map(
                (item, i) =>
                  item.url && (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center 
                rounded-full 
                bg-gray-100 dark:bg-slate-700 
                text-gray-600 dark:text-gray-300
                hover:bg-black hover:text-white 
                dark:hover:bg-white dark:hover:text-black 
                transition"
                    >
                      <item.icon />
                    </a>
                  )
              )}
            </div>

            <button
              onClick={() => setOpen(true)}
              className="mt-6 px-6 py-2 rounded-full 
        bg-black dark:bg-white 
        text-white dark:text-black 
        flex items-center gap-2 
        hover:bg-gray-800 dark:hover:bg-gray-200 
        transition"
            >
              <FiEdit />
              Edit Profile
            </button>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
              Welcome {user?.firstName} {user?.lastName || "User"} 👋
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed capitalize">
              {user?.bio || "Please add your bio."}
            </p>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">25+</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">Total Views</p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">3+</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">Total Blogs</p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">100+</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">Comments</p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">250+</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">Likes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
  bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-3xl 
    bg-white dark:bg-slate-900 
    text-gray-800 dark:text-white 
    rounded-2xl shadow-2xl 
    p-6 md:p-8 relative 
    border border-gray-200 dark:border-slate-700">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 
        text-gray-400 hover:text-black 
        dark:hover:text-white cursor-pointer"
            >
              <FiX size={22} />
            </button>

            <h2 className="cursor-pointer text-2xl font-bold mb-6">
              Edit Profile
            </h2>

            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <input placeholder="First Name" className="input" name="firstName" value={input.firstName} onChange={changeEventHandler} />
                <input type="text" placeholder="Last Name" className="input" name="lastName" value={input.lastName} onChange={changeEventHandler} />
              </div>

              <input type="email" name="email" placeholder="Email" className="input" value={input.email} onChange={changeEventHandler} />

              <textarea rows="2" placeholder="About you..." className="input resize-none" name="bio" value={input.bio} onChange={changeEventHandler} />

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <input className="input" placeholder="Instagram URL" name="instagram" value={input.instagram} onChange={changeEventHandler} />
                <input className="input" placeholder="LinkedIn URL" name="linkedin" value={input.linkedin} onChange={changeEventHandler} />
                <input className="input" placeholder="GitHub URL" name="github" value={input.github} onChange={changeEventHandler} />
                <input className="input" placeholder="Facebook URL" name="facebook" value={input.facebook} onChange={changeEventHandler} />
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                {/* FILE INPUT */}
                <input
                  type="file"
                  name="file"
                  onChange={fileHnadler}
                  className="w-full text-sm 
    file:px-3 file:py-2 
    file:rounded-full 
    file:border file:border-gray-300 
    dark:file:border-gray-600 
    file:bg-black dark:file:bg-white 
    file:text-white dark:file:text-black 
    hover:file:bg-gray-800 dark:hover:file:bg-gray-200 
    cursor-pointer"
                />

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 w-full md:w-auto">

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-sm rounded-full 
      border border-gray-600 dark:border-gray-500 
      text-gray-600 dark:text-gray-300 
      hover:bg-gray-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 text-sm rounded-full 
      bg-black dark:bg-white 
      text-white dark:text-black 
      flex items-center gap-2 
      hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        wait...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>

                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
  .input {
    width: 100%;
    padding: 10px 10px;
    border-radius: 0.75rem;
    background: white;
    border: 1px solid #e5e7eb;
    color: #111827;
    outline: none;
  }

  .dark .input {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: white;
  }

  .input::placeholder {
    color: #9ca3af;
  }

  .input:focus {
    border-color: #ec4899;
  }
`}</style>
    </>
  );
};

export default Profile;