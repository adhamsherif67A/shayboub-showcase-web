import { useAnimateOnScroll } from "@/hooks/use-animate-on-scroll";

const About = () => {
  const { ref: sectionRef, isVisible } = useAnimateOnScroll<HTMLElement>();
  const { ref: statsRef, isVisible: statsVisible } = useAnimateOnScroll<HTMLDivElement>();

  return (
    <section 
      id="about" 
      className="section-padding" 
      aria-labelledby="about-heading"
      ref={sectionRef}
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className={`font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Our Story
        </p>
        <h2 
          id="about-heading" 
          className={`font-display text-4xl md:text-5xl font-bold text-foreground mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          More Than Just Coffee
        </h2>
        <p className={`font-body text-lg text-muted-foreground leading-relaxed mb-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Shayboub was born from a simple idea — great coffee should be an experience, not just a drink.
          From our first cup in Cairo to our branches across Alexandria, we've stayed true to what matters:
          quality beans, creative recipes, and a space where everyone feels at home.
        </p>
        <p className={`font-body text-lg text-muted-foreground leading-relaxed mb-10 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Whether you're sipping our signature Spanish Latte, biting into a Smoked Turkey SQR Bun,
          or just catching up with friends — Shayboub is your spot.
        </p>

        <div 
          ref={statsRef}
          className="flex flex-wrap justify-center gap-12 mt-12"
        >
          <div className={`transition-all duration-500 ${statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <p className="font-display text-4xl font-bold text-primary hover:scale-110 transition-transform cursor-default">4.6★</p>
            <p className="font-body text-sm text-muted-foreground mt-1">Talabat Rating</p>
          </div>
          <div className={`transition-all duration-500 delay-100 ${statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <p className="font-display text-4xl font-bold text-primary hover:scale-110 transition-transform cursor-default">1000+</p>
            <p className="font-body text-sm text-muted-foreground mt-1">Reviews</p>
          </div>
          <div className={`transition-all duration-500 delay-200 ${statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <p className="font-display text-4xl font-bold text-primary hover:scale-110 transition-transform cursor-default">3</p>
            <p className="font-body text-sm text-muted-foreground mt-1">Locations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
