import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function loadGtag(id) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
}

export default function GoogleAnalytics() {
  const { pathname, search } = useLocation();
  const loaded = useRef(false);

  useEffect(() => {
    if (!GA_ID || !import.meta.env.PROD || loaded.current) return;
    loadGtag(GA_ID);
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!GA_ID || !import.meta.env.PROD || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: pathname + search,
    });
  }, [pathname, search]);

  return null;
}
