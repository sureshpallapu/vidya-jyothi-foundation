import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Scholarship from "./pages/Scholarship";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Transparency from "./pages/Transparency";
import Volunteer from "./pages/Volunteer";
import Contact from "./pages/Contact";
import Founder from "./pages/Founder";
import Donate from "./pages/Donate";
// import Apply from "./pages/Apply";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

import Donors from "./pages/Donors";
import BankRecords from "./pages/BankRecords";

import ScrollToTop from "./components/ScrollToTop";

import PhotoGallery from "./pages/gallery/PhotoGallery";
import EventsVisits from "./pages/gallery/EventsVisits";
import MediaCoverage from "./pages/gallery/MediaCoverage";
import VideoGallery from "./pages/gallery/VideoGallery";


import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";


import ScholarshipApplication from "./pages/scholarship/ScholarshipApplication";
import ApplicationSuccess from "./pages/scholarship/ApplicationSuccess";
import CheckStatus from "./pages/scholarship/CheckStatus";


import Applications from "./pages/admin/applications/Applications";
import ApplicationDetails from "./pages/admin/applications/ApplicationDetails";


function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
     <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/founder" element={<Founder />} />
        <Route path="/scholarships" element={<Scholarship />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
       <Route
  path="/apply"
  element={<ScholarshipApplication />}
/>
        <Route path="/scholarship" element={<Scholarship />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/bank-records" element={<BankRecords />} />
    
    <Route
  path="/gallery/photo-gallery"
  element={<PhotoGallery />}
/>

<Route
  path="/gallery/events-visits"
  element={<EventsVisits />}
/>

<Route
  path="/gallery/media-coverage"
  element={<MediaCoverage />}
/>

<Route
  path="/gallery/video-gallery"
  element={<VideoGallery />}
/><Route path="*" element={<NotFound />} />
    

<Route path="/admin/login" element={<AdminLogin />} />

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route
    path="dashboard"
    element={<Dashboard />}
  />

  <Route
    path="applications"
    element={<Applications />}
  />

  <Route
  path="applications/:id"
  element={<ApplicationDetails />}
/>
</Route>

<Route
  path="/apply-scholarship"
  element={<ScholarshipApplication />}
/>

<Route
  path="/application-success"
  element={<ApplicationSuccess />}
/>

<Route
  path="/check-status"
  element={<CheckStatus />}
/>





 </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;