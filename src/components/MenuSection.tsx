import { useState, memo, useMemo, useEffect } from "react";
import { Search, X, Flame, Star, Sparkles, Coffee, IceCream, Sandwich } from "lucide-react";
import { menuData } from "@/data/menu";
import { useAnimateOnScroll } from "@/hooks/use-animate-on-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

// Filter button options
const filterOptions = [
  { id: "all", label: "All", icon: null },
  { id: "new", label: "New", icon: Sparkles },
  { id: "top", label: "Top Rated", icon: Star },
  { id: "spicy", label: "Spicy", icon: Flame },
  { id: "hot", label: "Hot Drinks", icon: Coffee },
  { id: "cold", label: "Cold Drinks", icon: IceCream },
  { id: "food", label: "Food", icon: Sandwich },
];

// Dietary filter options
const dietaryOptions = [
  { id: "vegan", label: "Vegan", icon: "🌱" },
  { id: "vegetarian", label: "Vegetarian", icon: "🥬" },
  { id: "glutenFree", label: "Gluten Free", icon: "🌾" },
  { id: "dairyFree", label: "Dairy Free", icon: "🥛" },
  { id: "sugarFree", label: "Sugar Free", icon: "🍯" },
];

// Categories for filtering
const hotDrinkCategories = ["Hot Coffee", "Signature Hot", "Hot Sweet Potato", "Hot Chocolate", "Classic Hot Tea", "Hojicha"];
const coldDrinkCategories = ["Ice Coffee", "Ice Tea", "Mojito", "Smoothies", "Fresh Juice", "Shaky Frappe", "Matcha", "Brewing Coffee", "Redbull Creations"];
const foodCategories = ["Crave Club - SQR Bun", "Crave Club - Sourdough", "Bagel", "Salad", "Appetizers", "Sweet Addicts"];

// Skeleton for a single menu item
const MenuItemSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border">
    <Skeleton className="aspect-square w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

// Memoized menu item component for better rendering performance
const MenuItemCard = memo(({ item, index, categoryName }: { item: typeof menuData[0]['items'][0]; index: number; categoryName?: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <article
      className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 
        hover:-translate-y-2 hover:shadow-xl transition-all duration-300 animate-scale-in"
      style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        {/* Skeleton shown while image loads */}
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          width={400}
          height={400}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
        {categoryName && (
          <p className="font-body text-[10px] text-muted-foreground/60 mb-1">
            {categoryName}
          </p>
        )}
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
  );
});

