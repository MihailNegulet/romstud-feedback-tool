import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ThankYou from './pages/ThankYou';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/main.css';
import Testimonials from './pages/Testimonials';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="page-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/testimonials" element={<Testimonials />} />

          {/* Ruta Publica de Login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta Protejata de Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
