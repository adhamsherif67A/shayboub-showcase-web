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
        {/* Simplified logo - less decoration */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 p-4 rounded-2xl
          bg-white/90 
          hover:bg-white hover:scale-105
          transition-all duration-300">
          {!logoLoaded && (
            <Skeleton className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] rounded-xl" />
          )}
          <img
            src={LOGO_URL}
            alt="Shayboub Logo"
            width={200}
            height={200}
            decoding="async"
            onLoad={() => setLogoLoaded(true)}
            className={`w-full h-full object-contain animate-fade-in-up 
              ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-primary mb-4 animate-fade-in-up 
          drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" 
          style={{ animationDelay: "0.15s" }}>
          Shayboub
        </h1>
        <p className="font-display text-2xl md:text-3xl text-primary/90 mb-6 animate-fade-in-up 
          drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" 
          style={{ animationDelay: "0.3s" }} 
          lang="ar">
          شيبوب
        </p>
        <p className="font-body text-secondary-foreground/90 text-base md:text-lg mb-10 max-w-lg mx-auto animate-fade-in-up" 
          style={{ animationDelay: "0.45s" }}>
          Specialty coffee, artisan sandwiches & good vibes
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
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
