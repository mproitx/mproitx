import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  BookOpen,
  Brain,
  Bell,
  History,
  Download as DownloadIcon,
  Menu,
  Trophy,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'डैशबोर्ड', href: '/dashboard', icon: Home },
  { name: 'AI सहायक', href: '/ai-helper', icon: Brain },
  { name: 'MCQ टेस्ट', href: '/mcq-test', icon: BookOpen },
  { name: 'लीडरबोर्ड', href: '/leaderboard', icon: Trophy },
  { name: 'हाल ही में देखा', href: '/recently-viewed', icon: History },
  { name: 'डाउनलोड', href: '/downloads', icon: DownloadIcon },
  { name: 'सूचनाएं', href: '/notifications', icon: Bell },
  { name: 'ऐप इंस्टॉल करें', href: '/install-guide', icon: Smartphone },
];

function SidebarContent() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2026 PM - Roit
        </div>
      </div>
    </div>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-sidebar-border bg-sidebar shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 animate-pulse-glow"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
