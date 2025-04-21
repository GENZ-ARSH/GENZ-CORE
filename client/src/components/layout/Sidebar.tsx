import React from 'react';
import { Link, useLocation } from 'wouter';
import { useSidebar } from '@/contexts/SidebarContext';
import { useUser } from '@/contexts/UserContext';
import { LucideHome, LibraryBig, BookPlus, Settings, CheckSquare, Users, Download } from 'lucide-react';

export default function Sidebar() {
  const [location] = useLocation();
  const { isOpen } = useSidebar();
  const { user } = useUser();

  const navigationItems = [
    { icon: <LucideHome className="h-5 w-5" />, label: 'Home Dashboard', href: '/' },
    { icon: <LibraryBig className="h-5 w-5" />, label: 'Library & Resources', href: '/library' },
    { icon: <BookPlus className="h-5 w-5" />, label: 'Request Book', href: '/request' },
    { icon: <Settings className="h-5 w-5" />, label: 'Admin Panel', href: '/admin', adminOnly: true },
    { icon: <CheckSquare className="h-5 w-5" />, label: 'To-Do & Tasks', href: '/tasks' },
    { icon: <Users className="h-5 w-5" />, label: 'TeamGENZ Dashboard', href: '/team' },
    { icon: <Download className="h-5 w-5" />, label: 'Download Center', href: '/downloads' },
  ];

  const userNavItems = [
    { icon: <LucideHome className="h-5 w-5" />, label: 'Profile', href: '/profile' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/settings' },
  ];

  if (!isOpen) return null;

  // Custom NavLink component to avoid nesting <a> inside <a>
  const NavLink = ({ href, isActive, icon, label, onClick }: { 
    href: string;
    isActive: boolean;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }) => {
    return (
      <div
        className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${
          isActive 
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 neon-glass-primary' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        onClick={() => {
          window.history.pushState({}, '', href);
          if (onClick) onClick();
        }}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
    );
  };

  return (
    <>
      <aside className="sidebar-transition w-64 md:block bg-white dark:bg-gray-800 shadow-lg h-full neon-glass z-30">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="bg-primary text-white p-1.5 rounded neon-glass-primary">
                <LibraryBig className="h-5 w-5" />
              </span>
              <span className="font-bold text-lg neon-text">TeamGENZ</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigationItems.map((item) => {
              // Skip admin-only items if user is not admin
              if (item.adminOnly && user?.role !== 'admin') return null;
              
              const isActive = location === item.href;
              
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isActive={isActive}
                  icon={item.icon}
                  label={item.label}
                />
              );
            })}

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            {userNavItems.map((item) => {
              const isActive = location === item.href;
              
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isActive={isActive}
                  icon={item.icon}
                  label={item.label}
                />
              );
            })}
          </nav>

          {/* User */}
          {user && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={`${user.fullName}'s avatar`} 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3 neon-glass-primary">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{user.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        onClick={() => useSidebar().close()}
      />
    </>
  );
}
