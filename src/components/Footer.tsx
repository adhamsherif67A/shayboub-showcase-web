import { LOGO_URL } from "@/data/menu";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary text-secondary-foreground/60 section-padding !py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="" className="h-12 w-12 rounded-lg object-contain" aria-hidden="true" />
            <div>
              <h3 className="font-display text-xl font-bold text-secondary-foreground">
                Shayboub <span className="text-primary" lang="ar">شيبوب</span>
              </h3>
              <p className="font-body text-sm">Specialty Coffee & More</p>
            </div>
          </div>

          <nav className="flex gap-8 font-body text-sm" aria-label="Footer navigation">
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

          <div className="flex gap-4" role="list" aria-label="Social media links">
            <a
              href="https://www.facebook.com/Shayboubeg/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm hover:text-primary transition-colors"
              aria-label="Visit Shayboub on Facebook"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/shayboub.eg/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm hover:text-primary transition-colors"
              aria-label="Visit Shayboub on Instagram"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center">
          <p className="font-body text-xs text-secondary-foreground/40">
            © {currentYear} Shayboub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
