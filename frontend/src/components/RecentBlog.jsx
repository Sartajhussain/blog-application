import React from "react";
import BlogList from "./BlogList";
import BlogSideBar from "./BlogSideBar";

const RecentBlog = ({ blogs = [] }) => {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-600 transition-colors duration-300">

      {/* TITLE */}

      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-center py-10">
        Welcome ✨ The People of the Kingdom 
        <hr className="w-2/3 md:w-1/3 border-t-4 border-gray-900 mx-auto mt-4" />
      </h2>

      {/* MAIN SECTION */}

      <div className="w-full md:max-w-7xl mx-auto px-4 md:px-20 py-10 flex flex-col md:flex-row gap-4 md:gap-10">

        {/* BLOG LIST */}

        <div className="flex-1">

          {blogs && blogs.length > 0 ? (
            blogs.slice(0, 4).map((item, index) => (
              <BlogList key={index} blog={item} />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-10">No blogs available</p>
          )}

        </div>

        {/* SIDEBAR */}

        <BlogSideBar />
  
      </div>

    </div>
  );
};

export default RecentBlog;
