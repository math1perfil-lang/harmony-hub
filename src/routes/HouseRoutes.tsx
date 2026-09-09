import { Routes, Route } from 'react-router-dom';
import HouseLanding from '@/pages/HouseLanding';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import AboutPage from '@/pages/AboutPage';
import RulesPage from '@/pages/RulesPage';
import SocialPage from '@/pages/SocialPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import CompleteProfilePage from '@/pages/CompleteProfilePage';
import EventChatPage from '@/pages/EventChatPage';
import AdminPage from '@/pages/admin/AdminPage';
import NotFound from '@/pages/NotFound';

export default function HouseRoutes() {
  return (
    <Routes>
      <Route index element={<HouseLanding />} />
      <Route path="eventos" element={<EventsPage />} />
      <Route path="evento/:eventId" element={<EventDetailPage />} />
      <Route path="evento/:eventId/social" element={<SocialPage />} />
      <Route path="evento/:eventId/chat/:otherProfileId" element={<EventChatPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="cadastro" element={<SignupPage />} />
      <Route path="completar-perfil" element={<CompleteProfilePage />} />
      <Route path="sobre" element={<AboutPage />} />
      <Route path="regras" element={<RulesPage />} />
      <Route path="painel/*" element={<AdminPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
