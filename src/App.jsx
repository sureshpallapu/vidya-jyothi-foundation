import { BrowserRouter, Routes, Route } from "react-router-dom";

import WebsiteLayout from "./layouts/WebsiteLayout";
import ScrollToTop from "./components/ScrollToTop";

/* Public Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Founder from "./pages/Founder";
import Scholarship from "./pages/Scholarship";
import Transparency from "./pages/Transparency";
import Volunteer from "./pages/Volunteer";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Donors from "./pages/Donors";
import BankRecords from "./pages/BankRecords";
import NotFound from "./pages/NotFound";

/* Gallery */
import PhotoGallery from "./pages/gallery/PhotoGallery";
import EventsVisits from "./pages/gallery/EventsVisits";
import MediaCoverage from "./pages/gallery/MediaCoverage";
import VideoGallery from "./pages/gallery/VideoGallery";

/* Scholarship */
import ScholarshipApplication from "./pages/scholarship/ScholarshipApplication";
import ApplicationSuccess from "./pages/scholarship/ApplicationSuccess";
import CheckStatus from "./pages/scholarship/CheckStatus";

/* Admin */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/layout/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import Applications from "./pages/admin/applications/Applications";
import ApplicationDetails from "./pages/admin/applications/ApplicationDetails";
import ScholarshipCycles from "./pages/admin/scholarshipCycles/ScholarshipCycles";
import Admins from "./pages/admin/admins/Admins";


import RoleProtectedRoute
from "./components/admin/RoleProtectedRoute";
function App() {

  return (

    <BrowserRouter basename={import.meta.env.BASE_URL}>

      <ScrollToTop />

      <Routes>

        {/* ===================================================== */}
        {/* Public Website */}
        {/* ===================================================== */}

        <Route element={<WebsiteLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/founder"
            element={<Founder />}
          />

          <Route
            path="/scholarships"
            element={<Scholarship />}
          />

          <Route
            path="/transparency"
            element={<Transparency />}
          />

          <Route
            path="/volunteer"
            element={<Volunteer />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/donate"
            element={<Donate />}
          />

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/terms-and-conditions"
            element={<TermsConditions />}
          />

          <Route
            path="/donors"
            element={<Donors />}
          />

          <Route
            path="/bank-records"
            element={<BankRecords />}
          />

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
          />

          <Route
            path="/apply"
            element={<ScholarshipApplication />}
          />

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

        </Route>

        {/* ===================================================== */}
        {/* Admin Login */}
        {/* ===================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ===================================================== */}
        {/* Admin Panel */}
        {/* ===================================================== */}

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

          <Route
            path="cycles"
            element={<ScholarshipCycles />}
          />

          <Route
  path="admins"
  element={
    <RoleProtectedRoute
      allowedRoles={["SUPER_ADMIN"]}
    >
      <Admins />
    </RoleProtectedRoute>
  }
/>

        </Route>

        {/* ===================================================== */}
        {/* 404 */}
        {/* ===================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;