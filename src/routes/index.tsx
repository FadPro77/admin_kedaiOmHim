import { Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

import FormPage from '@/pages/form';
import NotFound from '@/pages/not-found';
import DashboardLayout from '@/components/layout/dashboard-layout';
import DashboardPage from '@/pages/dashboard';
import SignInPage from '@/pages/auth/signin';
import MenuPage from '@/pages/menu';
import PengeluaranPage from '@/pages/pengeluaran';
import SaldoPage from '@/pages/saldo';
import PaymentPage from '@/pages/payments';
import PesananPage from '@/pages/pesanan';

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <DashboardPage />, index: true },
        { path: 'menu', element: <MenuPage /> },
        { path: 'pengeluaran', element: <PengeluaranPage /> },
        { path: 'form', element: <FormPage /> },
        { path: 'saldo', element: <SaldoPage /> },
        { path: 'payment', element: <PaymentPage /> },
        { path: 'pesanan', element: <PesananPage /> }
      ]
    }
  ];

  const publicRoutes = [
    { path: '/login', element: <SignInPage />, index: true },
    { path: '/404', element: <NotFound /> },
    { path: '*', element: <Navigate to="/404" replace /> }
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
