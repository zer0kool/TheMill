import { component$, useStore } from '@builder.io/qwik'; // Added useStore
import { useLocation } from '@builder.io/qwik-city'; // Added useLocation
import './Navbar.css'; 
import TimeTracker from '../Mood/TimeTracker';
import Weather from '../Mood/Weather';

const Navbar = component$(() => {
  const location = useLocation(); // Get current location
  const store = useStore({ activeLink: location.url.pathname }); // Track active link

  return (
    <nav class="navbar">
      <div class="menu-bar">
        <ul class="nav-links">
          <li class={store.activeLink === '/' ? 'active' : ''}><a href="/">Home</a></li>
          <li class={store.activeLink === '/menu' ? 'active' : ''}><a href="/menu/">Menu</a></li>
          <li class={store.activeLink === '/about' ? 'active' : ''}><a href="/about/">About</a></li>
          <li class={store.activeLink === '/dashboard' ? 'active' : ''}><a href="/dashboard/">Dash</a></li>
        </ul>
      </div>
      <div class="climate">
        <TimeTracker />
        <span> | </span>
        <Weather />
      </div>
    </nav>
  );
});

export default Navbar;