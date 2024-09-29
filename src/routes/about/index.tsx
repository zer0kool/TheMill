import { component$ } from "@builder.io/qwik";
import './about.css'; // Import the CSS for styling
import { LuUtensils, LuRocket, LuDatabase, LuBrain } from "@qwikest/icons/lucide"; // Updated import

export default component$(() => {
  return (
    <div class="about-container">
      <header class="hero">
        <h1>About us</h1>
        <p>About Us Our Story</p>
      </header>
      <div class="content-section">
        <p>
          The Mill at The Kasteel is a Mexican-American restaurant in Oak Harbor, Washington. We have been proudly serving our town since September 2020. We specialize in blending traditional foods and flavors with a Mexican influence. Our mission is to provide food that will have natural flavors and offer an exceptional dining experience. Scroll down to learn more about us!
        </p>
        <div class="contact-info">
          <p>33505 SR 20 Oak Harbor, WA</p>
          <p>Management@themillatthekasteel.com</p>
          <p>Phone: 360-682-6754</p>
        </div>
        <div class="button-container">
          <a href="tel:3606826754" class="contact-button" aria-label="Call us at 360-682-6754">CALL US</a>
          <a href="mailto:Management@themillatthekasteel.com" class="contact-button" aria-label="Email us at Management@themillatthekasteel.com">EMAIL US</a>
        </div>
      </div>
      <div class="tech-stack">
        <h2>Technology Stack</h2>
        <ul class="tech-list">
          <li>
            <LuUtensils class="icon" />
            <span>Framework: Qwik</span>
          </li>
          <li>
            <LuRocket class="icon" />
            <span>Hosting: Vercel</span>
          </li>
          <li>
            <LuDatabase class="icon" />
            <span>Database: Google Firebase</span>
          </li>
          <li>
            <LuBrain class="icon" />
            <span>AI Integration: OpenAI</span>
          </li>
        </ul>
      </div>
    </div>
  );
});
