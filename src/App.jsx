import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Zodiac from './pages/Zodiac/Zodiac';
import ZodiacDetail from './pages/Zodiac/ZodiacDetail';
import ZodiacMatch from './pages/Zodiac/ZodiacMatch';
import Numerology from './pages/Numerology/Numerology';
import NumerologyDetail from './pages/Numerology/NumerologyDetail';
import NameNumerology from './pages/Numerology/NameNumerology';
import Discover from './pages/Discover';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Index route là trang Home */}
        <Route index element={<Home />} />
        {/* Các trang chức năng */}
        <Route path="discover" element={<Discover />} />
        <Route path="zodiac" element={<Zodiac />} />
        <Route path="zodiac/:id" element={<ZodiacDetail />} />
        <Route path="zodiac-match" element={<ZodiacMatch />} />
        <Route path="numerology" element={<Numerology />} />
        <Route path="numerology/:number" element={<NumerologyDetail />} />
        <Route path="name-numerology" element={<NameNumerology />} />
      </Route>
    </Routes>
  );
}
