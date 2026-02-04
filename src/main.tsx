import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AuthPage } from '@/pages/AuthPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { BuilderPage } from '@/pages/BuilderPage'
import { GalleryPage } from '@/pages/GalleryPage'
import { VaultPage } from '@/pages/VaultPage'
import { TuningPage } from '@/pages/TuningPage'
import { ManualPage } from '@/pages/ManualPage'
import { SupportPage } from '@/pages/SupportPage'
import { PricingPage } from '@/pages/PricingPage'
import { AboutPage } from '@/pages/AboutPage'
import { PolicyPage } from '@/pages/PolicyPage'
import { TermsPage } from '@/pages/TermsPage'
import { Toaster } from '@/components/ui/sonner';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <AuthPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/builder/:id",
    element: <BuilderPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/gallery",
    element: <GalleryPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/vault",
    element: <VaultPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/tuning",
    element: <TuningPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs",
    element: <ManualPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/support",
    element: <SupportPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/about",
    element: <AboutPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/policy",
    element: <PolicyPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </ErrorBoundary>
    <Toaster richColors closeButton theme="dark" />
  </QueryClientProvider>,
)