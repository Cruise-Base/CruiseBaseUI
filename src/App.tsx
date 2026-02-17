import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { ForgotPasswordPage } from '@/pages/ForgotPassword';
import { ResetPasswordPage } from '@/pages/ResetPassword';
import { ProfilePage } from '@/pages/Profile';
import { MyFleetPage } from '@/pages/MyFleet';
import DriverDashboard from '@/pages/DriverDashboard';
import OwnerDashboard from '@/pages/OwnerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import { ContractCreationPage } from '@/pages/ContractCreation';
import WalletPage from '@/pages/Wallet';
import { EmailVerificationPage } from '@/pages/EmailVerification';
import { Layout } from '@/components/Layout';

import { Toaster } from 'react-hot-toast';

const Unauthorized = () => <div className="flex items-center justify-center min-h-screen text-white">Unauthorized Access</div>;
const NotFound = () => <div className="flex items-center justify-center min-h-screen text-white">404 - Not Found</div>;

function App() {
  const { user } = useAuthStore();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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

            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<ProtectedRoute allowedRoles={['Driver']} />}>
              <Route path="/driver" element={<DriverDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Owner']} />}>
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/fleet" element={<MyFleetPage />} />
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

        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </>
  );
}

export default App;
