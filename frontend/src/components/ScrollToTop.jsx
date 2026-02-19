// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// export default function ScrollToTop() {
//   const { pathname, hash } = useLocation();

//   useEffect(() => {
//     if (hash) {
//       const id = hash.replace("#", "");
//       const el = document.getElementById(id);
//       if (el) {
//         el.scrollIntoView({ behavior: "smooth", block: "start" });
//         return;
//       }
//     }
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [pathname, hash]);

//   return null;
// }


import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {

  const { pathname, hash } = useLocation();

  useEffect(() => {

    // ⭐ Automatically admin main container detect karega
    const container = document.querySelector("main.flex-1");

    // HASH SUPPORT SAME
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
    }

    // ⭐ MAIN FIX — container scroll
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // fallback (agar kabhi window scroll ho)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

  }, [pathname, hash]);

  return null;
}
