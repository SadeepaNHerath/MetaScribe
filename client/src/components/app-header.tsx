import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    <header className="bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Search className="text-primary mr-2 h-5 w-5" />
            <h1 className="text-xl font-bold text-primary">SEO Tag Analyzer</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:block">
              <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
