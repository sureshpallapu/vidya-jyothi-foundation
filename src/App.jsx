import { BrowserRouter, Routes, Route } from "react-router-dom";

import WebsiteLayout from "./layouts/WebsiteLayout";
import ScrollToTop from "./components/ScrollToTop";

/* =========================================================
   PUBLIC PAGES
========================================================= */

import Home from "./pages/Home";
import About from "./pages/About";
import Founder from "./pages/Founder";
import Scholarships from "./pages/Scholarship";
import Transparency from "./pages/Transparency";
import Volunteer from "./pages/Volunteer";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Donors from "./pages/Donors";
import BankRecords from "./pages/BankRecords";
import NotFound from "./pages/NotFound";

/* =========================================================
   GALLERY
========================================================= */

import PhotoGallery from "./pages/gallery/PhotoGallery";
import EventsVisits from "./pages/gallery/EventsVisits";
import MediaCoverage from "./pages/gallery/MediaCoverage";
import VideoGallery from "./pages/gallery/VideoGallery";

/* =========================================================
   SCHOLARSHIP
========================================================= */

import ScholarshipApplication from "./pages/scholarship/ScholarshipApplication";
import ApplicationSuccess from "./pages/scholarship/ApplicationSuccess";
import CheckStatus from "./pages/scholarship/CheckStatus";

/* =========================================================
   ADMIN AUTH
========================================================= */

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/layout/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import RoleProtectedRoute from "./components/admin/RoleProtectedRoute";

/* =========================================================
   ADMIN - GENERAL
========================================================= */

import Dashboard from "./pages/admin/Dashboard";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/settings/Settings";
import Admins from "./pages/admin/admins/Admins";

/* =========================================================
   ADMIN - APPLICATIONS
========================================================= */

import Applications from "./pages/admin/applications/Applications";
import ApplicationDetails from "./pages/admin/applications/ApplicationDetails";

/* =========================================================
   ADMIN - SCHOLARSHIP CYCLES
========================================================= */

import ScholarshipCycles from "./pages/admin/scholarshipCycles/ScholarshipCycles";

/* =========================================================
   ADMIN - TRUSTEES
========================================================= */

import Trustees from "./pages/admin/trustees/Trustees";
import AddTrustee from "./pages/admin/trustees/AddTrustee";
import TrusteeDetails from "./pages/admin/trustees/TrusteeDetails";
import EditTrustee from "./pages/admin/trustees/EditTrustee";

/* =========================================================
   ADMIN - TRUST DOCUMENTS
========================================================= */

import TrustDocuments from "./pages/admin/trustDocuments/TrustDocuments";
import AddTrustDocument from "./pages/admin/trustDocuments/AddTrustDocument";
import ViewTrustDocument from "./pages/admin/trustDocuments/ViewTrustDocument";
import EditTrustDocument from "./pages/admin/trustDocuments/EditTrustDocument";

/* =========================================================
   ADMIN - DONORS
========================================================= */

import AdminDonors from "./pages/admin/donors/Donors";
import AdminAddDonor from "./pages/admin/donors/AddDonor";
import AdminEditDonor from "./pages/admin/donors/EditDonor";
import ViewDonor from "./pages/admin/donors/ViewDonor";

/* =========================================================
   ADMIN - DONATIONS
========================================================= */

import AdminDonations from "./pages/admin/donations/Donations";
import AddDonation from "./pages/admin/donations/AddDonation";
import ViewDonation from "./pages/admin/donations/ViewDonation";
import EditDonation from "./pages/admin/donations/EditDonation";

/* =========================================================
   ADMIN - RECEIPTS
========================================================= */

import ReceiptDashboard from "./pages/admin/receipts/ReceiptDashboard";
import ReceiptDetails from "./pages/admin/receipts/ReceiptDetails";
import ReceiptList from "./pages/admin/receipts/ReceiptList";

import ReceiptVerification from "./pages/public/ReceiptVerification";

/* =========================================================
   ADMIN - VOLUNTEERS
========================================================= */

import VolunteerManagement from "./pages/admin/volunteers/VolunteerManagement";
import VolunteerReview from "./pages/admin/volunteers/VolunteerReview";
import VolunteerProfileEdit from "./pages/admin/volunteers/VolunteerProfileEdit";

/* =========================================================
   ADMIN - CERTIFICATES
========================================================= */

import CertificateDetails from "./pages/admin/certificates/CertificateDetails";

/* =========================================================
   ADMIN - ACTIVITIES
========================================================= */

