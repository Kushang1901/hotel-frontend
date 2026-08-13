"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "../css/about.css";

export default function AboutUs() {
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Stats counter state
  const [years, setYears] = useState(0);
  const [guests, setGuests] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [rating, setRating] = useState(0);
  const [team, setTeam] = useState(0);
  
  const statsSectionRef = useRef(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  useEffect(() => {
    // 1. Intersection Observer for Scroll Animations
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const animatedObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animated");
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        animatedObserver.observe(el);
      });

      // 2. Observer for Statistics Counter
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Trigger counters
              animateValue(0, 27, 2000, setYears);
              animateValue(0, 900, 2000, setGuests);
              animateValue(0, 43, 2000, setRooms);
              animateValue(0, 42, 2000, (val) => setRating(val / 10)); // divide by 10 for decimal
              animateValue(0, 10, 2000, setTeam);
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (statsSectionRef.current) {
        statsObserver.observe(statsSectionRef.current);
      }

      return () => {
        animatedObserver.disconnect();
        statsObserver.disconnect();
      };
    } else {
      // Fallbacks if IntersectionObserver not supported
      setYears(27);
      setGuests(900);
      setRooms(43);
      setRating(4.2);
      setTeam(10);
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        el.classList.add("animated");
      });
    }
  }, []);

  const animateValue = (start, end, duration, setValue) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      setValue(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };
    window.requestAnimationFrame(step);
  };

  const faqData = [
    {
      q: "How old is Hotel Devang?",
      a: "Hotel Devang has been serving guests since 1997. With more than 27 years of hospitality excellence, we proudly stand as one of the most trusted family hotels in Dwarka."
    },
    {
      q: "Is free Wi-Fi available at the hotel?",
      a: "Yes, we provide complimentary high-speed Wi-Fi access to all our guests throughout the hotel premises."
    },
    {
      q: "How far is the hotel from Dwarkadhish Temple?",
      a: "The hotel is approximately 800 meters to 1 kilometer from Dwarkadhish Temple. It takes around 10 minutes by foot."
    }
  ];

  return (
    <div className="page-about">
      {/* ═══ HERO ═══ */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="hero-badge animate-on-scroll">
            <i className="fa-solid fa-hotel"></i> Since 1997
          </div>
          <h1 className="animate-on-scroll">Our Legacy of Devotion</h1>
          <p className="animate-on-scroll">Serving pilgrims and travelers for over 27 years with the warmth of a home in the sacred city of Dwarka.</p>
          <div className="hero-scroll-indicator">
            <div className="mouse"></div>
            <span>Scroll to Discover</span>
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section ref={statsSectionRef} className="stats-section">
        <div className="stats-inner">
          <div className="stat-chip animate-on-scroll">
            <span className="stat-number">{years}+</span>
            <span className="stat-lbl">Years of Service</span>
          </div>
          <div className="stat-chip animate-on-scroll">
            <span className="stat-number">{guests}K+</span>
            <span className="stat-lbl">Happy Guests</span>
          </div>
          <div className="stat-chip animate-on-scroll">
            <span className="stat-number">{rooms}</span>
            <span className="stat-lbl">Comfortable Rooms</span>
          </div>
          <div className="stat-chip animate-on-scroll">
            <span className="stat-number">{rating.toFixed(1)}★</span>
            <span className="stat-lbl">Guest Rating</span>
          </div>
          <div className="stat-chip animate-on-scroll">
            <span className="stat-number">{team}+</span>
            <span className="stat-lbl">Team Members</span>
          </div>
        </div>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section className="our-story-section">
        <div className="main-container">
          <div className="section-label">
            <span className="section-tag"><i className="fa-solid fa-book-open"></i> &nbsp;Our Journey</span>
          </div>
          <h2 className="section-heading">The Story of Hotel Devang</h2>
          <p className="section-sub">A legacy born from love for Dwarka and devotion to guests</p>

          <div className="story-grid animate-on-scroll">
            <div className="story-image-wrap">
              <img src="/Photos/About_us/Trios.jpeg" alt="Hotel Devang Founders — The Acharya Brothers" />
              <div className="story-image-badge"><i className="fa-solid fa-star"></i> Since 1997</div>
            </div>
            <div className="story-text-wrap">
              <p>Founded in <strong>1997</strong>, Hotel Devang began as a vision to create a sanctuary for travelers seeking comfort and spiritual solace in the holy city of Dwarka. What started as a small family initiative has grown into one of the most trusted names in hospitality in Dwarka.</p>
              <p>Our journey began when three visionary brothers recognized the need for quality accommodation that respects the spiritual significance of Dwarka while providing modern comforts. Over the years, we have welcomed thousands of pilgrims and travelers from across the globe.</p>
              <p>Today, with <strong>43 well-appointed rooms</strong> and a legacy spanning more than <strong>27 years</strong>, we continue to uphold our founding principles of warmth, respect, and genuine care for every guest who walks through our doors.</p>
              <Link href="/booking" className="story-cta">
                <i className="fa-solid fa-calendar-check"></i> Book Your Stay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOUNDERS ═══ */}
      <section className="founders-section">
        <div className="main-container">
          <div className="section-label">
            <span className="section-tag"><i className="fa-solid fa-people-group"></i> &nbsp;The Visionaries</span>
          </div>
          <h2 className="section-heading">Meet Our Founders</h2>
          <p className="section-sub">The dedicated brothers behind our 27-year legacy of hospitality</p>

          <div className="founders-grid">
            {/* Mr. Himanshu Acharya */}
            <div className="founder-card animate-on-scroll">
              <div className="founder-photo">
                <img src="/Photos/About_us/Himanshu_acharya.jpeg" alt="Mr. Himanshu Acharya" />
              </div>
              <div className="founder-info">
                <div className="founder-name-row">
                  <h3>Mr. Himanshu Acharya</h3>
                  <span className="founder-badge"><i className="fa-solid fa-crown"></i></span>
                </div>
                <div className="founder-role">Managing Director</div>
                <p>With over 27 years of expertise in Dwarka's hospitality landscape, Mr. Himanshu Acharya leads our strategic vision, ensuring that Hotel Devang remains at the forefront of guest comfort and service excellence.</p>
                <div className="founder-exp"><i className="fa-solid fa-briefcase"></i> 27 years in Hospitality</div>
              </div>
            </div>

            {/* Mr. Udayan Acharya */}
            <div className="founder-card animate-on-scroll">
              <div className="founder-photo">
                <img src="/Photos/About_us/Udayan_acharya.jpeg" alt="Mr. Udayan Acharya" />
              </div>
              <div className="founder-info">
                <div className="founder-name-row">
                  <h3>Mr. Udayan Acharya</h3>
                  <span className="founder-badge"><i className="fa-solid fa-gear"></i></span>
                </div>
                <div className="founder-role">Operations Director</div>
                <p>Mr. Udayan Acharya oversees the daily operations and infrastructure. His focus on meticulous maintenance and efficient service delivery ensures that every guest has a seamless and hassle-free stay.</p>
                <div className="founder-exp"><i className="fa-solid fa-briefcase"></i> 27 years in Operations</div>
              </div>
            </div>

            {/* Mr. Govind Acharya */}
            <div className="founder-card animate-on-scroll">
              <div className="founder-photo">
                <img src="/Photos/About_us/govind_acharya.jpeg" alt="Mr. Govind Acharya" />
              </div>
              <div className="founder-info">
                <div className="founder-name-row">
                  <h3>Mr. Govind Acharya</h3>
                  <span className="founder-badge"><i className="fa-solid fa-handshake"></i></span>
                </div>
                <div className="founder-role">Guest Relations Director</div>
                <p>Mr. Govind Acharya focuses on guest relations and community engagement. His deep understanding of local culture ensures that our guests experience authentic Gujarati hospitality.</p>
                <div className="founder-exp"><i className="fa-solid fa-briefcase"></i> 27 years in Guest Services</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VISION & MISSION ═══ */}
      <section className="vision-mission-section">
        <div className="main-container">
          <div className="section-label">
            <span className="section-tag"><i className="fa-solid fa-compass"></i> &nbsp;Our Direction</span>
          </div>
          <h2 className="section-heading">Vision &amp; Mission</h2>

          <div className="vm-grid">
            <div className="vm-card vision-card animate-on-scroll">
              <div className="vm-icon"><i className="fa-solid fa-eye"></i></div>
              <h3>Our Vision</h3>
              <p>To be the leading hospitality destination in Dwarka, recognized for our commitment to excellence, spiritual sensitivity, and authentic Gujarati hospitality.</p>
            </div>
            <div className="vm-card mission-card animate-on-scroll">
              <div className="vm-icon"><i className="fa-solid fa-bullseye"></i></div>
              <h3>Our Mission</h3>
              <p>Our mission is to provide exceptional accommodation and personalized service that enhances the spiritual journey of our guests while embracing modern standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CORE VALUES ═══ */}
      <section className="values-section">
        <div className="main-container">
          <div className="section-label">
            <span className="section-tag"><i className="fa-solid fa-gem"></i> &nbsp;What We Stand For</span>
          </div>
          <h2 className="section-heading">Our Core Values</h2>
          <p className="section-sub">The principles that have guided us for over 27 years</p>

          <div className="values-grid">
            <div className="value-card animate-on-scroll">
              <div className="value-icon"><i className="fa-solid fa-hand-holding-heart"></i></div>
              <h4>Spiritual Respect</h4>
              <p>We honor the sacred nature of Dwarka and ensure our services align with the spiritual significance of this holy city.</p>
            </div>
            <div className="value-card animate-on-scroll">
              <div className="value-icon"><i className="fa-solid fa-heart"></i></div>
              <h4>Warm Hospitality</h4>
              <p>Every guest is treated as family, with genuine care and attention to their comfort and needs.</p>
            </div>
            <div className="value-card animate-on-scroll">
              <div className="value-icon"><i className="fa-solid fa-star"></i></div>
              <h4>Quality Excellence</h4>
              <p>We maintain the highest standards in all our services, from accommodation to guest care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="faq-section">
        <div className="main-container">
          <div className="section-label">
            <span className="section-tag"><i className="fa-solid fa-circle-question"></i> &nbsp;FAQ</span>
          </div>
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-sub">Common questions about your stay at Hotel Devang</p>

          <div className="faq-wrapper">
            {faqData.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className={`faq-item animate-on-scroll ${isOpen ? "active" : ""}`}>
                  <div className="faq-question" onClick={() => toggleFaq(idx)}>
                    <span>{item.q}</span>
                    <i className="fa-solid fa-chevron-down faq-icon"></i>
                  </div>
                  <div 
                    className="faq-answer"
                    style={{
                      height: isOpen ? "auto" : "0px",
                      overflow: "hidden",
                      transition: "height 0.3s ease"
                    }}
                  >
                    <div className="faq-answer-inner">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
