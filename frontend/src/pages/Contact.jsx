import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import {
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Truck,
  RefreshCw,
  Headset,
  Clock3,
  ShieldCheck,
} from "lucide-react";

const Contact = () => {
  const features = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      text: "Premium quality fashion",
    },
    {
      icon: <Truck className="w-4 h-4" />,
      text: "Fast delivery across India",
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      text: "Secure payments & checkout",
    },
    {
      icon: <Headset className="w-4 h-4" />,
      text: "Dedicated customer support",
    },
  ];

  return (
    <div className="px-4 sm:px-0">
      {/* Header */}
      <div className="text-2xl text-center pt-8 border-t border-gray-200 mb-10">
        <Title text1={"CONTACT"} text2={"US"} />

        <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto leading-7">
          Have a question about an order, sizing, or our latest collection?
          We're always happy to help.
        </p>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-20 items-stretch">
        {/* Image */}
        <div className="w-full md:max-w-[450px] flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
          <img
            className="w-full h-full object-cover"
            src={assets.contact_img}
            alt="ZYRA Contact"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center flex-1">
          {/* Store */}
          <div className="py-5 border-b border-gray-100">
            <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400 mb-4">
              Our Store
            </p>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-black mt-0.5" />

              <div>
                <p className="font-semibold text-gray-900">
                  ZYRA Fashion Store
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Bhimavaram, Andhra Pradesh, India
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="py-5 border-b border-gray-100">
            <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400 mb-4">
              Get in Touch
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="tel:+919876543201"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition"
              >
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                +91 9876543201
              </a>

              <a
                href="mailto:support@zyra.com"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition"
              >
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                support@zyra.com
              </a>
            </div>
          </div>

          {/* Why Choose */}
          <div className="py-5 border-b border-gray-100">
            <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400 mb-4">
              Why Choose ZYRA
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {item.icon}
                  </div>

                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="py-5">
            <p className="text-xs tracking-[0.15em] uppercase font-semibold text-gray-400 mb-4">
              Support Hours
            </p>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <Clock3 className="w-4 h-4 text-white" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Monday - Saturday</p>

                <p className="text-sm text-gray-500">9:00 AM - 8:00 PM IST</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 leading-7">
              Need help with an order, product details, or sizing? Our support
              team is ready to assist you with a quick response.
            </p>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
