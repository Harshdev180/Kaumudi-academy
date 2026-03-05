import { useEffect } from "react";

export default function SEO({
  title,
  description,
  canonicalPath,
  robots,
  og = {},
  jsonLd,
  keywords,
}) {
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    /* =========================
       TITLE
    ========================== */
    if (title) {
      document.title = title;

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute("content", title);
    }

    /* =========================
       DESCRIPTION
    ========================== */
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);
    }

    /* =========================
       KEYWORDS
    ========================== */
    if (keywords) {
      const content = Array.isArray(keywords)
        ? keywords.join(", ")
        : String(keywords);
      let kw = document.querySelector('meta[name="keywords"]');
      if (!kw) {
        kw = document.createElement("meta");
        kw.setAttribute("name", "keywords");
        document.head.appendChild(kw);
      }
      kw.setAttribute("content", content);
    }

    /* =========================
       ROBOTS
    ========================== */
    if (robots) {
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", robots);
    }

    /* =========================
       CANONICAL + OG URL
    ========================== */
    if (canonicalPath) {
      const href = canonicalPath.startsWith("http")
        ? canonicalPath
        : `${origin}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`;

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", href);

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement("meta");
        ogUrl.setAttribute("property", "og:url");
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute("content", href);
    }

    /* =========================
       OPEN GRAPH + TWITTER
    ========================== */
    const siteName = "Kaumudi Sanskrit Academy";

    // Safe image handling
    let ogImage = og?.image;

    // If object like { url: "..." }
    if (ogImage && typeof ogImage === "object") {
      ogImage = ogImage.url;
    }

    // Ensure string before using startsWith
    if (typeof ogImage !== "string") {
      ogImage = null;
    } else if (!/^https?:\/\//i.test(ogImage)) {
      ogImage = `${origin}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;
    }

    const twitterCard = og?.twitterCard || "summary_large_image";

    const setOg = (property, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setTw = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setOg("og:type", og?.type || "website");
    setOg("og:site_name", siteName);
    setOg("og:locale", og?.locale || "en_IN");
    if (title) setOg("og:title", title);
    if (description) setOg("og:description", description);
    if (ogImage) setOg("og:image", ogImage);

    setTw("twitter:card", twitterCard);
    if (title) setTw("twitter:title", title);
    if (description) setTw("twitter:description", description);
    if (ogImage) setTw("twitter:image", ogImage);

    /* =========================
       JSON-LD
    ========================== */
    let ldScript;
    if (jsonLd) {
      ldScript = document.getElementById("__jsonld");
      if (!ldScript) {
        ldScript = document.createElement("script");
        ldScript.type = "application/ld+json";
        ldScript.id = "__jsonld";
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      if (jsonLd) {
        const s = document.getElementById("__jsonld");
        if (s) s.remove();
      }
    };
  }, [title, description, canonicalPath, robots, og, jsonLd, keywords]);

  return null;
}
