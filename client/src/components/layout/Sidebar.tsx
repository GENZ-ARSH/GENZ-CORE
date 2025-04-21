import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  Book,
  FileText,
  Users,
  BarChart,
  Settings,
  Download,
  ClipboardList,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Library,
  MessageSquare,
  LineChart,
  CheckSquare
} from 'lucide-react';

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Library', href: '/library', icon: Library },
    { name: 'Forums', href: '/forums', icon: MessageSquare },
    { name: 'Study Groups', href: '/study-groups', icon: Users },
    { name: 'Practice Tests', href: '/practice-tests', icon: FileText },
    { name: 'Progress Tracking', href: '/progress', icon: LineChart },
    { name: 'Downloads', href: '/downloads', icon: Download },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Team Dashboard', href: '/team', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30">
      <div className="flex flex-col gap-y-5 overflow-y-auto bg-background/60 backdrop-blur-lg border-r border-r-primary/10 w-64 px-6 pb-4 shadow-[5px_0_15px_rgba(var(--primary),0.1)]">
        <div className="flex h-16 items-center border-b w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              TeamGENZ Admin
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 ml-2">
            Menu
          </div>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex gap-x-3 rounded-md p-2 text-sm font-medium",
                      isActive
                        ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                        : "text-muted-foreground hover:bg-accent/30 hover:text-primary hover:shadow-[0_0_10px_rgba(var(--primary),0.1)] backdrop-blur-sm"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="pt-2 mt-auto border-t">
          <Link
            href="/"
            className="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Exit Admin
          </Link>
        </div>
      </div>
    </div>
  );
}