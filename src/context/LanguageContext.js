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

  // Enforce English as default unless explicitly chosen
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCode = localStorage.getItem("hotel_devang_lang");

    // If no preference is saved yet or saved as English, enforce English as default and clear any stray googtrans cookie
    if (!savedCode || savedCode === "en") {
      setCurrentLang(INDIAN_LANGUAGES[0]); // English
      const domain = window.location.hostname;
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      if (domain.includes(".")) {
        const rootDomain = domain.replace(/^www\./, "");
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
      }
      return;
    }

    // Only if user explicitly saved a non-English language in this browser
    const found = INDIAN_LANGUAGES.find((l) => l.code === savedCode);
    if (found) {
      setCurrentLang(found);
    }
  }, []);

  // Google Translate Script injection
  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) return;
    initializedRef.current = true;

    window.googleTranslateElementInit = () => {
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
      } catch (e) {
        console.warn("Google Translate init exception:", e);
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Continuously suppress Google top banner and prevent body top shifts
  useEffect(() => {
    if (typeof window === "undefined") return;

    const suppressBanner = () => {
      // 1. Force body and html top back to 0px
      if (document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.setProperty("top", "0px", "important");
      }
      if (document.documentElement.style.top && document.documentElement.style.top !== "0px") {
        document.documentElement.style.setProperty("top", "0px", "important");
      }

      // 2. Hide any banner iframes injected by Google
      const elementsToHide = document.querySelectorAll(
        '.VIpgJd-ZVi9od-ORHb-OEVmcd, .goog-te-banner-frame, iframe[class*="VIpgJd"], iframe[id*=":1.container"], iframe[id*=":2.container"], body > div.skiptranslate'
      );
      elementsToHide.forEach((el) => {
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

    // 2. Set Google Translate Cookies & localStorage
    const domain = window.location.hostname;
    const cookieVal = targetLang.code === "en" ? "" : `/en/${targetLang.code}`;
    const expires = targetLang.code === "en" ? "; expires=Thu, 01 Jan 1970 00:00:00 UTC" : "; max-age=31536000";

    document.cookie = `googtrans=${cookieVal}; path=/${expires}`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${domain}${expires}`;
    if (domain.includes(".")) {
      const rootDomain = domain.replace(/^www\./, "");
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${rootDomain}${expires}`;
    }

    localStorage.setItem("hotel_devang_lang", targetLang.code);

    // 3. Trigger DOM translation via Google Translate Select Combo
    const triggerTranslateCombo = () => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = targetLang.code;
        combo.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
      return false;
    };

    let comboApplied = triggerTranslateCombo();
    if (!comboApplied) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerTranslateCombo() || attempts > 25) {
          clearInterval(interval);
        }
      }, 100);
    }

    // 4. Smooth transition timer for the Logo Loader
    setTimeout(() => {
      // If switching back to English, a clean reload guarantees pristine English
      if (targetLang.code === "en") {
        window.location.reload();
        return;
      }

      // Smooth fade-out of the Logo Loader
      setIsClosingLoader(true);
      setTimeout(() => {
        setIsTranslating(false);
        setIsClosingLoader(false);
        setCurrentLang(targetLang);
      }, 350);
    }, 1250);
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

      {/* ═══ FLOATING LUXURY LANGUAGE WIDGET (Bottom-Left) ═══ */}
            {/* Hidden Google Translate Target */}
      <div id="google_translate_element" style={{ display: "none" }} aria-hidden="true" />

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
                  placeholder="Search language / भाषा खोजें / શોધો (e.g. Gujarati, Hindi, Marathi)..."
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
              {["All", "Gujarat / Dwarka", "North", "South", "East", "West"].map((region) => (
                <button
                  key={region}
                  type="button"
                  className={`lang-filter-tab ${selectedRegion === region ? "active" : ""}`}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region === "Gujarat / Dwarka" ? "✦ Gujarat / Dwarka" : region}
                </button>
              ))}
            </div>

            {/* Languages Grid */}
            <div className="lang-grid-wrap">
              {filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className={`lang-option-card ${isSelected ? "selected" : ""}`}
                    onClick={() => changeLanguage(lang)}
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

      {/* ═══ LOGO CONVERTER LOADER SCREEN ═══ */}
      {isTranslating && (
        <div className={`lang-converter-loader ${isClosingLoader ? "fade-out" : "fade-in"}`}>
          <div className="loader-center-card">
            {/* Center Logo with Luxury Rotating Aura */}
            <div className="loader-logo-container">
              <div className="loader-ring loader-ring-dashed"></div>
              <div className="loader-ring loader-ring-outer"></div>
              <div className="loader-ring loader-ring-inner"></div>

              <div className="loader-logo-img-wrap">
                <img
                  src="/Photos/index/logo.png"
                  alt="Hotel Devang Logo"
                  className="loader-logo-img"
                />
              </div>

              <span className="loader-sparkle sparkle-1">✦</span>
              <span className="loader-sparkle sparkle-2">✦</span>
              <span className="loader-sparkle sparkle-3">✦</span>
            </div>

            {/* Hotel Devang Brand */}
            <h3 className="loader-hotel-title">
              HOTEL <span className="gold-text">DEVANG</span>
            </h3>
            <p className="loader-sacred-subtitle">
              Dwarkadhish Divine Hospitality
            </p>

            {/* Conversion Direction Box: Converting from respected to respected language */}
            <div className="loader-conversion-box">
              {/* Respected FROM language */}
              <div className="conversion-pill conversion-from">
                <span className="pill-flag">{transitionInfo.from.flag}</span>
                <div className="pill-text">
                  <span className="pill-tag">CURRENT</span>
                  <strong className="pill-native">{transitionInfo.from.nativeName}</strong>
                  <span className="pill-sub">({transitionInfo.from.name})</span>
                </div>
              </div>

              {/* Animated Golden Conversion Arrow */}
              <div className="conversion-arrow-wrap">
                <div className="arrow-track">
                  <i className="fas fa-arrow-right arrow-icon"></i>
                </div>
                <span className="converting-label">CONVERTING</span>
              </div>

              {/* Respected TO language */}
              <div className="conversion-pill conversion-to">
                <span className="pill-flag">{transitionInfo.to.flag}</span>
                <div className="pill-text">
                  <span className="pill-tag">SELECTED</span>
                  <strong className="pill-native gold-text">{transitionInfo.to.nativeName}</strong>
                  <span className="pill-sub">({transitionInfo.to.name})</span>
                </div>
              </div>
            </div>

            {/* Dynamic Status Text */}
            <div className="loader-status-msg">
              <i className="fas fa-circle-notch fa-spin status-icon"></i>
              <span>Translating into <strong>{transitionInfo.to.nativeName} ({transitionInfo.to.name})</strong>...</span>
            </div>

            {/* Luxury Golden Progress Bar */}
            <div className="loader-progress-track">
              <div className="loader-progress-fill"></div>
            </div>
            <p className="loader-note">Applying authentic Indian language translation...</p>
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

