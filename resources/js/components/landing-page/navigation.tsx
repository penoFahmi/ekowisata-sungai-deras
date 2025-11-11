import { useState, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, MapPin, Home, Store, Calendar, User, Camera, LogOut, LayoutDashboard } from "lucide-react";
import { PageProps } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { auth } = usePage<PageProps>().props;

  const navItems = [
    {
        href: "/",
        label: "Beranda",
        icon: Home
    },
    {
        href: "/wisata-list",
        label: "Wisata",
        icon: MapPin
    },
    {
        href: "/umkm-list",
        label: "UMKM",
        icon: Store
    },
    {
        href: "/agenda-list",
        label: "Agenda",
        icon: Calendar
    },
    {
        href: "/bank-foto",
        label: "Bank Foto Digital",
        icon: Camera
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const scrollPosition = window.scrollY + 100;
      let currentSection = "";

      navItems.forEach(item => {
        if (item.href.startsWith('#')) {
          const element = document.querySelector(item.href);
          if (element instanceof HTMLElement) {
            if (element.offsetTop <= scrollPosition) {
              currentSection = item.href;
            }
          }
        }
      });

      if (window.scrollY < 100) {
        currentSection = "#home";
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.visit(href);
    }
  };

  const handleLogout = () => {
    router.post(route('logout'));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-lg border-b shadow-md' : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logodesa.png" alt="Logo Desa Sungai Deras" className="h-9 w-auto" />
          <h1 className={`text-xl font-bold transition-colors ${
              isScrolled ? 'text-primary' : 'text-white'
          }`}>Desa Sungai Deras</h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`relative font-medium transition-colors duration-300 py-2 border-b-2
                ${activeSection === item.href
                  ? (isScrolled ? 'border-primary text-primary' : 'border-white text-white')
                  : (isScrolled
                    ? 'border-transparent text-gray-700 hover:text-primary'
                    : 'border-transparent text-white hover:text-white/80')
                }`}
            >
              {item.label}
            </button>
          ))}
          {auth.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} alt={auth.user.name} />
                    <AvatarFallback>{auth.user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {auth.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {auth.user.is_admin && (
                  <DropdownMenuItem asChild>
                    <Link href={route('dashboard')} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => handleNavClick(route('login'))} variant={isScrolled ? 'default' : 'secondary'}>Login</Button>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col h-full">
              <div className="flex-grow mt-8 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${activeSection === item.href ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-gray-100'}`}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto mb-6">
                <div className="h-px bg-gray-200 my-4" />
                {auth.user ? (
                  <div className="space-y-2">
                    {auth.user.is_admin && (
                      <Link href={route('dashboard')} onClick={() => setIsOpen(false)} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                        <LayoutDashboard className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600">
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Log out</span>
                    </button>
                    <div className="flex items-center gap-3 pt-4 px-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} alt={auth.user.name} />
                        <AvatarFallback>{auth.user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold leading-none">{auth.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{auth.user.email}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => handleNavClick(route('login'))} className="w-full">Login</Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
