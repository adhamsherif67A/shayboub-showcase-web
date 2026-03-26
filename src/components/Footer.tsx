const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground/60 section-padding !py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl font-bold text-secondary-foreground mb-1">
              Shayboub <span className="text-primary">شايبوب</span>
            </h3>
            <p className="font-body text-sm">Specialty Coffee & More</p>
          </div>

          <nav className="flex gap-8 font-body text-sm">
            <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
            <a href="#locations" className="hover:text-primary transition-colors">Locations</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a
              href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Talabat
            </a>
          </nav>

          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/Shayboubeg/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm hover:text-primary transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/shayboub.eg/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm hover:text-primary transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center">
          <p className="font-body text-xs text-secondary-foreground/40">
            © {new Date().getFullYear()} Shayboub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
