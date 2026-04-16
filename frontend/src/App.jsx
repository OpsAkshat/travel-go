import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import MyReviews from './pages/MyReviews';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/package/:id" element={<PackageDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/reviews" element={<MyReviews />} />
      </Routes>
    </Router>
  );
}

export default App;
