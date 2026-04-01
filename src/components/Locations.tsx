import { MapPin } from "lucide-react";
import { locations } from "@/data/menu";
import { useAnimateOnScroll } from "@/hooks/use-animate-on-scroll";
import { useLanguage } from "@/contexts/LanguageContext";

const Locations = () => {
  const { ref: sectionRef, isVisible } = useAnimateOnScroll<HTMLElement>();
  const { t, isRTL } = useLanguage();

  // Map location keys to translations
  const locationTranslations: Record<string, { name: string; address: string }> = {
    "Cairo - New Cairo": t.locations.cairo,
    "Alexandria - Smouha": t.locations.alexSmouha,
    "Alexandria - Sidi Gaber": t.locations.alexSidiGaber,
  };

  return (
    <section 
      id="locations" 
      className="section-padding bg-secondary" 
      aria-labelledby="locations-heading"
      ref={sectionRef}
    >
      <div className={`max-w-6xl mx-auto ${isRTL ? 'rtl' : ''}`}>
        <p className={`font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {t.locations.subtitle}
        </p>
        <h2 
          id="locations-heading" 
          className={`font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-16 text-center transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {t.locations.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((loc, index) => {
            const translatedLoc = locationTranslations[loc.city] || { name: loc.city, address: loc.address };
            return (
              <a
                key={loc.city}
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to Shayboub ${loc.city}`}
                className={`group bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-2xl p-8 
                  hover:border-primary/50 hover:bg-secondary-foreground/10 hover:-translate-y-2 hover:shadow-xl
                  transition-all duration-500 ${isRTL ? 'text-right' : ''} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: isVisible ? `${200 + index * 100}ms` : '0ms' }}
              >
                <div className={`w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 ${isRTL ? 'mr-auto' : ''}`}>
                  <MapPin className="w-5 h-5 text-primary group-hover:animate-bounce-subtle" />
                </div>
                <h3 className="font-display text-xl font-semibold text-secondary-foreground mb-3 group-hover:text-primary transition-colors">
                  {translatedLoc.name}
                </h3>
                <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed">
                  {translatedLoc.address}
                </p>
                <span className={`inline-block mt-4 font-body text-sm text-primary transition-transform ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                  {isRTL ? `← ${t.locations.getDirections}` : `${t.locations.getDirections} →`}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Locations;
