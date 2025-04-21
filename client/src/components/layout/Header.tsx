import { useState } from 'react';
import { Link } from 'wouter';
import { useTheme } from '@/contexts/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sun, Moon, Lock, Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSetAdmin: (isAdmin: boolean) => void;
}

export default function Header({ onSetAdmin }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogin = () => {
    if (password === 'GENZCLANX') {
      onSetAdmin(true);
      setIsDialogOpen(false);
      setPassword('');
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-transparent hover:text-primary"
              >
                <Lock className="h-5 w-5" />
                <span className="sr-only">Admin login</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border border-primary/30 shadow-lg shadow-primary/20 bg-background/90 backdrop-blur">
              <DialogHeader>
                <DialogTitle>Admin Login</DialogTitle>
                <DialogDescription>
                  Enter your password to access admin features.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter password"
                  className={cn(error && "border-red-500")}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin();
                  }}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
              <DialogFooter>
                <Button onClick={handleLogin} className="w-full">
                  Login
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
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
          </nav>
        </div>
      )}
    </header>
  );
}