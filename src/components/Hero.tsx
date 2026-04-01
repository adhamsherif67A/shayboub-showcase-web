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
          className={`w-full h-full object-cover transition-opacity duration-500 
            ${bannerLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Gradient vignette */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/60 to-secondary/85" 
          aria-hidden="true" 
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Logo - no background, just the logo */}
        <div className="relative w-52 h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto mb-6">
          {!logoLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
          )}
          <img
            src={LOGO_URL}
            alt="Shayboub - Specialty Coffee"
            width={320}
            height={320}
            decoding="async"
            onLoad={() => setLogoLoaded(true)}
            className={`w-full h-full object-contain drop-shadow-[0_4px_20px_rgba(255,255,255,0.15)]
              hover:scale-105 transition-transform duration-300
              ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        
        {/* Tagline */}
        <p className="font-body text-secondary-foreground/90 text-base md:text-lg lg:text-xl mb-8 max-w-md mx-auto">
          Specialty coffee, artisan sandwiches & good vibes
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#menu"
            className="inline-block bg-primary text-white font-body font-semibold px-8 py-3.5 rounded-xl 
              hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
              shadow-lg shadow-primary/25"
          >
            Explore Menu
          </a>
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-secondary font-body font-semibold px-8 py-3.5 rounded-xl 
              hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
              shadow-lg shadow-black/10"
          >
            Order on Talabat
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
