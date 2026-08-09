import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact Information</h3>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-geo-alt-fill" viewBox="0 0 16 16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
              </svg> Dwarka, Gujarat - 361335
            </p>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-telephone" viewBox="0 0 16 16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
              </svg> Phone: +91 98244 02132
            </p>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-envelope" viewBox="0 0 16 16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
              </svg> Email: info@hoteldevang.com
            </p>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-globe" viewBox="0 0 16 16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
              </svg> Website: www.hoteldevang.com
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about_us">About Us</Link></li>
              <li><Link href="/room">Our Rooms</Link></li>
              <li><Link href="/facilities">Amenities</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Nearby Attractions</h3>
            <ul>
              <li>Dwarkadhish Temple</li>
              <li>Rukmini Devi Temple</li>
              <li>Gomti Ghat</li>
              <li>Bet Dwarka</li>
              <li>Nageshwar Jyotirlinga</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Follow Us</h3>
            <p>Stay connected for latest updates and special offers</p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", fontSize: "1.5rem" }}>
              <a href="https://www.facebook.com/share/19h5JCa3Xp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/hoteldevang/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#contact">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-tagline">
            A Home of Comfort &amp; Devotion
          </p>
          <p className="footer-text">
            © 2026 <span>Hotel Devang</span> • All Rights Reserved <br />
            Crafted with <i className="fa-solid fa-heart" style={{ color: '#e84393' }}></i> by{" "}
            <a href="https://kushangacharya.vercel.app/" target="_blank" rel="noopener noreferrer">
              Kushang Acharya
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
