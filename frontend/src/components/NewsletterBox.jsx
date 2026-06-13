import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center px-4 sm:px-0 py-12 sm:py-16">
      {/* Eyebrow line */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="w-8 h-px bg-gray-300 flex-shrink-0" />
        <p className="text-xs tracking-widest uppercase text-gray-400">
          Newsletter
        </p>
        <span className="w-8 h-px bg-gray-300 flex-shrink-0" />
      </div>

      {/* Headline */}
      <p className="text-2xl sm:text-3xl font-medium text-gray-800 leading-snug">
        Subscribe & get{" "}
        <span className="text-black font-semibold">20% off</span>
      </p>

      {/* Subtext */}
      <p className="mt-3 mx-auto max-w-sm text-sm text-gray-400 leading-relaxed">
        Stay updated with the latest fashion trends, exclusive offers, and new
        arrivals from ZYRA.
      </p>

      {/* Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-[480px] flex items-stretch mx-auto mt-7 border border-gray-200 overflow-hidden hover:border-gray-400 transition-colors duration-200 focus-within:border-black"
      >
        <input
          className="flex-1 min-w-0 px-4 py-3.5 text-sm outline-none bg-transparent placeholder-gray-400"
          type="email"
          placeholder="Enter your email address"
          required
        />

        <button
          type="submit"
          className="bg-black text-white text-xs tracking-widest px-7 py-3.5 flex-shrink-0 hover:bg-gray-800 active:scale-[0.98] transition-all duration-150"
        >
          SUBSCRIBE
        </button>
      </form>

      {/* Privacy note */}
      <p className="mt-4 text-[11px] text-gray-300">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default NewsletterBox;
