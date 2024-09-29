import { component$, useStyles$ } from '@builder.io/qwik';

const styles = `
  .mill-logo {
    animation: rotate 20s linear infinite; /* Rotate animation */
    margin: 0 auto;
    z-index: 5;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Logo = component$(() => {
  useStyles$(styles); // Use useStyles$ to apply styles

  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="mill-logo" // Use class instead of className
    >
      <circle cx="50" cy="50" r="45" stroke="#4A5568" stroke-width="2" data-id="2"></circle>
      <path d="M50 5 L50 95" stroke="#4A5568" stroke-width="2" data-id="3"></path>
      <path d="M5 50 L95 50" stroke="#4A5568" stroke-width="2" data-id="4"></path>
      <path d="M20 20 L80 80" stroke="#4A5568" stroke-width="2" data-id="5"></path>
      <path d="M20 80 L80 20" stroke="#4A5568" stroke-width="2" data-id="6"></path>
      <circle cx="50" cy="50" r="5" fill="#4A5568" data-id="7"></circle>
    </svg>
  );
});

export default Logo;
