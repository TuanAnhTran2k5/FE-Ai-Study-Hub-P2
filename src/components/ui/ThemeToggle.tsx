import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="size-10 border-border cursor-pointer hover:scale-105 hover:border-primary-hover hover:bg-primary-bg-hover hover:text-primary active:scale-95"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

export default ThemeToggle;