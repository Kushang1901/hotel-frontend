import React from "react";
import Link from "next/link";
import "../css/dwarka-attractions.css";

export default function DwarkaAttractions() {
  const attractions = [
    {
      id: "dwarkadhish",
      class: "dwarkadhish",
      badge: "Most Sacred",
      distance: "900 m",
      icon: "fa-solid fa-hands-praying",
      title: "Dwarkadhish Temple",
      desc: "The main temple dedicated to Lord Krishna as Dwarkadhish (King of Dwarka). This ancient temple is built over the legendary city that Lord Krishna established. The temple's 78-meter high spire and intricate architecture make it one of India's most revered pilgrimage sites.",
      time: "Early morning (5:00 AM) and evening aarti (7:00 PM)",
      hotelDistance: "900 m",
      special: "Main deity of Dwarka, architectural marvel"
    },
    {
      id: "gomti",
      class: "gomti-ghat",
      badge: "Holy Bathing",
      distance: "1 km",
      icon: "fa-solid fa-ship",
      title: "Gomti Ghat",
      desc: "Sacred bathing ghat on the banks of river Gomti where pilgrims take holy dips. According to Hindu scriptures, bathing here washes away sins and brings spiritual purification. The ghat offers beautiful views and peaceful atmosphere for meditation and prayers.",
      time: "Early morning during sunrise",
      hotelDistance: "1 km",
      special: "Sacred river confluence, spiritual bathing"
    },
    {
      id: "gopi",
      class: "gopi-talav",
      badge: "Sacred Pond",
      distance: "23 km",
      icon: "fa-solid fa-droplet",
      title: "Gopi Talav",
      desc: "Sacred pond associated with Lord Krishna's divine pastimes with the Gopis. According to legend, this is where Krishna performed his divine leelas. The serene water body surrounded by temples creates a peaceful atmosphere for devotion and meditation.",
      time: "Early morning and evening",
      hotelDistance: "23 km",
      special: "Krishna's leela place, peaceful surroundings"
    },
    {
      id: "beyt",
      class: "beyt-dwarka",
      badge: "Very Important",
      distance: "30 km",
      icon: "fas fa-globe-europe",
      title: "Beyt Dwarka Island",
      desc: "The most important pilgrimage site, considered as the original residence of Lord Krishna. Accessible by boat, this island houses several ancient temples and is believed to be where Krishna lived with his family. Offers a unique spiritual experience away from mainland crowds.",
      time: "Full day visit — 9:00 AM–12:00 PM & 3:00–8:00 PM",
      hotelDistance: "30 km",
      special: "Krishna's original residence, Sudarshan bridge journey"
    },
    {
      id: "rukmini",
      class: "rukmani",
      badge: "Queen's Temple",
      distance: "2 km",
      icon: "fa-solid fa-heart",
      title: "Rukmani Temple",
      desc: "Dedicated to Rukmani, the principal queen and beloved wife of Lord Krishna. This beautiful temple showcases the eternal love story of Krishna and Rukmani. The temple's architecture and peaceful environment make it perfect for couples seeking blessings.",
      time: "Morning prayers and evening aarti",
      hotelDistance: "2 km",
      special: "Couple blessings, beautiful architecture"
    },
    {
      id: "bhadkeshwar",
      class: "bhadkeshwar",
      badge: "Beach Temple",
      distance: "500 m",
      icon: "fa-solid fa-hands-praying",
      title: "Bhadkeshwar Mahadev Temple",
      desc: "Ancient Shiva temple located right next to a pristine beach. During high tide, the temple appears to be surrounded by water, creating a mystical atmosphere. The combination of spiritual significance and natural beauty makes it a unique pilgrimage experience.",
      time: "High tide for mystical views, sunset for photography",
      hotelDistance: "500 m",
      special: "Temple surrounded by sea during high tide"
    },
    {
      id: "gayatri",
      class: "gayatri",
      badge: "Serene",
      distance: "0.5 km",
      icon: "fa-solid fa-star",
      title: "Gayatri Temple & Beach",
      desc: "Peaceful temple dedicated to Goddess Gayatri with an adjacent clean beach. The temple offers stunning views of the Arabian Sea and is perfect for those seeking tranquility. The beach is ideal for peaceful walks and meditation away from crowded areas.",
      time: "Morning prayers and evening walks",
      hotelDistance: "0.5 km",
      special: "Peaceful atmosphere, clean beach access"
    },
    {
      id: "sunset",
      class: "sunset-point",
      badge: "Scenic View",
      distance: "400 m",
      icon: "fa-solid fa-sun",
      title: "Sunset Point",
      desc: "The most popular spot in Dwarka to witness breathtaking sunsets over the Arabian Sea. This elevated viewpoint offers panoramic views of the coastline and is perfect for photography and romantic moments. The view of the sun setting behind the sea is truly divine.",
      time: "1 hour before sunset (6:00–7:30 PM)",
      hotelDistance: "400 m",
      special: "Spectacular sunset views, photography spot"
    },
    {
      id: "shivrajpur",
      class: "shivrajpur",
      badge: "Blue Flag",
      distance: "10 km",
      icon: "fa-solid fa-umbrella-beach",
      title: "Shivrajpur Beach",
      desc: "India's first Blue Flag certified beach, known for its pristine waters and clean environment. Perfect for families and beach lovers, offering water sports, clean facilities, and beautiful coastline. The beach maintains international standards of cleanliness and safety.",
      time: "Early morning or late afternoon",
      hotelDistance: "10 km",
      special: "Blue Flag certification, water sports"
    },
    {
      id: "nageshwar",
      class: "nageshwar",
      badge: "Jyotirlinga",
      distance: "18 km",
      icon: "fa-solid fa-om",
      title: "Nageshwar Mahadev Temple",
      desc: "One of the 12 sacred Jyotirlingas of Lord Shiva, making it extremely significant for Hindu pilgrims. The temple features a massive 25-meter tall statue of Lord Shiva and houses the divine Jyotirlinga. A must-visit destination for complete spiritual fulfillment.",
      time: "Early morning aarti and Maha Shivaratri",
      hotelDistance: "18 km",
      special: "Sacred Jyotirlinga, 25m tall Shiva statue"
    }
  ];

  return (
    <div className="page-dwarka-attractions">
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
