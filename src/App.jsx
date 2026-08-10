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
import RoleProtectedRoute from "./components/admin/RoleProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import Applications from "./pages/admin/applications/Applications";
import ApplicationDetails from "./pages/admin/applications/ApplicationDetails";
import ScholarshipCycles from "./pages/admin/scholarshipCycles/ScholarshipCycles";
import Admins from "./pages/admin/admins/Admins";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/settings/Settings";
import Trustees from "./pages/admin/trustees/Trustees";
import AddTrustee from "./pages/admin/trustees/AddTrustee";
import TrusteeDetails from "./pages/admin/trustees/TrusteeDetails";
import EditTrustee from "./pages/admin/trustees/EditTrustee";

import TrustDocuments from "./pages/admin/trustDocuments/TrustDocuments";
import AddTrustDocument from "./pages/admin/trustDocuments/AddTrustDocument";
import ViewTrustDocument from "./pages/admin/trustDocuments/ViewTrustDocument";
import EditTrustDocument from "./pages/admin/trustDocuments/EditTrustDocument";

import AdminDonors from "./pages/admin/donors/Donors";
import AdminAddDonor from "./pages/admin/donors/AddDonor";
import AdminEditDonor from "./pages/admin/donors/EditDonor";
import ViewDonor from "./pages/admin/donors/ViewDonor";

import AdminDonations from "./pages/admin/donations/Donations";
import AddDonation from "./pages/admin/donations/AddDonation";
import ViewDonation from "./pages/admin/donations/ViewDonation";
import EditDonation from "./pages/admin/donations/EditDonation";

import ReceiptDashboard from "./pages/admin/receipts/ReceiptDashboard";
import ReceiptDetails from "./pages/admin/receipts/ReceiptDetails";
import ReceiptList from "./pages/admin/receipts/ReceiptList";
// import ReceiptPrint from "./pages/admin/receipts/ReceiptPrint";
import ReceiptVerification from "./pages/public/ReceiptVerification";



import CertificateDetails from "./pages/admin/certificates/CertificateDetails";



function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />

      <Routes>
        {/* ===================================================== */}
        {/* Public Website */}
        {/* ===================================================== */}
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/scholarships" element={<Scholarship />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsConditions />}
          />

          <Route
    path="/verify/:receiptCode"
    element={<ReceiptVerification />}
/>


          <Route path="/donors" element={<Donors />} />
          <Route path="/bank-records" element={<BankRecords />} />
          <Route path="/gallery/photo-gallery" element={<PhotoGallery />} />
          <Route path="/gallery/events-visits" element={<EventsVisits />} />
          <Route path="/gallery/media-coverage" element={<MediaCoverage />} />
          <Route path="/gallery/video-gallery" element={<VideoGallery />} />
          <Route path="/apply" element={<ScholarshipApplication />} />
          <Route
            path="/apply-scholarship"
            element={<ScholarshipApplication />}
          />
          <Route
            path="/application-success"
            element={<ApplicationSuccess />}
          />
          <Route path="/check-status" element={<CheckStatus />} />
        </Route>

        {/* ===================================================== */}
        {/* Admin Login */}
        {/* ===================================================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

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
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Applications */}
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetails />} />

          {/* Scholarship Cycles */}
          <Route path="cycles" element={<ScholarshipCycles />} />

          {/* Trustees */}
          <Route path="trustees" element={<Trustees />} />
          <Route path="trustees/add" element={<AddTrustee />} />
          <Route path="trustees/:id" element={<TrusteeDetails />} />
          <Route path="trustees/:id/edit" element={<EditTrustee />} />

          {/* Trust Documents */}
          <Route path="trust-documents" element={<TrustDocuments />} />
          
          <Route path="trust-documents/add" element={<AddTrustDocument />} />
          <Route path="trust-documents/:id" element={<ViewTrustDocument />} />
          <Route path="trust-documents/:id/edit" element={<EditTrustDocument />} />

{/* ===================================================== */}
{/* Donors */}
{/* ===================================================== */}

<Route path="donors" element={<AdminDonors />} />

<Route path="donors/add" element={<AdminAddDonor />} />

<Route
  path="donors/:donorCode"
  element={<ViewDonor />}
/>

<Route
  path="donors/:donorCode/edit"
  element={<AdminEditDonor />}
/>

{/* ===================================================== */}
{/* Donations */}
{/* ===================================================== */}

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


<Route
    path="receipts/list"
    element={<ReceiptList />}
/>


<Route
    path="receipts"
    element={<ReceiptDashboard />}
/>
<Route
    path="receipts/:receiptCode"
    element={<ReceiptDetails />}
/>


<Route
    path="certificates/:certificateCode"
    element={<CertificateDetails />}
/>


          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />

          {/* Admin Management */}
          <Route
            path="admins"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <Admins />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* ===================================================== */}
        {/* 404 */}
        {/* ===================================================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;