import { ReactNode, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  showAdminSidebar?: boolean;
}

export default function MainLayout({ children, showAdminSidebar = false }: MainLayoutProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  
  const handleSetAdmin = (isAdmin: boolean) => {
    setIsAdmin(isAdmin);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSetAdmin={handleSetAdmin} />
      
      <div className="flex flex-1">
        {isAdmin && showAdminSidebar && <Sidebar />}
        
        <main className={`flex-1 ${isAdmin && showAdminSidebar ? 'lg:pl-64' : ''}`}>
          <div className="container py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}