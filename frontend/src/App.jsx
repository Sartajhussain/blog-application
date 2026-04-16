import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import Comments from "./pages/Comments";
import CreateBlogs from "./pages/CreateBlogs";
import UpdateBlog from "./pages/UpdateBlog";

import ViewBlog from "./pages/ViewBlog";
import Blogs from "./pages/Blogs";
import PublicFeed from "./pages/PublicFeed";

import AllUser from "./pages/AllUser";
import AllUserProfile from "./pages/AllUserProfile";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ================= BLOG ROUTES ================= */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog-feed" element={<PublicFeed />} />
        <Route path="/view-blog/:blogId" element={<ViewBlog />} />

        {/* ================= USERS ================= */}
        <Route path="/AllUser" element={<AllUser />} />
        <Route path="/AllUserProfile" element={<AllUserProfile />} />

        {/* ================= DASHBOARD ================= */}
        <Route path="/dashboard" element={<Dashboard />}>

          {/* DEFAULT REDIRECT (IMPORTANT) */}
          <Route index element={<Profile />} />

          <Route path="profile" element={<Profile />} />
          <Route path="blog" element={<Blog />} />
          <Route path="comments" element={<Comments />} />
          <Route path="create-blogs" element={<CreateBlogs />} />

          {/* ✅ IMPORTANT FIX (MATCH PARAM NAME) */}
          <Route path="write-blog/:blogId" element={<UpdateBlog />} />

        </Route>

      </Routes>

      <Footer />
    </>
  );
};

export default App;