const About = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4">
          Our Story
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
          More Than Just Coffee
        </h2>
        <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
          Shayboub was born from a simple idea — great coffee should be an experience, not just a drink.
          From our first cup in Cairo to our branches across Alexandria, we've stayed true to what matters:
          quality beans, creative recipes, and a space where everyone feels at home.
        </p>
        <p className="font-body text-lg text-muted-foreground leading-relaxed mb-10">
          Whether you're sipping our signature Spanish Latte, biting into a Smoked Turkey SQR Bun,
          or just catching up with friends — Shayboub is your spot.
        </p>

        <div className="flex flex-wrap justify-center gap-12 mt-12">
          <div>
            <p className="font-display text-4xl font-bold text-primary">4.6★</p>
            <p className="font-body text-sm text-muted-foreground mt-1">Talabat Rating</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold text-primary">1000+</p>
            <p className="font-body text-sm text-muted-foreground mt-1">Reviews</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold text-primary">3</p>
            <p className="font-body text-sm text-muted-foreground mt-1">Locations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
