import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import DriverDashboard from '@/pages/DriverDashboard';
import OwnerDashboard from '@/pages/OwnerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import { ContractCreationPage } from '@/pages/ContractCreation';
import WalletPage from '@/pages/Wallet';
import { Layout } from '@/components/Layout';
const Unauthorized = () => <div className="flex items-center justify-center min-h-screen">Unauthorized Access</div>;
const NotFound = () => <div className="flex items-center justify-center min-h-screen">404 - Not Found</div>;

function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              user?.role === 'Driver' ? <Navigate to="/driver" /> :
                user?.role === 'Owner' ? <Navigate to="/owner" /> :
                  <Navigate to="/admin" />
            }
          />

          <Route element={<ProtectedRoute allowedRoles={['Driver']} />}>
            <Route path="/driver" element={<DriverDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Owner']} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/contracts/new" element={<ContractCreationPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Driver', 'Owner']} />}>
            <Route path="/wallet" element={<WalletPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/404" />} />
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}

export default App;