MenuItemCard.displayName = 'MenuItemCard';

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeDietaryFilter, setActiveDietaryFilter] = useState("all");
  const { ref: sectionRef, isVisible } = useAnimateOnScroll<HTMLElement>();
  const [liveMenuData, setLiveMenuData] = useState(menuData);
  const [loadingFirestore, setLoadingFirestore] = useState(true);

  // Load menu from Firestore
  useEffect(() => {
    const loadMenuFromFirestore = async () => {
      try {
        const snapshot = await getDocs(collection(db, "menu"));
        
        if (snapshot.size > 0) {
          // Group items by category
          const categoriesMap = new Map<string, typeof menuData[0]['items']>();
          
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const category = data.category;
            
            if (!categoriesMap.has(category)) {
              categoriesMap.set(category, []);
            }
            
            categoriesMap.get(category)!.push({
              name: data.name,
              price: `EGP ${data.price}`,
              image: data.image,
              description: data.description || undefined,
              tags: data.tags || []
            });
          });
          
          // Convert to menuData format
          const firestoreMenu = Array.from(categoriesMap.entries()).map(([name, items]) => ({
            name,
            items
          }));
          
          setLiveMenuData(firestoreMenu);
        }
      } catch (error) {
        console.error("Error loading menu from Firestore:", error);
        // Keep using hardcoded menuData as fallback
      } finally {
        setLoadingFirestore(false);
      }
    };
    
    loadMenuFromFirestore();
  }, []);

  // Check if we're in search/filter mode
  const isSearchMode = searchQuery.trim() !== "" || activeFilter !== "all" || activeDietaryFilter !== "all";

  // Filtered and searched items
  const filteredItems = useMemo(() => {
    if (!isSearchMode) return null;

    const query = searchQuery.toLowerCase().trim();
    const results: { item: typeof liveMenuData[0]['items'][0]; categoryName: string }[] = [];

    liveMenuData.forEach((category) => {
      // Category-based filtering
      if (activeFilter === "hot" && !hotDrinkCategories.includes(category.name)) return;
      if (activeFilter === "cold" && !coldDrinkCategories.includes(category.name)) return;
      if (activeFilter === "food" && !foodCategories.includes(category.name)) return;

      category.items.forEach((item) => {
        // Tag-based filtering
        if (activeFilter === "new" && !item.tags?.includes("new")) return;
        if (activeFilter === "top" && !item.tags?.includes("top") && !item.tags?.includes("topRated")) return;
        if (activeFilter === "spicy" && !item.tags?.includes("spicy")) return;

        // Dietary filtering
        if (activeDietaryFilter === "vegan" && !item.tags?.includes("vegan")) return;
        if (activeDietaryFilter === "vegetarian" && !item.tags?.includes("vegetarian")) return;
        if (activeDietaryFilter === "glutenFree" && !item.tags?.includes("glutenFree")) return;
        if (activeDietaryFilter === "dairyFree" && !item.tags?.includes("dairyFree")) return;
        if (activeDietaryFilter === "sugarFree" && !item.tags?.includes("sugarFree")) return;

        // Search query filtering
        if (query && !item.name.toLowerCase().includes(query)) return;

        results.push({ item, categoryName: category.name });
      });
    });

    return results;
  }, [searchQuery, activeFilter, activeDietaryFilter, isSearchMode, liveMenuData]);

  const category = liveMenuData[activeCategory];

  const clearSearch = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setActiveDietaryFilter("all");
  };

  return (
    <section id="menu" className="section-padding" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <p className={`font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Winter Menu
        </p>
        <h2 className={`font-display text-4xl md:text-5xl font-bold text-foreground mb-4 text-center transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Crafted to Perfection
        </h2>
        <p className={`font-body text-muted-foreground text-center max-w-md mx-auto mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          From rich espressos to artisan sandwiches — every item is made with premium ingredients.
        </p>

        {/* Search bar */}
        <div className={`max-w-md mx-auto mb-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu... (e.g., latte, chicken)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-full border border-border bg-card text-foreground 
                placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 
                focus:border-primary transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter buttons */}
        <div className={`flex flex-wrap justify-center gap-2 mb-6 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium 
                  transition-all duration-300 hover:scale-105 active:scale-95 ${
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Dietary Filters */}
        <div className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="text-sm text-muted-foreground mr-2 self-center">Dietary:</span>
          {dietaryOptions.map((dietary) => (
            <button
              key={dietary.id}
              onClick={() => setActiveDietaryFilter(dietary.id === activeDietaryFilter ? "all" : dietary.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300
                hover:scale-105 active:scale-95 flex items-center gap-2 ${
                dietary.id === activeDietaryFilter
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-muted text-muted-foreground hover:bg-green-500/10 hover:text-green-600 border border-border hover:border-green-500/50"
              }`}
              aria-pressed={dietary.id === activeDietaryFilter}
            >
              <span>{dietary.icon}</span>
              {dietary.label}
            </button>
          ))}
        </div>

        {/* Show clear button when in search mode */}
        {isSearchMode && (
          <div className="text-center mb-6">
            <button
              onClick={clearSearch}
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Clear filters & show all categories
            </button>
          </div>
        )}

        {/* Category tabs - only show when not in search mode */}
        {!isSearchMode && (
          <nav 
            className="flex overflow-x-auto gap-2 pb-4 mb-10 scrollbar-hide"
            role="tablist"
            aria-label="Menu categories"
          >
            {liveMenuData.map((cat, i) => (
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
        )}

        {/* Search results or category view */}
        {isSearchMode ? (
          <>
            {/* Search results header */}
            <div className="mb-8">
              <h3 className="font-display text-2xl font-semibold text-primary">
                {filteredItems?.length === 0 
                  ? "No items found" 
                  : `Found ${filteredItems?.length} item${filteredItems?.length === 1 ? '' : 's'}`}
              </h3>
              {filteredItems?.length === 0 && (
                <p className="text-muted-foreground mt-2">
                  Try a different search term or filter.
                </p>
              )}
            </div>

            {/* Search results grid */}
            {filteredItems && filteredItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredItems.map(({ item, categoryName }, index) => (
                  <MenuItemCard key={`${categoryName}-${item.name}`} item={item} index={index} categoryName={categoryName} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
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
          </>
        )}

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
