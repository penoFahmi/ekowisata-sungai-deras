import { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Button } from "../ui/button";
import { Upload, User, Camera, Menu, Bell, LogOut, LayoutDashboard, Home, Image } from "lucide-react";
import { PageProps } from "@/types";
import { usePhotoUploadModal } from "@/hooks/use-photo-upload-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function Header() {
  const { auth } = usePage<PageProps>().props;
  const photoUploadModal = usePhotoUploadModal();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const handleUploadClick = () => {
    if (auth.user) {
      photoUploadModal.onOpen();
    } else {
      router.visit(route('login'));
    }
    setMobileMenuOpen(false);
  };

  const handleScrollToGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-white/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href={route('bank-foto')} className="flex items-center gap-3">
              <img src="/logo-pmm.PNG" alt="Logo PMM" className="h-10 w-auto rounded-md" />
              <div>
                <h1 className="font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">PhotoBank</h1>
                <p className="text-xs text-muted-foreground -mt-1">Desa Sungai Deras</p>
              </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Beranda</Link>
            <a href="#gallery-section" onClick={handleScrollToGallery} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Koleksi</a>
          </nav>

          <div className="flex items-center gap-3">
            {auth.user ? (
              <>
                <Button onClick={handleUploadClick} variant="outline" size="sm" className="hidden sm:flex bg-white/50 hover:bg-white/80">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
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
                        <p className="text-xs leading-none text-muted-foreground">{auth.user.email}</p>
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
                    <DropdownMenuItem asChild>
                      <Link href={route('bank-foto.profile')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil Saya</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.visit(route('login'))} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Masuk</span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <div className="flex flex-col h-full pt-8">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                    <Home className="h-5 w-5 text-primary" />
                    <span className="font-medium">Beranda</span>
                  </Link>
                  <a href="#gallery-section" onClick={handleScrollToGallery} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                    <Image className="h-5 w-5 text-primary" />
                    <span className="font-medium">Koleksi</span>
                  </a>
                  <div className="mt-auto mb-6">
                    <div className="h-px bg-gray-200 my-4" />
                    <Button onClick={handleUploadClick} variant="outline" className="w-full mb-2"><Upload className="h-4 w-4 mr-2" />Upload Foto</Button>
                    {!auth.user && <Button onClick={() => router.visit(route('login'))} className="w-full"><User className="h-4 w-4 mr-2" />Masuk</Button>}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
