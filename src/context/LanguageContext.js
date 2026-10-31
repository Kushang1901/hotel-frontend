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
      setGoogleTransCookies(found.code);
    }
  }, []);

  // Google Translate Script injection with production-ready callback
  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) return;
    initializedRef.current = true;

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
      if (document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.setProperty("top", "0px", "important");
      }
      if (document.documentElement.style.top && document.documentElement.style.top !== "0px") {
        document.documentElement.style.setProperty("top", "0px", "important");
      }

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
    setTimeout(() => {
      const isTranslated =
        document.documentElement.classList.contains("translated-ltr") ||
        document.documentElement.classList.contains("translated-rtl");

      if (isTranslated) {
        setIsClosingLoader(true);
        setTimeout(() => {
          setIsTranslating(false);
          setIsClosingLoader(false);
          setCurrentLang(targetLang);
        }, 350);
      } else {
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

      {/* Off-screen Google Translate Container */}
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
                  className={`lang-filter-tab ${selectedRegion === region ? "active" : ""}`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Language Grid */}
            <div className="lang-grid-wrap">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang)}
                    className={`lang-option-card ${isSelected ? "selected" : ""}`}
                  >
                    <span className="lang-card-flag">{lang.flag}</span>
                    <div className="lang-card-info">
                      <span className="lang-card-native">{lang.nativeName}</span>
                      <span className="lang-card-en">{lang.name} • {lang.region}</span>
                    </div>
                    {isSelected && (
                      <span className="lang-card-check">
                        <i className="fas fa-check-circle"></i>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ LUXURY LOGO CONVERTER LOADER SCREEN ═══ */}
      {isTranslating && (
        <div className={`lang-converter-loader ${isClosingLoader ? "fade-out" : "fade-in"}`}>
          <div className="loader-center-card">
            {/* Center Logo with Multi-Ring Aura */}
            <div className="loader-logo-container">
              <div className="loader-ring-dashed"></div>
              <div className="loader-ring-outer"></div>
              <div className="loader-ring-inner"></div>
              <div className="loader-logo-img-wrap">
                <img src="/Photos/index/logo.png" alt="Hotel Devang" className="loader-logo-img" />
              </div>
              <span className="loader-sparkle sparkle-1">✦</span>
              <span className="loader-sparkle sparkle-2">✦</span>
              <span className="loader-sparkle sparkle-3">✦</span>
            </div>

            {/* Hotel Brand Title */}
            <h4 className="loader-hotel-title">
              HOTEL <span className="gold-text">DEVANG</span>
            </h4>
            <p className="loader-sacred-subtitle">Dwarka Divine Hospitality</p>

            {/* Conversion Direction Box: FROM -> TO */}
            <div className="loader-conversion-box">
              <div className="conversion-pill conversion-from">
                <span className="pill-flag">{transitionInfo.from.flag}</span>
                <div className="pill-text">
                  <span className="pill-tag">FROM</span>
                  <span className="pill-native">{transitionInfo.from.nativeName}</span>
                  <span className="pill-sub">{transitionInfo.from.name}</span>
                </div>
              </div>

              <div className="conversion-arrow-wrap">
                <div className="arrow-track">
                  <i className="fas fa-long-arrow-alt-right arrow-icon"></i>
                </div>
                <span className="converting-label">TRANSLATING</span>
              </div>

              <div className="conversion-pill conversion-to">
                <span className="pill-flag">{transitionInfo.to.flag}</span>
                <div className="pill-text">
                  <span className="pill-tag">TO</span>
                  <span className="pill-native">{transitionInfo.to.nativeName}</span>
                  <span className="pill-sub">{transitionInfo.to.name}</span>
                </div>
              </div>
            </div>

            {/* Status message */}
            <div className="loader-status-msg">
              <i className="fas fa-om status-icon"></i>
              <span>Preparing experience in <strong>{transitionInfo.to.nativeName}</strong>...</span>
            </div>

            {/* Progress Bar */}
            <div className="loader-progress-track">
              <div className="loader-progress-fill"></div>
            </div>

            <p className="loader-note">
              Seamlessly converting sacred Dwarka stay information into {transitionInfo.to.name}
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
