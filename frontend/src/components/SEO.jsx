import { useEffect } from "react";

export default function SEO({
  title,
  description,
  canonicalPath,
  robots,
  og = {},
  jsonLd,
}) {
  useEffect(() => {
    if (title) {
      document.title = title;
      const ogTitle =
        document.querySelector('meta[property="og:title"]') ||
        document.head.appendChild(document.createElement("meta"));
      ogTitle.setAttribute("property", "og:title");
      ogTitle.setAttribute("content", title);
    }
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
      const ogDesc =
        document.querySelector('meta[property="og:description"]') ||
        document.head.appendChild(document.createElement("meta"));
      ogDesc.setAttribute("property", "og:description");
      ogDesc.setAttribute("content", description);
    }
    if (robots) {
      let meta = document.querySelector('meta[name="robots"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "robots");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", robots);
    }
    // canonical
    if (canonicalPath) {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const href = canonicalPath.startsWith("http")
        ? canonicalPath
        : `${origin}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`;
      let link =
        document.querySelector('link[rel="canonical"]') ||
        document.head.appendChild(document.createElement("link"));
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", href);
      const ogUrl =
        document.querySelector('meta[property="og:url"]') ||
        document.head.appendChild(document.createElement("meta"));
      ogUrl.setAttribute("property", "og:url");
      ogUrl.setAttribute("content", href);
    }
    // OpenGraph
    const siteName = "Kaumudi Sanskrit Academy";
    const ogImage = og.image;
    const setOg = (prop, content) => {
      if (!content) return;
      const el =
        document.querySelector(`meta[property="${prop}"]`) ||
        document.head.appendChild(document.createElement("meta"));
      el.setAttribute("property", prop);
      el.setAttribute("content", content);
    };
    setOg("og:type", og.type || "website");
    setOg("og:site_name", siteName);
    if (ogImage) setOg("og:image", ogImage);
    // JSON-LD
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
        s && s.remove();
      }
    };
  }, [title, description, canonicalPath, robots, og.image, og.type, jsonLd]);
  return null;
}
