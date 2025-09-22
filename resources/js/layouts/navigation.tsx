import { useState } from "react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Menu, MapPin, Home, Store, Calendar, User } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#home", label: "Beranda", icon: Home },
    { href: "#map", label: "Peta Wisata", icon: MapPin },
    { href: "#umkm", label: "UMKM", icon: Store },
    { href: "#events", label: "Agenda", icon: Calendar },
    { href: "#login", label: "Login", icon: User },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-primary">Desa Sungai Deras</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
