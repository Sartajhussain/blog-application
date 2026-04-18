import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-gray-100 dark:bg-slate-900 
text-gray-600 dark:text-gray-400 
text-sm pt-16 pb-8 
border-t border-gray-200 dark:border-slate-700 
transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            MyBlog
          </h2>

          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Sharing insights, tutorials, and ideas for developers and tech enthusiasts.
          </p>

          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Blog Links */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Blog Categories
          </h3>

          <ul className="space-y-2">

            {/* ❌ FIXED: a tag removed */}
            <li>
              <Link to="/blogs" className="hover:text-black dark:hover:text-white transition">
                All Blogs
              </Link>
            </li>

            <li>
              <Link to="/blogs" className="hover:text-black dark:hover:text-white transition">
                JavaScript
              </Link>
            </li>

          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">

            <li>
              <Link to="/about" onClick={() => window.scrollTo(0, 0)}>
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-black dark:hover:text-white transition" onClick={() => window.scrollTo(0, 0)}>
                Contact
              </Link>
            </li>

            {/* ❌ FIXED */}
            <li>
              <Link to="#" className="hover:text-black dark:hover:text-white transition">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-black dark:hover:text-white transition">
                Terms of Service
              </Link>
            </li>

          </ul>
        </div>

        {/* Newsletter */}
        <div className="bg-white dark:bg-slate-800 
p-6 rounded-2xl shadow-md 
border border-gray-200 dark:border-slate-700 
transition-colors duration-300">

          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Subscribe
          </h3>

          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            Get latest blog updates directly in your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">

            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg 
border border-gray-300 dark:border-slate-600 
bg-white dark:bg-slate-900 
text-gray-800 dark:text-white
focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              required
            />

            <button
              type="submit"
              className="bg-black dark:bg-white 
hover:bg-gray-800 dark:hover:bg-gray-200 
transition px-5 py-2 rounded-lg 
text-white dark:text-black font-medium"
            >
              Subscribe
            </button>

          </form>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 border-t border-gray-300 dark:border-slate-700 pt-6 text-center text-gray-500 dark:text-gray-400 text-xs">
        © {new Date().getFullYear()} MyBlog by Sartaj Hussain. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;