import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserLayout from "./components/UserLayout.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import MyCard from "./pages/MyCard.jsx";
import SavedCards from "./pages/SavedCards.jsx";
import Inquiry from "./pages/Inquiry.jsx";
import PublicCard from "./pages/PublicCard.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import PricingClient from "./pages/Pricing.jsx";
import Contacts from "./pages/Contacts.jsx";
import "./index.css"; // make sure your CSS for the button is loaded

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prices" element={<PricingClient />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/card/:id" element={<Inquiry />} />
          <Route path="/cards/:id" element={<PublicCard />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="my-card" element={<MyCard />} />
            <Route path="saved-cards" element={<SavedCards />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919236553585"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
        />
      </a>
    </AuthProvider>
  );
}

export default App;
