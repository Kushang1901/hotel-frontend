import React from "react";
import Link from "next/link";
import "../css/dwarka-attractions.css";

export const metadata = {
  title: "Top Places to Visit in Dwarka | Attractions Near Hotel Devang",
  description: "Explore top tourist spots and holy temples in Dwarka: Dwarkadhish Temple, Gomti Ghat, Shivrajpur Beach, Nageshwar Jyotirlinga, and Bet Dwarka near Hotel Devang.",
  keywords: "places to visit in dwarka, dwarka sightseeing, attractions near hotel devang, dwarkadhish temple distance, nageshwar jyotirlinga",
  alternates: {
    canonical: "https://hoteldevang.com/dwarka_attractions",
  },
  openGraph: {
    title: "Top Places to Visit in Dwarka | Attractions Near Hotel Devang",
    description: "Explore top tourist spots and holy temples in Dwarka: Dwarkadhish Temple, Gomti Ghat, Shivrajpur Beach, Nageshwar Jyotirlinga, and Bet Dwarka.",
    url: "https://hoteldevang.com/dwarka_attractions",
    type: "website",
  }
};

import { attractionsData } from "../../data/attractionsData";
import { generateAttractionsSchema, generateBreadcrumbSchema } from "../../lib/schemaMarkup";

export default function DwarkaAttractions() {
  const attractions = attractionsData;

  const attractionsSchema = generateAttractionsSchema(attractions);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", slug: "" },
    { name: "Dwarka Attractions", slug: "dwarka_attractions" }
  ]);

  return (
    <div className="page-dwarka-attractions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge"><i className="fa-solid fa-om"></i> Dwarka, Gujarat</span>
          <h1>Sacred Places of Dwarka</h1>
          <p>Discover the divine beauty and spiritual significance of Lord Krishna's eternal city</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Attractions</span>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="main-content">
        <div className="container">
          {/* Tour Routes */}
          <div className="tour-routes">
            <div className="route-info">
              <h2><i className="fa-solid fa-map"></i> Complete Dwarka Pilgrimage Tours</h2>
              <p>Experience the complete spiritual journey with our recommended tour routes. Plan your divine visit with these comprehensive itineraries.</p>
            </div>

            <div className="route-cards">
              <div className="route-card">
                <h3><i className="fa-solid fa-map-pin"></i> Main City Tour — Day 1</h3>
                <p><strong>Duration:</strong> 6–8 hours &nbsp;|&nbsp; <strong>Distance:</strong> 15–20 km</p>
                <ul className="route-list">
                  <li><i className="fa-solid fa-hands-praying"></i> Dwarkadhish Temple (Main Temple)</li>
                  <li><i className="fa-solid fa-ship"></i> Gomti Ghat (Holy Bathing Ghat)</li>
                  <li><i className="fa-solid fa-hands-praying"></i> Bhadkeshwar Mahadev Temple &amp; Beach</li>
                  <li><i className="fa-solid fa-star"></i> Gayatri Temple &amp; Beach</li>
                  <li><i className="fa-solid fa-sun"></i> Sunset Point (Evening Visit)</li>
                  <li><i className="fa-solid fa-umbrella-beach"></i> Shivrajpur Beach (10 km away)</li>
                </ul>
              </div>

              <div className="route-card">
                <h3><i className="fa-solid fa-car"></i> Extended Pilgrimage — Day 2</h3>
                <p><strong>Duration:</strong> 8–10 hours &nbsp;|&nbsp; <strong>Distance:</strong> 20–30 km</p>
                <ul className="route-list">
                  <li><i className="fa-solid fa-om"></i> Nageshwar Mahadev Temple (Jyotirlinga)</li>
                  <li><i className="fa-solid fa-droplet"></i> Gopi Talav (Sacred Pond)</li>
                  <li><i className="fas fa-globe-europe"></i> Beyt Dwarka Island (Most Important)</li>
                  <li><i className="fa-solid fa-heart"></i> Rukmani Temple (Krishna's Queen)</li>
                </ul>
                <p><em>This route requires a full day commitment and covers all major pilgrimage sites in sequence.</em></p>
              </div>
            </div>
          </div>

          {/* Attractions Header */}
          <div className="attractions-section-header">
            <div className="section-label"><span><i className="fa-solid fa-location-dot"></i> &nbsp;Explore Dwarka</span></div>
            <h2 className="section-heading">Divine Attractions of Dwarka</h2>
            <p className="section-sub">Each site carries centuries of devotion, history, and natural beauty — waiting to be experienced.</p>
          </div>

          {/* Attractions Grid */}
          <div className="attractions-grid">
            {attractions.map((att, idx) => (
              <div key={idx} className="attraction-card" id={att.id}>
                <div className={`attraction-image ${att.class}`}>
                  <div className="attraction-badge">{att.badge}</div>
                  <div className="attraction-distance"><i className="fa-solid fa-location-dot"></i> {att.distance}</div>
                </div>
                <div className="attraction-content">
                  <h3><i className={att.icon}></i> {att.title}</h3>
                  <p>{att.desc}</p>
                  <div className="attraction-details">
                    <strong>Best Time:</strong> {att.time}<br />
                    <strong>Distance from Hotel:</strong> {att.hotelDistance}<br />
                    <strong>Special:</strong> {att.special}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRAVEL INFO ═══ */}
      <section style={{ padding: "0 2rem 4rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="travel-info-wrapper">
          <h3 className="travel-info-heading">Important <span>Travel Information</span></h3>
          <div className="travel-info-grid">
            <div className="travel-info-card">
              <h3><i className="fa-solid fa-clock"></i> Time Required</h3>
              <p><strong>Main City Tour:</strong> 1 Full Day (6–8 hours)</p>
              <p><strong>Extended Pilgrimage:</strong> 1–2 Full Days</p>
              <p><strong>Complete Dwarka Visit:</strong> Minimum 2 Days recommended</p>
            </div>
            <div className="travel-info-card">
              <h3><i className="fa-solid fa-car"></i> Transportation</h3>
              <p><strong>Local Auto/Taxi:</strong> Available from hotel</p>
              <p><strong>Private Car:</strong> Recommended for distant places</p>
              <p><strong>Group Tours:</strong> Available on request</p>
            </div>
            <div className="travel-info-card">
              <h3><i className="fa-solid fa-lightbulb"></i> Pro Tips</h3>
              <p><strong>Early Start:</strong> Begin at 6:00 AM for peaceful darshan</p>
              <p><strong>Dress Code:</strong> Modest clothing required</p>
              <p><strong>Photography:</strong> Some temples restrict cameras</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
