import React from "react";

const Hero = () => {
  return (
    <div className="relative h-screen mb-16">
      {/* Hero Background Image - Fixed to prevent content overlap */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxFbGVnYW50JTJCcmVzdGF1cmFudCUyQmludGVyaW9yJTJCd2l0aCUyQmFtYmllbnQlMkJsaWdodGluZyUyQmFuZCUyQmJlYXV0aWZ1bGx5JTJCc2V0JTJCdGFibGVzfGVufDB8fHx8MTc0NzgzNDI1MXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Elegant restaurant interior with ambient lighting and beautifully set tables" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <div className="max-w-4xl mx-auto">
          {/* Decorative Element - Top */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-16 bg-amber-400"></div>
            <div className="mx-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="80" y1="40" x2="80" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="128" x2="80" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,168H152s0-104,56-128V224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M44,40,40,88a40,40,0,0,0,80,0l-4-48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <div className="h-px w-16 bg-amber-400"></div>
          </div>

          {/* Restaurant Name */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Bistro Deluxe
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl font-light mb-8 italic">
            Where culinary artistry meets elegant ambiance
          </p>

          {/* Brief Description */}
          <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Experience exceptional cuisine crafted from the finest local ingredients.
            Our menu celebrates classic flavors with modern techniques in a warm, 
            sophisticated setting.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#menu"
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition duration-300 text-lg"
            >
              View Menu
            </a>
            <a
              href="#contact"
              className="px-8 py-3 bg-transparent hover:bg-white hover:text-amber-800 text-white font-semibold border-2 border-white rounded-lg transition duration-300 text-lg"
            >
              Reserve Table
            </a>
          </div>

          {/* Decorative Element - Bottom */}
          <div className="flex items-center justify-center mt-12">
            <div className="h-px w-16 bg-amber-400"></div>
            <div className="mx-4 text-amber-400 text-sm font-serif">SINCE 1998</div>
            <div className="h-px w-16 bg-amber-400"></div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10 animate-bounce">
        <a href="#menu" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" transform="translate(0 256) rotate(-90)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="96 112 96 160 144 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        </a>
      </div>
    </div>
  );
};

export default Hero;