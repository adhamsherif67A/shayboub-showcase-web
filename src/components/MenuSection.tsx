import { useState, memo } from "react";
import { menuData } from "@/data/menu";
import { useAnimateOnScroll } from "@/hooks/use-animate-on-scroll";

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

// Memoized menu item component for better rendering performance
const MenuItemCard = memo(({ item, index }: { item: typeof menuData[0]['items'][0]; index: number }) => (
  <article
    className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 
      hover:-translate-y-2 hover:shadow-xl transition-all duration-300 animate-scale-in"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="aspect-square overflow-hidden bg-muted relative">
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        decoding="async"
        width={400}
        height={400}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {item.tags && item.tags.length > 0 && (
        <div className="absolute top-2 left-2 flex gap-1" aria-label="Item tags">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagStyles[tag] || "bg-muted text-foreground"} 
                group-hover:scale-110 transition-transform`}
            >
              {tagLabels[tag] || tag}
            </span>
          ))}
        </div>
      )}
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
    </div>
    <div className="p-4">
      <h4 className="font-body font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
        {item.name}
      </h4>
      {item.description && (
        <p className="font-body text-xs text-muted-foreground mb-2 line-clamp-2">
          {item.description}
        </p>
      )}
      <p className="font-body text-primary font-bold text-sm" aria-label={`Price: ${item.price}`}>
        {item.price}
      </p>
    </div>
  </article>
));

MenuItemCard.displayName = 'MenuItemCard';

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const category = menuData[activeCategory];
  const { ref: sectionRef, isVisible } = useAnimateOnScroll<HTMLElement>();

  return (
    <section id="menu" className="section-padding" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <p className={`font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Winter Menu
        </p>
        <h2 className={`font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Crafted to Perfection
        </h2>
        <p className={`font-body text-muted-foreground text-center max-w-md mx-auto mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          From rich espressos to artisan sandwiches — every item is made with premium ingredients.
        </p>

        {/* Category tabs */}
        <nav 
          className="flex overflow-x-auto gap-2 pb-4 mb-10 scrollbar-hide"
          role="tablist"
          aria-label="Menu categories"
        >
          {menuData.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              role="tab"
              aria-selected={i === activeCategory}
              aria-controls={`menu-panel-${i}`}
              className={`whitespace-nowrap font-body text-sm font-medium px-5 py-2.5 rounded-full border 
                transition-all duration-300 shrink-0 hover:scale-105 active:scale-95 ${
                i === activeCategory
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Category title */}
        <h3 className="font-display text-2xl font-semibold text-primary mb-8 animate-fade-in" key={category.name}>
          {category.name}
        </h3>

        {/* Items grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          role="tabpanel"
          id={`menu-panel-${activeCategory}`}
          aria-labelledby={`tab-${activeCategory}`}
          key={activeCategory}
        >
          {category.items.map((item, index) => (
            <MenuItemCard key={item.name} item={item} index={index} />
          ))}
        </div>

        {/* Order CTA */}
        <div className="text-center mt-12">
          <a
            href="https://shaypoub.alimento.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-lg 
              hover:opacity-90 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 
              active:scale-95 transition-all duration-300"
          >
            Order Online Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
