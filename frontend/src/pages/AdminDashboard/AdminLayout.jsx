import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdMenu } from "react-icons/md";
import Header from "./Header";
import Sidebar from "./SideBar";
import ScrollToTop from "../../components/ScrollToTop";

const AdminLayout = () => {

  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  /* ⭐ RESPONSIVE STATE */
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  /* ================= AUTO LOGOUT ================= */
  useEffect(() => {

    let timer;

    const resetTimer = () => {

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        sessionStorage.clear();
        navigate("/admin-login", { replace: true });
      }, 30 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };

  }, [navigate]);

  /* ================= RESPONSIVE LISTENER ================= */
  useEffect(() => {

    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);

  }, []);

  /* ⭐⭐⭐ MAIN FIX — SYNC SIDEBAR WITH SCREEN SIZE ⭐⭐⭐ */
  useEffect(() => {
    if (!isMobile) {
      setSideBarCollapsed(false);
    }
  }, [isMobile]);

  return (
    <div className="bg-[#f1e4c8] min-h-screen w-full overflow-x-hidden">

      <ScrollToTop />

      <div className="flex h-screen w-full">

        {/* SIDEBAR */}
        <Sidebar
          collapsed={sideBarCollapsed}
          setCollapsed={setSideBarCollapsed}
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* ⭐ FLOATING TOGGLE BUTTON */}
        {isMobile && (
          <motion.button
            onClick={() => {
              setMobileOpen(true);
              setSideBarCollapsed(false); // ⭐ THIS LINE FIXES EVERYTHING
            }}
            whileTap={{ scale: 0.92 }}
            className=" fixed z-[60] bottom-6 left-6 w-14 h-14 rounded-full bg-[#D1B062] text-[#6b1d14] border-4 border-[#FBF4E2] flex items-center justify-center shadow-xl lg:hidden"
          >
            <MdMenu size={26} />
          </motion.button>
        )}

        {/* RIGHT AREA */}
        <div className="flex-1 flex flex-col min-w-0">

          <Header
            showAlerts={showAlerts}
            setShowAlerts={setShowAlerts}
          />

          <main
            className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300
            ${showAlerts ? "blur-sm scale-[0.99] opacity-80" : ""}`}
          >
            <div className="px-3 sm:px-4 md:px-6 py-4 space-y-6">
              <Outlet />
            </div>
          </main>

        </div>

      </div>
    </div>
  );
};

export default AdminLayout;