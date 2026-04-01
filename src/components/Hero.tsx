import { useState } from "react";
import { LOGO_URL, BANNER_URL } from "@/data/menu";
import { Skeleton } from "@/components/ui/skeleton";

const Hero = () => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Welcome to Shayboub"
    >
      <div className="absolute inset-0">
        {/* Banner skeleton */}
        {!bannerLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}
        <img
          src={BANNER_URL}
          alt="Shayboub Coffee - specialty coffee and artisan sandwiches in Cairo and Alexandria"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setBannerLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 
            ${bannerLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Simplified gradient vignette */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/70 to-secondary/90" 
          aria-hidden="true" 
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Main logo - original colors with white background */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 mx-auto mb-8 p-5 rounded-3xl
          bg-white
          hover:scale-105
          transition-all duration-300">
          {!logoLoaded && (
            <Skeleton className="absolute inset-5 w-[calc(100%-2.5rem)] h-[calc(100%-2.5rem)] rounded-2xl" />
          )}
          <img
            src={LOGO_URL}
            alt="Shayboub - Specialty Coffee"
            width={300}
            height={300}
            decoding="async"
            onLoad={() => setLogoLoaded(true)}
            className={`w-full h-full object-contain animate-fade-in-up
              ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        {/* Tagline only - logo has the name */}
        <p className="font-body text-secondary-foreground text-lg md:text-xl mb-10 max-w-lg mx-auto animate-fade-in-up" 
          style={{ animationDelay: "0.2s" }}>
          Specialty coffee, artisan sandwiches & good vibes
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="#menu"
            className="inline-block bg-primary text-white font-body font-semibold px-8 py-4 rounded-lg 
              hover:scale-105 hover:bg-primary/90 active:scale-95 transition-all duration-200"
          >
            Explore Menu
          </a>
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white/90 text-secondary font-body font-semibold px-8 py-4 rounded-lg 
              hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Order on Talabat
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
