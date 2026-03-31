import { LOGO_URL, BANNER_URL } from "@/data/menu";

const Hero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Welcome to Shayboub"
    >
      <div className="absolute inset-0">
        <img
          src={BANNER_URL}
          alt="Shayboub Coffee - specialty coffee and artisan sandwiches in Cairo and Alexandria"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/60" aria-hidden="true" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <img
          src={LOGO_URL}
          alt="Shayboub Logo"
          width={200}
          height={200}
          decoding="async"
          className="w-40 h-40 md:w-52 md:h-52 mx-auto mb-8 rounded-2xl object-contain animate-fade-in-up"
        />
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-secondary-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Shayboub
        </h1>
        <p className="font-display text-xl md:text-2xl italic text-secondary-foreground/80 mb-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          شايبوب
        </p>
        <p className="font-body text-secondary-foreground/70 text-lg mb-12 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          Specialty coffee, artisan sandwiches & good vibes — crafted with love since day one.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <a
            href="#menu"
            className="inline-block bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Explore Menu
          </a>
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-secondary-foreground/30 text-secondary-foreground font-body font-semibold px-8 py-4 rounded-lg hover:bg-secondary-foreground/10 transition-colors"
          >
            Order on Talabat
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
