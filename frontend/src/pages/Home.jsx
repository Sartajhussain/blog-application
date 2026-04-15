import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Autoplay from "embla-carousel-autoplay";


import RecentBlog from "../components/RecentBlog";
import { Card, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { API_BASE_URL } from "../utils/api";
import AllUser from "./AllUser";

const Home = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const { user } = useSelector((state) => state.auth);
  const carouselBlogs = blogs.slice(0, 6);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

   const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/blog/feed`,
        { withCredentials: true }
      );

      if (data?.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("FETCH BLOG ERROR:", err);
    }
  };

   useEffect(() => {
    fetchBlogs();
  }, []);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <div className="relative pl-0 w-full md:max-w-7xl mx-auto px-4 md:px-6 py-12 overflow-hidden shadow-none">

        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 6000,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-0">

           {carouselBlogs.slice(0, 6).map((item) => (
            
              <CarouselItem key={item._id} className="basis-full">
                <Card className="rounded-2xl overflow-hidden border-none shadow-none">
                  <CardContent className="p-0">

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">

                      <div className="md:w-1/2 p-4 md:p-12">

                        <Badge className="mb-3 bg-black text-white">
                          By {item.author?.firstName} {item.author?.lastName} •{" "}
                          {formatDate(item.createdAt)}
                        </Badge>

                        <h1 className="text-3xl md:text-5xl font-bold capitalize">
                          {item.title}
                        </h1>

                        <p className="mt-4 text-gray-600 line-clamp-3 dark:text-gray-300">
                          {item.subtitle}
                        </p>

                        <button
                          onClick={() =>
                            navigate(`/view-blog/${item._id}`)
                          }
                          className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
                        >
                          Read Blog
                        </button>

                      </div>

                      <div className="md:w-1/2 w-full">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-[260px] md:h-[420px] object-cover rounded-xl"
                        />
                      </div>

                    </div>

                  </CardContent>
                </Card>
              </CarouselItem>
            ))}

          </CarouselContent>

          <CarouselPrevious
            className="left-2 cursor-pointer md:left-4 bg-white dark:text-black shadow-[rgba(0,0,0,0.35)_0px_5px_15px] border-none"
          />
          <CarouselNext
            className="right-2 cursor-pointer md:right-4 bg-white dark:text-black shadow-[rgba(0,0,0,0.35)_0px_5px_15px] border-none"
          />
        </Carousel>

        <div className="flex justify-center gap-2 mt-6">
          {carouselBlogs.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all 
      ${current === index ? "bg-black w-3" : "bg-gray-300"}`}
            />
          ))}
        </div>

      </div>

      <RecentBlog blogs={blogs} />
      <AllUser />
    </>
  );
};

export default Home;