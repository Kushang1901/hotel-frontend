"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export const INDIAN_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", region: "Default" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", region: "Gujarat / Dwarka" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "North" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", region: "West" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳", region: "East" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", region: "South" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", region: "South" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", region: "South" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", region: "South" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "North" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳", region: "East" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳", region: "East" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", flag: "🇮🇳", region: "Sacred" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳", region: "All" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", flag: "🇮🇳", region: "West" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇮🇳", region: "North" },
];

const LanguageContext = createContext(null);

// Helper: set or clear googtrans cookies across all domain levels and formats
function setGoogleTransCookies(langCode) {
  if (typeof document === "undefined") return;

  const isEn = !langCode || langCode === "en";
  const cookieVals = isEn ? [""] : [`/en/${langCode}`, `/auto/${langCode}`];
  const maxAge = isEn
    ? "expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    : "max-age=31536000;";

  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const domains = [hostname];

  if (parts.length > 2) {
    domains.push("." + parts.slice(-2).join("."));
  } else if (parts.length === 2 && !hostname.includes(":")) {
    domains.push("." + hostname);
  }

  cookieVals.forEach((val) => {
    // Current host without domain attribute
    document.cookie = `googtrans=${val}; path=/; ${maxAge}`;
    document.cookie = `googtrans=${val}; path=/; SameSite=Lax; ${maxAge}`;

    // Specific domain scopes
    domains.forEach((d) => {
      document.cookie = `googtrans=${val}; path=/; domain=${d}; ${maxAge}`;
      document.cookie = `googtrans=${val}; path=/; domain=${d}; SameSite=Lax; ${maxAge}`;
    });
  });
}

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(INDIAN_LANGUAGES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isClosingLoader, setIsClosingLoader] = useState(false);
  const [transitionInfo, setTransitionInfo] = useState({
    from: INDIAN_LANGUAGES[0],
    to: INDIAN_LANGUAGES[1],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const initializedRef = useRef(false);

  // Synchronize language state on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCode = localStorage.getItem("hotel_devang_lang");

    if (!savedCode || savedCode === "en") {
      setCurrentLang(INDIAN_LANGUAGES[0]);
      setGoogleTransCookies("en");
      return;
    }

    const found = INDIAN_LANGUAGES.find((l) => l.code === savedCode);
    if (found) {
      setCurrentLang(found);
      // Re-assert cookies in case browser session cleared them
      setGoogleTransCookies(found.code);
    }
  }, []);

  // Google Translate Script injection with production-ready callback
  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) return;
    initializedRef.current = true;

    // Define callback on window BEFORE script loads
    window.googleTranslateElementInit = function () {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,gu,mr,bn,ta,te,kn,ml,pa,or,as,sa,ur,sd,ne",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      } catch (err) {
        console.warn("Google Translate init error:", err);
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Suppress top banner and shift without killing translation worker iframes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const suppressBanner = () => {
      // Keep page pinned to top
      if (document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.setProperty("top", "0px", "important");
      }
      if (document.documentElement.style.top && document.documentElement.style.top !== "0px") {
        document.documentElement.style.setProperty("top", "0px", "important");
      }

      // Hide only Google's top popup banner frames
      const banners = document.querySelectorAll(
        '.VIpgJd-ZVi9od-ORHb-OEVmcd, .goog-te-banner-frame, iframe.goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame'
      );
      banners.forEach((el) => {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("height", "0px", "important");
        el.style.setProperty("width", "0px", "important");
        el.style.setProperty("position", "absolute", "important");
        el.style.setProperty("top", "-9999px", "important");
      });
    };

    suppressBanner();
    const interval = setInterval(suppressBanner, 100);

    const observer = new MutationObserver(() => {
      suppressBanner();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const openLanguageModal = () => setIsModalOpen(true);
  const closeLanguageModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
  };

  // Change Language and trigger the Logo Converter Loader
  const changeLanguage = (targetLang) => {
    if (targetLang.code === currentLang.code) {
      closeLanguageModal();
      return;
    }

    closeLanguageModal();

    // 1. Show the Converter Logo Loader
    setTransitionInfo({
      from: currentLang,
      to: targetLang,
    });
    setIsTranslating(true);
    setIsClosingLoader(false);

    // 2. Set Cookies and LocalStorage
    localStorage.setItem("hotel_devang_lang", targetLang.code);
    setGoogleTransCookies(targetLang.code);

    // 3. If switching to English, reload for pristine source text
    if (targetLang.code === "en") {
      setTimeout(() => {
        window.location.reload();
      }, 900);
      return;
    }

    // 4. Try client-side Google Translate select combo trigger
    const triggerTranslateCombo = () => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = targetLang.code;
        combo.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
      return false;
    };

    triggerTranslateCombo();

    // 5. Check if translation succeeded client-side or fallback to reload
    // In production hosted environments, reloading with googtrans cookie set
    // guarantees Google Translate translates the page on initial load.
    setTimeout(() => {
      const isTranslated =
        document.documentElement.classList.contains("translated-ltr") ||
        document.documentElement.classList.contains("translated-rtl");

      if (isTranslated) {
        // Translation applied dynamically
        setIsClosingLoader(true);
        setTimeout(() => {
          setIsTranslating(false);
          setIsClosingLoader(false);
          setCurrentLang(targetLang);
        }, 350);
      } else {
        // Production fallback: clean reload with googtrans cookie active
        window.location.reload();
      }
    }, 1100);
  };

  // Filter languages for search & region
  const filteredLanguages = INDIAN_LANGUAGES.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      selectedRegion === "All" ||
      lang.region.toLowerCase().includes(selectedRegion.toLowerCase());

    return matchesSearch && matchesRegion;
  });

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        languages: INDIAN_LANGUAGES,
        openLanguageModal,
        closeLanguageModal,
        changeLanguage,
      }}
    >
      {children}

      {/* Off-screen Google Translate Container (Must NOT be display: none for Google script to mount) */}
      <div
        id="google_translate_element"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0.01,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: -9999,
        }}
        aria-hidden="true"
      />

      {/* ═══ LANGUAGE SELECTION MODAL ═══ */}
      {isModalOpen && (
        <div className="lang-modal-overlay" onClick={closeLanguageModal}>
          <div className="lang-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="lang-modal-header">
              <div className="lang-modal-title-row">
                <h3 className="lang-modal-title">
                  <i className="fas fa-language"></i> Select Language / ભાષા પસંદ કરો
                </h3>
                <button
                  type="button"
                  className="lang-modal-close-btn"
                  onClick={closeLanguageModal}
                  aria-label="Close language modal"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <p className="lang-modal-subtitle">
                Choose your preferred Indian language to experience Hotel Devang Dwarka
              </p>
            </div>

            {/* Search Input */}
            <div className="lang-search-wrap">
              <div className="lang-search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search language / ભાષા શોધો / भाषा खोजें (e.g. Gujarati, Hindi, Marathi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="lang-search-input"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{ background: "none", border: "none", color: "#caa035", cursor: "pointer" }}
                  >
                    <i className="fas fa-times-circle"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Region Filter Tabs */}
            <div className="lang-filter-tabs">
              {["All", "Gujarat / Dwarka", "North", "West", "South", "East", "Sacred"].map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`lang-tab ${selectedRegion === region ? "active" : ""}`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Language Grid */}
            <div className="lang-grid">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang)}
                    className={`lang-card ${isSelected ? "selected" : ""}`}
                  >
                    <div className="lang-card-top">
                      <span className="lang-flag">{lang.flag}</span>
                      <span className="lang-region-badge">{lang.region}</span>
                    </div>
                    <div className="lang-card-main">
                      <span className="lang-native-name">{lang.nativeName}</span>
                      <span className="lang-english-name">{lang.name}</span>
                    </div>
                    {isSelected && (
                      <span className="lang-selected-check">
                        <i className="fas fa-check-circle"></i> Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="lang-modal-footer">
              <span>
                <i className="fas fa-sparkles" style={{ color: "#ffd700", marginRight: "6px" }}></i>
                Real-time dynamic translation across 15+ Indian languages
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LUXURY LOGO CONVERTER LOADER SCREEN ═══ */}
      {isTranslating && (
        <div className={`logo-converter-overlay ${isClosingLoader ? "fade-out" : ""}`}>
          <div className="logo-converter-content">
            {/* Spinning Rings & Center Logo */}
            <div className="converter-logo-wrapper">
              <div className="converter-ring ring-1"></div>
              <div className="converter-ring ring-2"></div>
              <div className="converter-ring ring-3"></div>
              <div className="converter-logo-center">
                <img src="/Photos/index/logo.png" alt="Hotel Devang" />
              </div>
            </div>

            {/* Title */}
            <h4 className="converter-title">Hotel Devang</h4>
            <p className="converter-status">Translating Experience...</p>

            {/* Transition Language Pills: FROM -> TO */}
            <div className="converter-transition-row">
              <span className="converter-lang-pill from">
                <span>{transitionInfo.from.flag}</span>
                <span>{transitionInfo.from.nativeName}</span>
              </span>

              <div className="converter-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>

              <span className="converter-lang-pill to">
                <span>{transitionInfo.to.flag}</span>
                <span>{transitionInfo.to.nativeName}</span>
              </span>
            </div>

            {/* Gold Progress Shimmer Bar */}
            <div className="converter-progress-bar">
              <div className="converter-progress-fill"></div>
            </div>

            <p className="converter-subtext">
              Dwarka Divine Hospitality in Your Language
            </p>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
