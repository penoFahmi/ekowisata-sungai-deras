import { usePage, Link, router } from "@inertiajs/react";
import { Button } from "../ui/button";
import { User, LogOut, LayoutDashboard, ArrowLeft } from "lucide-react";
import { PageProps } from "@/types";
import { // Import DropdownMenu components
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfilePageHeader() {
  const { auth } = usePage<PageProps>().props;

  const handleLogout = () => {
    router.post(route('logout'));
  };

  return (
    <header className="border-b border-white/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Back Button */}
          <div className="flex items-center gap-4">
            <Link href={route('bank-foto.index')} className="flex items-center gap-3">
                <img src="/logo-pmm.PNG" alt="Logo PMM" className="h-10 w-auto rounded-md" />
                <div>
                  <h1 className="font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">PhotoBank</h1>
                  <p className="text-xs text-muted-foreground -mt-1">Desa Sungai Deras</p>
                </div>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <Link href={route('bank-foto.index')}>
                <Button variant="outline" className="bg-white/50 hover:bg-white/80">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Galeri
                </Button>
            </Link>
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
                  {/* Assuming a 'profile.edit' route exists for editing profile details */}
                  <Link href={route('profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
