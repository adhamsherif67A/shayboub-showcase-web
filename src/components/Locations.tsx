import { MapPin } from "lucide-react";
import { locations } from "@/data/menu";
import { useAnimateOnScroll } from "@/hooks/use-animate-on-scroll";

const Locations = () => {
  const { ref: sectionRef, isVisible } = useAnimateOnScroll<HTMLElement>();

  return (
    <section 
      id="locations" 
      className="section-padding bg-secondary" 
      aria-labelledby="locations-heading"
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto">
        <p className={`font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Find Us
        </p>
        <h2 
          id="locations-heading" 
          className={`font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-16 text-center transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Our Locations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((loc, index) => (
            <a
              key={loc.city}
              href={loc.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to Shayboub ${loc.city}`}
              className={`group bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-2xl p-8 
                hover:border-primary/50 hover:bg-secondary-foreground/10 hover:-translate-y-2 hover:shadow-xl
                transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: isVisible ? `${200 + index * 100}ms` : '0ms' }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                <MapPin className="w-5 h-5 text-primary group-hover:animate-bounce-subtle" />
              </div>
              <h3 className="font-display text-xl font-semibold text-secondary-foreground mb-3 group-hover:text-primary transition-colors">
                {loc.city}
              </h3>
              <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed">
                {loc.address}
              </p>
              <span className="inline-block mt-4 font-body text-sm text-primary group-hover:translate-x-2 transition-transform">
                Get Directions →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
