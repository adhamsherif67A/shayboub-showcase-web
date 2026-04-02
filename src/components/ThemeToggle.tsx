import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { highContrast, toggleHighContrast } = useTheme();
  const { language } = useLanguage();

  const content = {
    en: {
      highContrast: "High Contrast",
      normal: "Normal",
      enabled: "High Contrast Enabled",
      disabled: "Normal Mode",
    },
    ar: {
      highContrast: "تباين عالي",
      normal: "عادي",
      enabled: "تباين عالي مفعل",
      disabled: "الوضع العادي",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleHighContrast}
      className="relative hover:bg-accent transition-all duration-300"
      aria-label={highContrast ? t.enabled : t.disabled}
      title={highContrast ? t.enabled : t.disabled}
    >
      <Contrast 
        className={`h-5 w-5 transition-all duration-300 ${
          highContrast 
            ? 'text-primary rotate-180' 
            : 'text-muted-foreground'
        }`} 
      />
    </Button>
  );
}
