import "./footer.scss";
import { Heart, Mail, Phone, MapPin, ChevronUp } from "lucide-react";
import { NavLink } from "react-router-dom";

const socialLinks = [
  { name: "Twitter", to: "#", icon: "📱" },
  { name: "LinkedIn", to: "#", icon: "💼" },
  { name: "GitHub", to: "#", icon: "🐙" },
  { name: "Instagram", to: "#", icon: "📷" },
];

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Create floating particles
  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push(
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        />
      );
    }
    return particles;
  };

  return (
    <footer className="footer">
      {/* Decorative Wave */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          ></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="particles">{createParticles()}</div>

      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <div className="footer-logo">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCs1U_8Gx0qCmALLNqEkz-ztb1pfxjbKmhFg&s"
                alt="Norsen.me Logo"
                className="logo-image"
              />
              <div className="brand-text">
                <h3>Spring-Boot</h3>
                <p>Official website from MosTaFa</p>
              </div>
            </div>

            <p className="brand-description">
              Creating exceptional digital experiences with cutting-edge
              technology and innovative design solutions.
            </p>

            {/* Social Links */}
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <NavLink
                  key={index}
                  to={social.to}
                  className="social-link"
                  aria-label={social.name}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span style={{ fontSize: "18px" }}>{social.icon}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="section-title">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>mostafa.abdulrahman.elbasha92@gmail.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+20 1098893166</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4 className="section-title">Stay Updated</h4>
            <p className="newsletter-text">
              Subscribe to our newsletter for the latest updates and exclusive
              content.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>
              ©{new Date().getFullYear()} Spring.Boot. All rights reserved. Made
              with <Heart size={14} className="heart-icon" /> by MosTaFa
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="scroll-top-btn"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
