import { MapPin } from "lucide-react";

const locations = [
  {
    city: "New Cairo",
    address: "شيل اوت التسعين، اسفل El-Moshir Tantawy Axis, Al Hay Al Asher, Nasr City, Cairo Governorate 11835",
    mapUrl: "https://maps.google.com/?q=El-Moshir+Tantawy+Axis+Nasr+City+Cairo",
  },
  {
    city: "Kafr Abdou, Alexandria",
    address: "30 Abd El Aziz Agamya St, Off Saint Jenny St, Alexandria Governorate 5433124",
    mapUrl: "https://maps.google.com/?q=30+abd+el+aziz+agamya+st+kafr+abdou+alexandria",
  },
  {
    city: "Gleem, Alexandria",
    address: "5 Ahmed Yehia St, El Raml 1, Alexandria Governorate 21532",
    mapUrl: "https://maps.google.com/?q=5+Ahmed+Yehia+St+El+Raml+Alexandria",
  },
];

const Locations = () => {
  return (
    <section id="locations" className="section-padding bg-secondary">
      <div className="max-w-6xl mx-auto">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 text-center">
          Find Us
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-16 text-center">
          Our Locations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((loc) => (
            <a
              key={loc.city}
              href={loc.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-2xl p-8 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-secondary-foreground mb-3">
                {loc.city}
              </h3>
              <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed">
                {loc.address}
              </p>
              <span className="inline-block mt-4 font-body text-sm text-primary group-hover:underline">
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
