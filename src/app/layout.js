import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";
import Script from "next/script";

export const metadata = {
  title: "Hotel Devang – Official Website | Comfortable Hotel in Dwarka",
  description: "Looking for the best hotels in Dwarka? Hotel Devang offers family-friendly premium stays near Dwarkadhish Temple with deluxe rooms, modern amenities & affordable rates.",
  keywords: "hotels in dwarka, best hotel in dwarka, hotel devang dwarka, family hotel dwarka, hotels near dwarkadhish temple",
  robots: "index, follow",
  icons: {
    icon: "/Photos/index/favicon.png",
    shortcut: "/Photos/index/favicon.png",
    apple: "/Photos/index/favicon.png",
  },
  alternates: {
    canonical: "https://hoteldevang.com/",
    languages: {
      "en-IN": "https://www.hoteldevang.com/",
    },
  },
  openGraph: {
    title: "Hotel Devang – Official Website | Comfortable Hotel in Dwarka",
    description: "Hotel Devang – one of the best hotels in Dwarka for families & travelers. Stay near Dwarkadhish Temple with premium rooms, comfort & top amenities.",
    url: "https://hoteldevang.com/",
    type: "website",
    siteName: "Hotel Devang",
    locale: "en_IN",
    images: [
      {
        url: "https://hoteldevang.com/Photos/index/Hero4.jpeg",
        width: 1200,
        height: 630,
        alt: "Hotel Devang Dwarka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Devang – Official Website | Comfortable Hotel in Dwarka",
    description: "Hotel Devang – one of the best hotels in Dwarka for families & travelers. Stay near Dwarkadhish Temple with premium rooms, comfort & top amenities.",
    images: ["https://hoteldevang.com/Photos/index/Hero4.jpeg"],
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Dwarka, Gujarat",
    "geo.position": "22.2442;68.9685",
    "ICBM": "22.2442, 68.9685",
    "google-site-verification": "CftiHAoH7beLxbZieD1-liyfLwboPGrGrzeN4ukdv4o",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* FontAwesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          precedence="default"
        />
        
        {/* Google Tag Manager - Script Tag Injection */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function (w, d, s, l, i) {
              w[l] = w[l] || []; w[l].push({
                  'gtm.start':
                      new Date().getTime(), event: 'gtm.js'
              }); var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                  'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
          })(window, document, 'script', 'dataLayer', 'GTM-N3LGLXJN');`}
        </Script>

        {/* Google Analytics (gtag) */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-VCKHH3P6R3" 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-VCKHH3P6R3');`}
        </Script>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`!function (f, b, e, v, n, t, s) {
              if (f.fbq) return; n = f.fbq = function () {
                  n.callMethod ?
                      n.callMethod.apply(n, arguments) : n.queue.push(arguments)
              };
              if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
              n.queue = []; t = b.createElement(e); t.async = !0;
              t.src = v; s = b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t, s)
          }(window, document, 'script',
              'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '856389973418737');
          fbq('track', 'PageView');`}
        </Script>
        
        {/* Structured Data LD+JSON */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              "name": "Hotel Devang",
              "url": "https://hoteldevang.com",
              "image": "https://hoteldevang.com/Photos/index/Hero4.jpeg",
              "description": "Hotel Devang offers deluxe rooms, spiritual ambience, and family-friendly stays near Dwarkadhish Temple, Dwarka.",
              "priceRange": "₹1000 - ₹3500",
              "email": "info@hoteldevang.com",
              "telephone": "+919824402132",
              "hasMap": "https://maps.app.goo.gl/PziUhtuH21JubEcj7",
              "starRating": {
                "@type": "Rating",
                "ratingValue": "3"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.2",
                "reviewCount": "150"
              },
              "openingHours": "Mo-Su 00:00-24:00",
              "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Mobile Payment",
              "currenciesAccepted": "INR",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Opp. Circuit House, Hospital Road",
                "addressLocality": "Dwarka",
                "addressRegion": "Gujarat",
                "postalCode": "361335",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 22.2442,
                "longitude": 68.9685
              },
              "checkinTime": "12:30",
              "checkoutTime": "10:00",
              "amenityFeature": [
                { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "24/7 Reception", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Room Service", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Pure Vegetarian Breakfast", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Travel Assistance", "value": true }
              ],
              "contactPoint": [{
                "@type": "ContactPoint",
                "telephone": "+919824402132",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi", "Gujarati"]
              }],
              "sameAs": [
                "https://www.facebook.com/hoteldevangdwarka",
                "https://www.instagram.com/hoteldevangdwarka",
                "https://maps.app.goo.gl/PziUhtuH21JubEcj7"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Hotel Devang – Comfortable stay in Dwarka",
              "url": "https://hoteldevang.com/",
              "description": "Family-friendly hotel in Dwarka near Dwarkadhish Temple offering 43 deluxe rooms with modern amenities."
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Hotel Devang",
              "url": "https://hoteldevang.com",
              "logo": "https://hoteldevang.com/Photos/index/logo.png",
              "sameAs": [
                "https://www.facebook.com/share/19h5JCa3Xp/?mibextid=wwXIfr",
                "https://www.instagram.com/hoteldevang/",
                "https://maps.app.goo.gl/PziUhtuH21JubEcj7"
              ]
            })
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3LGLXJN" 
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        
        <Preloader />
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
        <BackToTop />
      </body>
    </html>
  );
}
