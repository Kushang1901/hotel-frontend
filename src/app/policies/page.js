import React from "react";
import Link from "next/link";
import "../css/policies.css";

export const metadata = {
  title: "Hotel Policies, Rules & Guidelines | Hotel Devang Dwarka",
  description: "Review Hotel Devang's check-in/check-out timings, room guidelines, identity proof requirements, guest policies, and pet guidelines to ensure a comfortable stay.",
  keywords: "hotel devang policies, check in time dwarka, hotel rules dwarka, guest policy dwarka",
  alternates: {
    canonical: "https://hoteldevang.com/policies",
  },
  openGraph: {
    title: "Hotel Policies, Rules & Guidelines | Hotel Devang Dwarka",
    description: "Review Hotel Devang's check-in/check-out timings, room guidelines, identity proof requirements, and guest policies.",
    url: "https://hoteldevang.com/policies",
    type: "website",
  }
};

export default function Policies() {
  return (
    <div className="page-policies">
      {/* ═══ HERO ═══ */}
      <section className="policies-hero">
        <span className="hero-badge"><i className="fa-solid fa-scroll"></i>&nbsp; Hotel Devang · Dwarka</span>
        <h1>Hotel Policies</h1>
        <p>Please review our policies to ensure a comfortable and pleasant stay at Hotel Devang in sacred Dwarka</p>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <i className="fas fa-chevron-right"></i>
          <span>Hotel Policies</span>
        </div>
      </section>

      {/* ═══ POLICY CARDS ═══ */}
      <section className="policies-section">
        <div className="container">
          <div className="section-label"><span><i className="fa-solid fa-file-lines"></i>&nbsp; Stay Guidelines</span></div>
          <h2 className="section-heading">Our Policies at a Glance</h2>
          <p className="section-sub">Everything you need to know for a smooth, comfortable stay — transparent and straightforward.</p>

          <div className="policies-grid">
            {/* Check-in / Check-out */}
            <div className="policy-card check-in fade-in">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa-solid fa-hotel"></i></div>
                  <h3>Check-in &amp; Check-out</h3>
                </div>
                <ul className="policy-list">
                  <li><strong>Check-in Time:</strong> 12:30 PM</li>
                  <li><strong>Check-out Time:</strong> 10:00 AM</li>
                  <li>Early check-in subject to room availability</li>
                  <li>Late check-out may incur additional charges</li>
                  <li>Valid photo ID required of each family member</li>
                  <li>Registration required as per Government regulations</li>
                </ul>
                <div className="policy-note">
                  <strong>Note:</strong> For spiritual travelers arriving for early morning temple visits, we offer complimentary luggage storage.
                </div>
              </div>
            </div>

            {/* Cancellation */}
            <div className="policy-card cancellation fade-in">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa fa-shield"></i></div>
                  <h3>Cancellation Policy</h3>
                </div>
                <ul className="policy-list warning">
                  <li>Advance payments made online are non-refundable in case of cancellation.</li>
                  <li>Valid photo ID is mandatory for all guests at check-in.</li>
                  <li>The credit card holder must be among the travelers.</li>
                  <li>Reservations may be cancelled or modified if found to be fraudulent or erroneous.</li>
                  <li>Refunds, if applicable, will be initiated within 48 hours and credited within 5–7 working days via the original payment method.</li>
                </ul>
                <div className="policy-note">
                  <strong>Festival Period:</strong> During Janmashtami and other major festivals, special cancellation terms apply.
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="policy-card payment fade-in">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa fa-credit-card"></i></div>
                  <h3>Payment Policy</h3>
                </div>
                <ul className="policy-list">
                  <li>Cash payments accepted</li>
                  <li>UPI payments welcome (GPay, PhonePe, Paytm)</li>
                  <li>Bank transfers accepted</li>
                  <li>Credit/Debit cards accepted (subject to charges)</li>
                  <li>Advance payment for group bookings</li>
                  <li>GST as applicable on all rates</li>
                </ul>
                <div className="policy-note">
                  <strong>Preferred:</strong> UPI payments for quick and secure transactions.
                </div>
              </div>
            </div>

            {/* Guest Policy */}
            <div className="policy-card guest fade-in">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa-solid fa-user"></i></div>
                  <h3>Guest Policy</h3>
                </div>
                <ul className="policy-list">
                  <li>Maximum occupancy as per room type</li>
                  <li>Extra person charges applicable</li>
                  <li>Children below 5 years stay free (without extra bed)</li>
                  <li>Valid ID required for all guests above 12 years</li>
                  <li>Visitor hours: 24 hours</li>
                  <li>No prior approval required for visitors</li>
                </ul>
                <div className="policy-note">
                  <strong>Family Friendly:</strong> We welcome families and provide child-friendly amenities.
                </div>
              </div>
            </div>

            {/* Safety & Security */}
            <div className="policy-card safety fade-in">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa fa-shield"></i></div>
                  <h3>Safety &amp; Security</h3>
                </div>
                <ul className="policy-list warning">
                  <li>CCTV surveillance in common areas</li>
                  <li>No safe deposit facility available at front desk</li>
                  <li>Please lock your rooms when leaving</li>
                  <li>Report any suspicious activity immediately</li>
                  <li>Fire safety equipment available on all floors</li>
                </ul>
                <div className="policy-note">
                  <strong>Important:</strong> Hotel is not responsible for valuables left in rooms. Please use safe deposit facility.
                </div>
              </div>
            </div>

            {/* General Policies */}
            <div className="policy-card additional fade-in">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa fa-file-text-o"></i></div>
                  <h3>General Policies</h3>
                </div>
                <ul className="policy-list info">
                  <li>Strictly vegetarian premises (no non-veg / alcohol)</li>
                  <li>Smoking prohibited in all indoor areas</li>
                  <li>Pets not allowed</li>
                  <li>Damage charges applicable for hotel property</li>
                  <li>Room cleaning timing: before 12:00 PM – 12:30 PM</li>
                </ul>
                <div className="policy-note">
                  <strong>Sacred Environment:</strong> We maintain a pure, spiritual atmosphere in respect of Dwarka's religious significance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ IMPORTANT GUIDELINES ═══ */}
      <section className="important-notice">
        <div className="notice-inner">
          <div className="notice-header">
            <div className="section-label"><span><i className="fa-solid fa-circle-info"></i>&nbsp; Good to Know</span></div>
            <h2>Important Guidelines</h2>
          </div>
          <div className="notice-grid">
            <div className="notice-box">
              <div className="notice-icon"><i className="fa-solid fa-cloud"></i></div>
              <h3>Spiritual Atmosphere</h3>
              <p>As we are located in the sacred city of Dwarka, we request all guests to maintain the sanctity of the place. Please dress modestly and respect local customs and traditions.</p>
            </div>
            <div className="notice-box">
              <div className="notice-icon"><i className="fa-solid fa-clock"></i></div>
              <h3>Temple Visit Timings</h3>
              <p>Dwarkadhish Temple opens early at 6:30 AM. We provide wake-up calls and early morning assistance for devotees wishing to attend morning prayers.</p>
            </div>
            <div className="notice-box">
              <div className="notice-icon"><i className="fa-solid fa-car"></i></div>
              <h3>Parking &amp; Transportation</h3>
              <p>Limited parking available on first-come, first-served basis. We can arrange local transportation and temple visit guides upon request.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT / CLARIFICATION ═══ */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="section-label"><span><i className="fa-solid fa-headset"></i>&nbsp; We're Here</span></div>
            <h2>Need Clarification?</h2>
            <p>Our team is here to help with any questions about our policies</p>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa fa-phone"></i></div>
                <h3>Phone</h3>
                <p>+91 98244 02132</p>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa fa-envelope"></i></div>
                <h3>Email</h3>
                <p>info@hoteldevang.com</p>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa-solid fa-clock"></i></div>
                <h3>Reception</h3>
                <p>24 / 7 Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
