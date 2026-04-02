import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Moon, Sun, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { highContrast, toggleHighContrast, darkMode, toggleDarkMode } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const content = {
    en: {
      title: "Appearance",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      highContrast: "High Contrast",
      normal: "Normal Contrast",
    },
    ar: {
      title: "المظهر",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      highContrast: "تباين عالي",
      normal: "تباين عادي",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent transition-all duration-300"
          aria-label={t.title}
        >
          {darkMode ? (
            <Moon className="h-5 w-5 text-primary animate-in spin-in-180 duration-500" />
          ) : (
            <Sun className="h-5 w-5 text-orange-500 animate-in spin-in-180 duration-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
        <DropdownMenuLabel>{t.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer">
          <div className="flex items-center gap-2 w-full">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{darkMode ? t.lightMode : t.darkMode}</span>
            {darkMode && <span className="ml-auto text-primary">✓</span>}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleHighContrast} className="cursor-pointer">
          <div className="flex items-center gap-2 w-full">
            <Contrast className="h-4 w-4" />
            <span>{highContrast ? t.normal : t.highContrast}</span>
            {highContrast && <span className="ml-auto text-primary">✓</span>}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
