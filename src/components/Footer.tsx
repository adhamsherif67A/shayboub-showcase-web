import { LOGO_URL } from "@/data/menu";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguage();
  
  return (
    <footer className="bg-secondary text-secondary-foreground/60 section-padding !py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col md:flex-row justify-between items-center gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img src={LOGO_URL} alt="" className="h-12 w-12 rounded-lg object-contain" aria-hidden="true" />
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-display text-2xl font-bold text-primary">
                {isRTL ? 'شيبوب' : 'Shayboub'}
              </h3>
              <p className="font-body text-sm text-secondary-foreground/70">{t.footer.tagline}</p>
            </div>
          </div>

          <nav className={`flex gap-8 font-body text-sm ${isRTL ? 'flex-row-reverse' : ''}`} aria-label="Footer navigation">
            <a href="#menu" className="hover:text-primary transition-colors">{t.footer.links.menu}</a>
            <a href="#locations" className="hover:text-primary transition-colors">{t.footer.links.locations}</a>
            <a href="#about" className="hover:text-primary transition-colors">{t.footer.links.about}</a>
            <a
              href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {t.footer.links.talabat}
            </a>
          </nav>

          <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`} role="list" aria-label="Social media links">
            <a
              href="https://www.facebook.com/Shayboubeg/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm hover:text-primary transition-colors"
              aria-label="Visit Shayboub on Facebook"
            >
              {t.footer.social.facebook}
            </a>
            <a
              href="https://www.instagram.com/shayboub.eg/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm hover:text-primary transition-colors"
              aria-label="Visit Shayboub on Instagram"
            >
              {t.footer.social.instagram}
            </a>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center">
          <p className="font-body text-xs text-secondary-foreground/40">
            © {currentYear} {isRTL ? 'شيبوب' : 'Shayboub'}. {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
