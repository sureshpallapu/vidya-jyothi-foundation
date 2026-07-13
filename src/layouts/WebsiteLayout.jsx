import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function WebsiteLayout() {

  return (

    <>

      <Navbar />

      <main>

        <Outlet />

      </main>

      <Footer />

    </>

  );

}

export default WebsiteLayout;