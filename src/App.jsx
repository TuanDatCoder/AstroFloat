import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Zodiac from './pages/Zodiac/Zodiac';
import ZodiacDetail from './pages/Zodiac/ZodiacDetail';
import ZodiacMatch from './pages/Zodiac/ZodiacMatch';
import ZodiacBestMatches from './pages/Zodiac/ZodiacBestMatches';
import ZodiacAllMatches from './pages/Zodiac/ZodiacAllMatches';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import Numerology from './pages/Numerology/Numerology';
import NumerologyDetail from './pages/Numerology/NumerologyDetail';
import NameNumerology from './pages/Numerology/NameNumerology';
import NameNumerologyDetail from './pages/Numerology/NameNumerologyDetail';
import PinnacleDetail from './pages/Numerology/PinnacleDetail';
import PinnacleFullAnalysis from './pages/Numerology/PinnacleFullAnalysis';
import Discover from './pages/Discover';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import ChangePassword from './pages/Auth/ChangePassword';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';

import AdminZodiacList from './pages/Admin/Zodiac/AdminZodiacList';
import AdminZodiacForm from './pages/Admin/Zodiac/AdminZodiacForm';
import AdminZodiacDetailManager from './pages/Admin/Zodiac/AdminZodiacDetailManager';
import AdminZodiacMatchList from './pages/Admin/Zodiac/AdminZodiacMatchList';
import AdminZodiacMatchForm from './pages/Admin/Zodiac/AdminZodiacMatchForm';

import AdminNumerologyList from './pages/Admin/Numerology/AdminNumerologyList';
import AdminNumerologyForm from './pages/Admin/Numerology/AdminNumerologyForm';
import AdminNumerologyDetailManager from './pages/Admin/Numerology/AdminNumerologyDetailManager';

import AdminNameNumerologyList from './pages/Admin/Numerology/AdminNameNumerologyList';
import AdminNameNumerologyForm from './pages/Admin/Numerology/AdminNameNumerologyForm';
import AdminNameAdvancedMetricsManager from './pages/Admin/Numerology/AdminNameAdvancedMetricsManager';
import AdminPinnacleList from './pages/Admin/Numerology/AdminPinnacleList';
import AdminPinnacleForm from './pages/Admin/Numerology/AdminPinnacleForm';
import AdminPinnacleDetailManager from './pages/Admin/Numerology/AdminPinnacleDetailManager';
import AdminPinnacleDetailList from './pages/Admin/Numerology/AdminPinnacleDetailList';
import AdminUserPinnacleList from './pages/Admin/Numerology/AdminUserPinnacleList';

import AdminUserList from './pages/Admin/Users/AdminUserList';

import { ROUTES } from './constants';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Index route là trang Home */}
        <Route index element={<Home />} />
        {/* Các trang chức năng */}
        <Route path={ROUTES.DISCOVER} element={<Discover />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.PROFILE_EDIT} element={<EditProfile />} />
        <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
        <Route path={ROUTES.ZODIAC} element={<Zodiac />} />
        <Route path={ROUTES.ZODIAC_DETAIL(':id')} element={<ZodiacDetail />} />
        <Route path={ROUTES.ZODIAC_MATCH} element={<ZodiacMatch />} />
        <Route path={ROUTES.ZODIAC_BEST_MATCHES} element={<ZodiacBestMatches />} />
        <Route path={ROUTES.ZODIAC_ALL_MATCHES} element={<ZodiacAllMatches />} />
        <Route path={ROUTES.NUMEROLOGY} element={<Numerology />} />
        <Route path={ROUTES.NUMEROLOGY_DETAIL(':number')} element={<NumerologyDetail />} />
        <Route path={ROUTES.NAME_NUMEROLOGY} element={<NameNumerology />} />
        <Route path={ROUTES.NAME_NUMEROLOGY_RESULT} element={<NameNumerologyDetail />} />
        <Route path={ROUTES.PINNACLE_DETAIL(':number')} element={<PinnacleDetail />} />
        <Route path={ROUTES.PINNACLE_ANALYSIS} element={<PinnacleFullAnalysis />} />
        <Route path={ROUTES.TERMS} element={<Terms />} />
        <Route path={ROUTES.PRIVACY} element={<Privacy />} />
      </Route>

      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserList />} />
          
          {/* Zodiac Management */}
          <Route path="zodiac" element={<AdminZodiacList />} />
          <Route path="zodiac/new" element={<AdminZodiacForm />} />
          <Route path="zodiac/edit/:id" element={<AdminZodiacForm />} />
          <Route path="zodiac/:id/details" element={<AdminZodiacDetailManager />} />

          {/* Zodiac Matches Management */}
          <Route path="zodiac-matches" element={<AdminZodiacMatchList />} />
          <Route path="zodiac-matches/new" element={<AdminZodiacMatchForm />} />
          <Route path="zodiac-matches/edit/:id" element={<AdminZodiacMatchForm />} />

          {/* Numerology Management */}
          <Route path="numerology" element={<AdminNumerologyList />} />
          <Route path="numerology/new" element={<AdminNumerologyForm />} />
          <Route path="numerology/edit/:number" element={<AdminNumerologyForm />} />
          <Route path="numerology/:number/details" element={<AdminNumerologyDetailManager />} />

          {/* Name Numerology Management */}
          <Route path="name-numerology" element={<AdminNameNumerologyList />} />
          <Route path="name-numerology/new" element={<AdminNameNumerologyForm />} />
          <Route path="name-numerology/edit/:number" element={<AdminNameNumerologyForm />} />
          <Route path="name-advanced-metrics" element={<AdminNameAdvancedMetricsManager />} />

          {/* Pinnacle Management */}
          <Route path="pinnacles" element={<AdminPinnacleList />} />
          <Route path="pinnacles/new" element={<AdminPinnacleForm />} />
          <Route path="pinnacles/edit/:number" element={<AdminPinnacleForm />} />
          <Route path="pinnacles/:number/details" element={<AdminPinnacleDetailManager />} />
          <Route path="pinnacle-details" element={<AdminPinnacleDetailList />} />
          <Route path="user-pinnacles" element={<AdminUserPinnacleList />} />
          {/* Admin Catch-all → redirect về /not-found */}
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Route>
      </Route>

      {/* Trang Not Found độc lập (Outside Layout) */}
      <Route path="/not-found" element={<NotFound />} />

      {/* Trang Unauthorized độc lập (Outside Layout) */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Global Catch-all → redirect về /not-found */}
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
