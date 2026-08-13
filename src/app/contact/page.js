import React from "react";
import Link from "next/link";
import "../css/contact.css";

export const metadata = {
  title: "Contact Hotel Devang Dwarka – Phone, Email & Location Map",
  description: "Get in touch with Hotel Devang for bookings, directions, or inquiries. View phone numbers, email, WhatsApp link, and Google Map location. Located opposite Circuit House, Dwarka.",
  keywords: "contact hotel devang, hotel devang phone number, hotel devang location, hotel devang email, dwarka hotel contact",
  alternates: {
    canonical: "https://hoteldevang.com/contact",
  },
  openGraph: {
    title: "Contact Hotel Devang Dwarka – Phone, Email & Location Map",
    description: "Get in touch with Hotel Devang for bookings, directions, or inquiries. View phone numbers, email, WhatsApp link, and Google Map location.",
    url: "https://hoteldevang.com/contact",
    type: "website",
  }
};

export default function Contact() {
  return (
    <div className="page-contact">
      {/* ═══ HERO ═══ */}
      <section className="contact-hero">
        <span className="hero-badge"><i className="fa-solid fa-location-dot"></i>&nbsp; Dwarka, Gujarat</span>
        <h1>Contact Us</h1>
        <p>Find us in the heart of sacred Dwarka — your gateway to divine hospitality</p>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <i className="fas fa-chevron-right"></i>
          <span>Contact Us</span>
        </div>
      </section>

      {/* ═══ QUICK-REACH CHIPS ═══ */}
      <div className="quick-reach">
        <div className="quick-reach-inner">
          <a href="tel:+919824402132" className="reach-chip">
            <i className="fa-solid fa-phone"></i>
            <span>+91 98244 02132</span>
          </a>
          <a href="mailto:info@hoteldevang.com" className="reach-chip">
            <i className="fa-solid fa-envelope"></i>
            <span>info@hoteldevang.com</span>
          </a>
          <a href="https://wa.me/919824402132" target="_blank" rel="noopener noreferrer" className="reach-chip">
            <i className="fa-brands fa-whatsapp"></i>
            <span>WhatsApp Us</span>
          </a>
          <span className="reach-chip" style={{ cursor: "default" }}>
            <i className="fa-solid fa-clock"></i>
            <span>24 / 7 Reception</span>
          </span>
        </div>
      </div>

      {/* ═══ MAIN CONTACT SECTION ═══ */}
      <section className="contact-section">
        <div className="container">
          <div className="section-label"><span><i className="fa-solid fa-headset"></i>&nbsp; Reach Us</span></div>
          <h2 className="section-heading">Get in Touch</h2>
          <p className="section-sub">We're always here to help — whether you need directions, want to make a reservation, or simply have a question.</p>

          <div className="contact-content">
            {/* Left: contact details */}
            <div className="contact-info">
              <div className="info-card-header">
                <h2><i className="fa-solid fa-hand-holding-hand"></i> Our Contact Details</h2>
              </div>

              <div className="info-items">
                {/* Address */}
                <div className="contact-item">
                  <div className="contact-icon"><i className="fa-solid fa-map-pin"></i></div>
                  <div className="contact-details">
                    <h3>Our Address</h3>
                    <p>Opp Circuit House, Hospital Rd<br />Dwarka, Gujarat 361335<br />India</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="contact-item">
                  <div className="contact-icon"><i className="fa-solid fa-phone"></i></div>
                  <div className="contact-details">
                    <h3>Phone Numbers</h3>
                    <p>
                      <a href="tel:+919824402132">+91 98244 02132</a><br />
                      <a href="tel:+91289223407">+91 (2892) 234071</a><br />
                      <a href="tel:+91289223618">+91 (2892) 236180</a>
                    </p>
                    <p style={{ marginTop: "0.3rem", fontSize: "0.82rem" }}>Available 24/7 for your convenience</p>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-item">
                  <div className="contact-icon"><i className="fa fa-envelope"></i></div>
                  <div className="contact-details">
                    <h3>Email Address</h3>
                    <p><a href="mailto:info@hoteldevang.com">info@hoteldevang.com</a></p>
                    <p style={{ marginTop: "0.3rem", fontSize: "0.82rem" }}>We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Social buttons */}
              <div className="social-row">
                <a href="https://wa.me/919824402132" target="_blank" rel="noopener noreferrer" className="social-btn wa">
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
                <a href="https://www.facebook.com/share/19h5JCa3Xp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-btn fb">
                  <i className="fa-brands fa-facebook"></i> Facebook
                </a>
                <a href="https://www.instagram.com/hoteldevang/" target="_blank" rel="noopener noreferrer" className="social-btn ig">
                  <i className="fa-brands fa-instagram"></i> Instagram
                </a>
              </div>
            </div>

            {/* Right: map */}
            <div className="map-container">
              <div className="map-card-header">
                <h2><i className="fa-solid fa-map"></i> Find Us Here</h2>
              </div>
              <iframe 
                className="map-frame"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3693.0234567891234!2d68.96789012345678!3d22.23456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDE0JzA0LjQiTiA2OMKwNTgnMDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 360° VIRTUAL TOUR ═══ */}
      <section className="full-map-section">
        <div className="full-map-container">
          <div className="full-map-header">
            <div className="section-label"><span><i className="fa-solid fa-globe"></i>&nbsp; Virtual Tour</span></div>
            <h2 className="full-map-title">360° View of Hotel Devang</h2>
          </div>
          <div className="tour-frame-wrap">
            <iframe 
              className="full-map-frame"
              src="https://www.google.com/maps/embed?pb=!4v1750965330087!6m8!1m7!1sw_pJh_fKot_LVoHA_pZNgA!2m2!1d22.24191922539002!2d68.96085116793732!3f169.43!4f-2.3499999999999943!5f0.7820865974627469"
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ═══ CTA STRIP ═══ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Divine Hospitality?</h2>
            <p>Located in the heart of sacred Dwarka, we're just minutes away from all major temples and attractions</p>
            <div className="cta-buttons">
              <Link href="/booking" className="cta-button primary">
                <i className="fa-solid fa-calendar-check"></i> Book Your Stay
              </Link>
              <a href="tel:+919824402132" className="cta-button secondary">
                <i className="fa-solid fa-phone"></i> Call Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
