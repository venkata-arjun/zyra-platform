import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { ShieldCheck, Sparkles, Headset } from "lucide-react";

const About = () => {
  return (
    <div className="px-4 sm:px-0">
      {/* Header */}
      <div className="text-2xl text-center pt-8 border-t border-gray-200 mb-10">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      {/* Story Section */}
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-20 items-stretch">
        {/* Image */}
        <div className="w-full md:max-w-[450px] flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
          <img
            className="w-full h-full object-cover"
            src={assets.about_img}
            alt="About ZYRA"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-0 flex-1">
          <div className="py-5 border-b border-gray-100">
            <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400 mb-3">
              Our Story
            </p>

            <p className="text-sm text-gray-600 leading-7">
              ZYRA was created with a vision to redefine online fashion by
              combining premium quality, modern trends, and effortless shopping.
              We believe that style should be accessible to everyone, making it
              easy to discover pieces that match every personality and occasion.
            </p>
          </div>

          <div className="py-5 border-b border-gray-100">
            <p className="text-sm text-gray-600 leading-7">
              Every collection at ZYRA is thoughtfully curated to deliver
              timeless essentials and trend-driven fashion. Working with trusted
              manufacturers and premium materials, we ensure every product
              offers exceptional comfort, quality, and value for our customers.
            </p>
          </div>

          <div className="py-5">
            <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400 mb-3">
              Our Mission
            </p>

            <p className="text-sm text-gray-600 leading-7">
              Our mission is to create a seamless fashion experience where
              premium style meets convenience. From browsing the latest
              collections to secure checkout and fast delivery, ZYRA is
              dedicated to making every shopping journey simple, reliable, and
              enjoyable.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-xl mb-6">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 mb-20 rounded-xl border border-gray-100 overflow-hidden">
        {/* Quality */}
        <div className="flex flex-col gap-4 px-8 py-10 border-b sm:border-b-0 sm:border-r border-gray-100 hover:bg-gray-50 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-900">
            Quality Assurance
          </p>

          <p className="text-sm text-gray-500 leading-7">
            Every product is carefully selected and inspected to ensure premium
            craftsmanship, lasting comfort, and exceptional quality that you can
            trust.
          </p>
        </div>

        {/* Convenience */}
        <div className="flex flex-col gap-4 px-8 py-10 border-b sm:border-b-0 sm:border-r border-gray-100 hover:bg-gray-50 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-900">
            Seamless Shopping
          </p>

          <p className="text-sm text-gray-500 leading-7">
            Browse collections, discover new arrivals, and complete purchases
            effortlessly with a fast, intuitive, and secure shopping experience.
          </p>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col gap-4 px-8 py-10 hover:bg-gray-50 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Headset className="w-5 h-5 text-white" />
          </div>

          <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-900">
            Dedicated Support
          </p>

          <p className="text-sm text-gray-500 leading-7">
            Our friendly support team is always available to assist with orders,
            returns, and product recommendations, ensuring a smooth experience
            from start to finish.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
