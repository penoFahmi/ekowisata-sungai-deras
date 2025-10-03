import { useState } from "react";
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
  const { auth } = usePage<PageProps>().props;

  const navItems = [
    {
        href: "#home",
        label: "Beranda",
        icon: Home
    },
    {
        href: "#map",
        label: "Peta Wisata",
        icon: MapPin
    },
    {
        href: "#umkm",
        label: "UMKM",
        icon: Store
    },
    {
        href: "#events",
        label: "Agenda",
        icon: Calendar
    },
    {
        href: "/bank-foto",
        label: "Bank Foto Digital",
        icon: Camera
    },
  ];
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-primary">Desa Sungai Deras</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-gray-600 hover:text-primary transition-colors"
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
            <Button onClick={() => handleNavClick(route('login'))}>Login</Button>
          )}
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
              {[...navItems, !auth.user && { href: route('login'), label: 'Login', icon: User }].filter(Boolean).map((item) => {
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
              {auth.user && (
                <>
                    <div className="px-3 pt-4">
                        <div className="h-px bg-gray-200" />
                    </div>
                    <button onClick={handleLogout} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-red-500">
                        <LogOut className="h-5 w-5" />
                        <span>Log out</span>
                    </button>
                </>)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
