import { useState } from 'react';
import { Link } from 'wouter';
import { useTheme } from '@/contexts/ThemeProvider';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Lock, Search, Menu, X, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSetAdmin: (isAdmin: boolean) => void;
}

export default function Header({ onSetAdmin }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated, checkAdminPassword } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    // Redirect to home if needed
  };

  const handleAdminAuth = (password: string) => {
    const isAdmin = checkAdminPassword(password);
    if (isAdmin) {
      onSetAdmin(true);
    }
    return isAdmin;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              TeamGENZ
            </span>
          </Link>

          <div className="hidden md:flex">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/library" className="transition-colors hover:text-primary">
                Library
              </Link>
              <Link href="/book-request" className="transition-colors hover:text-primary">
                Book Request
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for books..."
              className="pl-8 pr-2 py-1 w-[200px] sm:w-[300px] rounded-full border-muted-foreground/40"
            />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="hover:bg-transparent hover:text-primary"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-primary">
                <Plus className="h-5 w-5" />
                <span className="sr-only">Quick actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/book-request')}>
                <BookPlus className="mr-2 h-4 w-4" />
                New Book Request
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/library')}>
                <Search className="mr-2 h-4 w-4" />
                Quick Search
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsAuthDialogOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                Login
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AuthDialog 
            isOpen={isAuthDialogOpen}
            onClose={() => setIsAuthDialogOpen(false)}
            defaultTab="admin"
          />

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-transparent hover:text-primary"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">
            <div className="relative w-full mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for books..."
                className="pl-8 w-full"
              />
            </div>
            <Link 
              href="/" 
              className="block py-2 px-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/library" 
              className="block py-2 px-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Library
            </Link>
            <Link 
              href="/book-request" 
              className="block py-2 px-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Request
            </Link>
            {!isAuthenticated && (
              <Button 
                variant="default" 
                className="w-full mt-2"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthDialogOpen(true);
                }}
              >
                Login / Register
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}