import spanishLatte from "@/assets/spanish-latte.jpg";
import sandwich from "@/assets/sandwich.jpg";
import icedCoffee from "@/assets/iced-coffee.jpg";
import menuSpread from "@/assets/menu-spread.jpg";

const categories = [
  { name: "Hot Coffee", items: ["Espresso · EGP 45", "Café Macchiato · EGP 50", "Classic Cortado · EGP 75", "Caramel Cortado · EGP 85", "Spanish Latte · EGP 90"] },
  { name: "Specialty Coffee", items: ["Espresso Conbana · EGP 65", "Coffee Shake · EGP 135", "Pistachio Latte · EGP 110"] },
  { name: "Iced Drinks", items: ["Iced Latte · EGP 85", "Iced Mocha · EGP 95", "Cold Brew · EGP 80"] },
  { name: "Sandwiches", items: ["Smoked Turkey SQR Bun", "Chicken Caesar", "Roast Beef Sourdough"] },
];

const highlights = [
  { name: "Spanish Latte", tag: "Best Seller", img: spanishLatte },
  { name: "Smoked Turkey Bun", tag: "Fan Favorite", img: sandwich },
  { name: "Iced Coffee", tag: "Refreshing", img: icedCoffee },
];

const MenuHighlights = () => {
  return (
    <section id="menu" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 text-center">
          Our Menu
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Crafted to Perfection
        </h2>
        <p className="font-body text-muted-foreground text-center max-w-md mx-auto mb-16">
          From rich espressos to artisan sandwiches — every item is made with premium ingredients.
        </p>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {highlights.map((item) => (
            <div key={item.name} className="group relative rounded-2xl overflow-hidden aspect-square">
              <img
                src={item.img}
                alt={item.name}
                loading="lazy"
                width={640}
                height={640}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="font-body text-xs uppercase tracking-wider text-primary bg-secondary/80 px-3 py-1 rounded-full mb-2 inline-block">
                  {item.tag}
                </span>
                <h3 className="font-display text-2xl font-semibold text-secondary-foreground">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Full menu image + categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <img
            src={menuSpread}
            alt="Shayboub coffee spread"
            loading="lazy"
            width={1280}
            height={720}
            className="rounded-2xl w-full object-cover"
          />
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat.name}>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-primary inline-block" />
                  {cat.name}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="font-body text-muted-foreground text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <a
              href="https://shaypoub.alimento.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground font-body font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              View Full Menu & Order
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuHighlights;
