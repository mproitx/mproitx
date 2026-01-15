import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import IntersectObserver from '@/components/common/IntersectObserver';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Header } from '@/components/layouts/Header';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Toaster } from '@/components/ui/toaster';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import { BookOpen } from 'lucide-react';
import routes from './routes';

// Loading component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-bounce-slow">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">लोड हो रहा है...</p>
      </div>
    </div>
  );
}

// Layout wrapper component
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const noLayoutPaths = ['/login', '/signup'];
  const isNoLayout = noLayoutPaths.includes(location.pathname);

  if (isNoLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <MainLayout>{children}</MainLayout>
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <AuthProvider>
          <RouteGuard>
            <IntersectObserver />
            <LayoutWrapper>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </LayoutWrapper>
            <Toaster />
            <PWAInstallPrompt />
          </RouteGuard>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
