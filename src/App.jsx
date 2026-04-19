import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Zodiac from './pages/Zodiac/Zodiac';
import ZodiacDetail from './pages/Zodiac/ZodiacDetail';
import ZodiacMatch from './pages/Zodiac/ZodiacMatch';
import ZodiacBestMatches from './pages/Zodiac/ZodiacBestMatches';
import ZodiacAllMatches from './pages/Zodiac/ZodiacAllMatches';
import Numerology from './pages/Numerology/Numerology';
import NumerologyDetail from './pages/Numerology/NumerologyDetail';
import NameNumerology from './pages/Numerology/NameNumerology';
import NameNumerologyDetail from './pages/Numerology/NameNumerologyDetail';
import PinnacleDetail from './pages/Numerology/PinnacleDetail';
import PinnacleFullAnalysis from './pages/Numerology/PinnacleFullAnalysis';
import Discover from './pages/Discover';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import ChangePassword from './pages/Auth/ChangePassword';

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
 </Route>
 </Routes>
 );
}
