import { Routes, Route } from 'react-router-dom';
import PlatformLanding from '@/pages/platform/PlatformLanding';
import HousesDirectoryPage from '@/pages/platform/HousesDirectoryPage';
import CreateHousePage from '@/pages/platform/CreateHousePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import AdminPage from '@/pages/admin/AdminPage';
import NotFound from '@/pages/NotFound';

export default function PlatformRoutes() {
  return (
    <Routes>
      <Route index element={<PlatformLanding />} />
      <Route path="casas" element={<HousesDirectoryPage />} />
      <Route path="criar-casa" element={<CreateHousePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="cadastro" element={<SignupPage />} />
      <Route path="painel/*" element={<AdminPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