import Activities from "./pages/admin/activities/Activities";
import ActivityCreate from "./pages/admin/activities/ActivityCreate";
import ActivityDetails from "./pages/admin/activities/ActivityDetails";
import ActivityEdit from "./pages/admin/activities/ActivityEdit";


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />

      <Routes>

        {/* =====================================================
            PUBLIC WEBSITE
        ===================================================== */}

        <Route element={<WebsiteLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/founder" element={<Founder />} />

          <Route
            path="/scholarships"
            element={<Scholarships />}
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
            path="/verify/:receiptCode"
            element={<ReceiptVerification />}
          />

          <Route
            path="/donors"
            element={<Donors />}
          />

          <Route
            path="/bank-records"
            element={<BankRecords />}
          />

          {/* Gallery */}

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

          {/* Scholarship */}

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


        {/* =====================================================
            ADMIN LOGIN
        ===================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =====================================================
            ADMIN PANEL
        ===================================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* ===================================================
              DASHBOARD
          =================================================== */}

          <Route
            path="dashboard"
            element={<Dashboard />}
          />


          {/* ===================================================
              APPLICATIONS
          =================================================== */}

          <Route
            path="applications"
            element={<Applications />}
          />

          <Route
            path="applications/:id"
            element={<ApplicationDetails />}
          />


          {/* ===================================================
              SCHOLARSHIP CYCLES
          =================================================== */}

          <Route
            path="cycles"
            element={<ScholarshipCycles />}
          />


          {/* ===================================================
              TRUSTEES
          =================================================== */}

          <Route
            path="trustees"
            element={<Trustees />}
          />

          <Route
            path="trustees/add"
            element={<AddTrustee />}
          />

          <Route
            path="trustees/:id"
            element={<TrusteeDetails />}
          />

          <Route
            path="trustees/:id/edit"
            element={<EditTrustee />}
          />


          {/* ===================================================
              TRUST DOCUMENTS
          =================================================== */}

          <Route
            path="trust-documents"
            element={<TrustDocuments />}
          />

          <Route
            path="trust-documents/add"
            element={<AddTrustDocument />}
          />

          <Route
            path="trust-documents/:id"
            element={<ViewTrustDocument />}
          />

          <Route
            path="trust-documents/:id/edit"
            element={<EditTrustDocument />}
          />


          {/* ===================================================
              DONORS
          =================================================== */}

          <Route
            path="donors"
            element={<AdminDonors />}
          />

          <Route
            path="donors/add"
            element={<AdminAddDonor />}
          />

          <Route
            path="donors/:donorCode"
            element={<ViewDonor />}
          />

          <Route
            path="donors/:donorCode/edit"
            element={<AdminEditDonor />}
          />


          {/* ===================================================
              DONATIONS
          =================================================== */}

          <Route
            path="donations"
            element={<AdminDonations />}
          />

          <Route
            path="donations/add"
            element={<AddDonation />}
          />

          <Route
            path="donations/:donationCode"
            element={<ViewDonation />}
          />

          <Route
            path="donations/:donationCode/edit"
            element={<EditDonation />}
          />


          {/* ===================================================
              RECEIPTS
          =================================================== */}

          <Route
            path="receipts"
            element={<ReceiptDashboard />}
          />

          <Route
            path="receipts/list"
            element={<ReceiptList />}
          />

          <Route
            path="receipts/:receiptCode"
            element={<ReceiptDetails />}
          />


          {/* ===================================================
              CERTIFICATES
          =================================================== */}

          <Route
            path="certificates/:certificateCode"
            element={<CertificateDetails />}
          />


          {/* ===================================================
              VOLUNTEERS
          =================================================== */}

          <Route
            path="volunteers"
            element={<VolunteerManagement />}
          />

          <Route
            path="volunteers/:volunteerCode"
            element={<VolunteerReview />}
          />

          <Route
            path="volunteers/:volunteerCode/edit"
            element={<VolunteerProfileEdit />}
          />


          {/* ===================================================
              ACTIVITIES & EVENTS
          =================================================== */}

          <Route
            path="activities"
            element={<Activities />}
          />

          <Route
            path="activities/create"
            element={<ActivityCreate />}
          />
<Route
  path="activities/:activityCode"
  element={<ActivityDetails />}
/>
<Route
  path="activities/:activityCode/edit"
  element={<ActivityEdit />}
/>
          {/* ===================================================
              REPORTS
          =================================================== */}

          <Route
            path="reports"
            element={<Reports />}
          />


          {/* ===================================================
              SETTINGS
          =================================================== */}

          <Route
            path="settings"
            element={<Settings />}
          />


          {/* ===================================================
              ADMIN MANAGEMENT
          =================================================== */}

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


        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;