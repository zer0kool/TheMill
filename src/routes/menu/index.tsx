import { component$ } from "@builder.io/qwik";
// import { Menu } from "~/components/Menu/Menu";
import ListAll from "~/components/Menu/ListAll"; // Import ListAll component

export default component$(() => {
  return (
    <div class="menu-container">
      <header class="hero">
        <h1>Menu</h1>
      <p>What would you like to eat today?</p>
      </header>
      <ListAll /> {/* Render the ListAll component */}
    </div>
  );
});
