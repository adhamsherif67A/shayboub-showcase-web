import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" className="font-display text-xl font-bold text-secondary-foreground">
          Shayboub
        </a>

        <div className="hidden md:flex items-center gap-8 font-body text-sm text-secondary-foreground/70">
          <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
          <a href="#locations" className="hover:text-primary transition-colors">Locations</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Order Now
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-secondary-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-secondary border-t border-secondary-foreground/10 px-6 py-6 space-y-4 font-body text-sm">
          <a href="#menu" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary">Menu</a>
          <a href="#locations" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary">Locations</a>
          <a href="#about" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary">About</a>
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold text-center"
          >
            Order Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
