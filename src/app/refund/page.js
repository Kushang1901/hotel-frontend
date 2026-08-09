import React from "react";
import Link from "next/link";
import "../css/refund.css";

export default function Refund() {
  return (
    <div className="page-refund">
      {/* ═══ HERO ═══ */}
      <section className="refund-hero">
        <span className="hero-badge"><i className="fa-solid fa-file-invoice-dollar"></i>&nbsp; Transparency · Devotion</span>
        <h1>Refund Policy</h1>
        <p>Please review our booking deposit and cancellation terms designed to protect pilgrim accommodations in sacred Dwarka.</p>
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <i className="fas fa-chevron-right"></i>
          <span>Refund Policy</span>
        </div>
      </section>

      {/* ═══ POLICY GRID ═══ */}
      <section className="refund-section">
        <div className="container">
          <div className="section-label"><span><i className="fa-solid fa-shield-halved"></i>&nbsp; Booking Safeguards</span></div>
          <h2 className="section-heading">Cancellation &amp; Deposit Rules</h2>
          <p className="section-sub">We maintain honest, transparent, and fair booking policies that secure rooms for devotees and pilgrims from across the globe.</p>

          <div className="refund-grid">
            {/* Advance Deposit Policy */}
            <div className="policy-card">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa-solid fa-percent"></i></div>
                  <h3>50% Booking Advance</h3>
                </div>
                <ul className="policy-list">
                  <li>A <strong>50% dynamic advance payment</strong> of the total stay tariff is required to confirm your reservation.</li>
                  <li>This advance booking payment is <strong>strictly non-refundable</strong> upon successful payment authorization.</li>
                  <li>Once a room is reserved, it is blocked from online calendar inventory, preventing other devotees from booking.</li>
                  <li>Secure transactions are handled via Razorpay Online checkout with 100% data integrity.</li>
                </ul>
                <div className="policy-note">
                  <strong>Why 50%?</strong> This deposit guarantees that your rooms are fully cleaned and ready immediately upon your arrival.
                </div>
              </div>
            </div>

            {/* Emergency Exceptions */}
            <div className="policy-card warning">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa-solid fa-circle-exclamation"></i></div>
                  <h3>Emergency &amp; Special Cases</h3>
                </div>
                <ul className="policy-list warning">
                  <li>We understand that travel emergencies can occur. Under exceptional circumstances (e.g. natural disasters, train/flight cancellations, sudden medical crises), refunds may be manually reviewed.</li>
                  <li>In such special cases, please <strong>contact Hotel Management directly at +91 98244 02132</strong>.</li>
                  <li>Alternatively, management can assist in <strong>rescheduling your stay</strong> to upcoming available dates free of charge (excluding high-festival periods).</li>
                  <li>Decisions regarding partial refunds or stays extensions reside solely with the hotel management board.</li>
                </ul>
                <div className="policy-note">
                  <strong>Direct Help:</strong> Call us immediately at +91 98244 02132 to submit cancellation proofs.
                </div>
              </div>
            </div>

            {/* Refund Processing Timeframe */}
            <div className="policy-card">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa-solid fa-clock"></i></div>
                  <h3>Processing Timeframe</h3>
                </div>
                <ul className="policy-list">
                  <li>If a refund is manually approved as a special emergency case, the process is initiated <strong>within 48 hours</strong> from the approval time.</li>
                  <li>Refunds are credited strictly back to the <strong>original source payment method</strong> (UPI, credit/debit card, or bank account).</li>
                  <li>The amount will typically reflect in your account within <strong>5 to 7 working days</strong>, depending on banking gateways.</li>
                  <li>Cash refunds at reception for online bookings are not supported under any circumstances.</li>
                </ul>
                <div className="policy-note">
                  <strong>Receipt:</strong> An automated confirmation email and booking status update is instantly generated upon refund initiation.
                </div>
              </div>
            </div>

            {/* No-Show & General Conditions */}
            <div className="policy-card warning">
              <div className="card-body">
                <div className="card-header">
                  <div className="policy-icon-wrap"><i className="fa-solid fa-ban"></i></div>
                  <h3>No-Show &amp; Release Rules</h3>
                </div>
                <ul className="policy-list warning">
                  <li><strong>No-Show Policy:</strong> If guests fail to check in on the reserved arrival date without notifying management, the room is released at 12:00 PM the following day, and the entire deposit is forfeited.</li>
                  <li>Modifications to stay dates must be requested <strong>at least 72 hours</strong> prior to the original check-in date.</li>
                  <li>Fraudulent, mismatched ID, or incomplete transaction bookings will be automatically cancelled with no refund.</li>
                  <li>Modifications made during major festival periods (e.g. Janmashtami) are strictly prohibited.</li>
                </ul>
                <div className="policy-note">
                  <strong>Check-In Timings:</strong> Normal check-in starts at 12:30 PM. Please inform us if arriving late in the evening.
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="cta-banner">
            <div className="cta-text">
              <h3>Have an Emergency or Need to Reschedule?</h3>
              <p>If you have run into travel disruptions or severe weather, please contact us directly. Our management works hand-in-hand with pilgrims to adjust dates or address refund requests transparently.</p>
            </div>
            <div className="cta-action">
              <a href="tel:+919824402132" className="cta-btn">
                <i className="fa-solid fa-phone"></i> Call Management
              </a>
              <span className="cta-phone">+91 98244 02132</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
