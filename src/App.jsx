import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Scholarship from "./pages/Scholarship";
import Home from "./pages/Home";
import About from "./pages/About";

import Transparency from "./pages/Transparency";
import Volunteer from "./pages/Volunteer";
import Contact from "./pages/Contact";
import Founder from "./pages/Founder";
import Donate from "./pages/Donate";
import Apply from "./pages/Apply";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
           <Route path="/founder" element={<Founder />} />

        <Route path="/scholarships" element={<Scholarship/>} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
       <Route path="/apply" element={<Apply />} />
       <Route path="/scholarship" element={<Scholarship />} />
     
      <Route
  path="/privacy-policy"
  element={<PrivacyPolicy />}
/>

<Route
  path="/terms-and-conditions"
  element={<TermsConditions />}
/>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;