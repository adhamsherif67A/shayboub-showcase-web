import { useState } from "react";
import { menuData } from "@/data/menu";

const tagStyles: Record<string, string> = {
  new: "bg-green-600 text-white",
  spicy: "bg-red-500 text-white",
  top: "bg-primary text-primary-foreground",
};

const tagLabels: Record<string, string> = {
  new: "NEW",
  spicy: "🌶 SPICY",
  top: "⭐ TOP",
};

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const category = menuData[activeCategory];

  return (
    <section id="menu" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 text-center">
          Winter Menu
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Crafted to Perfection
        </h2>
        <p className="font-body text-muted-foreground text-center max-w-md mx-auto mb-12">
          From rich espressos to artisan sandwiches — every item is made with premium ingredients.
        </p>

        {/* Category tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-10 scrollbar-hide">
          {menuData.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={`whitespace-nowrap font-body text-sm font-medium px-5 py-2.5 rounded-full border transition-all shrink-0 ${
                i === activeCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Category title */}
        <h3 className="font-display text-2xl font-semibold text-primary mb-8">
          {category.name}
        </h3>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {category.items.map((item) => (
            <div
              key={item.name}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden bg-muted relative">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.tags && item.tags.length > 0 && (
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagStyles[tag] || "bg-muted text-foreground"}`}
                      >
                        {tagLabels[tag] || tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-body font-semibold text-foreground text-sm mb-1">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="font-body text-xs text-muted-foreground mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <p className="font-body text-primary font-bold text-sm">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order CTA */}
        <div className="text-center mt-12">
          <a
            href="https://shaypoub.alimento.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Order Online Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
