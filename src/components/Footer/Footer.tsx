import { component$ } from '@builder.io/qwik';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from '@qwikest/icons/font-awesome'; // Correct import for FontAwesome icons
import './footer.css';

const Footer = component$(() => {
  return (
    <footer class="footer">
      <div class="wavesContainer">
        <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
          </defs>
          <g class="parallax">
            <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)"></use>
            <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)"></use>
            <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)"></use>
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff"></use>
          </g>
        </svg>
      </div>
      <div class="footer-content">
        <div class="social-icons">
          <a href="#" aria-label="Facebook"><FaFacebookF class="icon" /></a>
          <a href="#" aria-label="Twitter"><FaTwitter class="icon" /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn class="icon" /></a>
          <a href="#" aria-label="Instagram"><FaInstagram class="icon" /></a>
        </div>
        <ul class="footer-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Team</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <p>&copy; {new Date().getFullYear()} All rights reserved</p>
      </div>
    </footer>
  );
});

export default Footer;
