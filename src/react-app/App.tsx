import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import ServicesPage from "@/react-app/pages/Services";
import HowItWorksPage from "@/react-app/pages/HowItWorks";
import ResourcesPage from "@/react-app/pages/Resources";
import BookPage from "@/react-app/pages/Book";
import FileTaxesPage from "@/react-app/pages/FileTaxes";
import PrivacyPage from "@/react-app/pages/Privacy";
import TermsPage from "@/react-app/pages/Terms";
import AdminPage from "@/react-app/pages/Admin";
import GoogleCalendarCallback from "@/react-app/pages/GoogleCalendarCallback";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/file-taxes" element={<FileTaxesPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/google-callback" element={<GoogleCalendarCallback />} />
      </Routes>
    </Router>
  );
}
