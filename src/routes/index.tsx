import { component$ } from "@builder.io/qwik"; // Removed unused imports
import type { DocumentHead } from "@builder.io/qwik-city";
import AIComponent from "~/components/AIComponent/AIComponent"; // Import AIComponent
import MoodComponent from "~/components/AIComponent/MoodComponent"; // Import MoodComponent
import { getCurrentDaytime } from "~/utils/helpers"; // Import from helpers
import './index.css';
import Logo from "~/components/Header/Logo"; // Import the Logo component
import Ask from "~/components/Mood/Ask";


export default component$(() => {
  const daytime = getCurrentDaytime(); // Get the current daytime
  const moodData = { season: "summer", weather: "warm", daytime };

  return (
    <div class="homepage-container">
      <header class="hero">
        <Logo /> {/* Use the Logo component here */}
        <h1>Welcome to The Mill</h1>
        <p>Experience culinary excellence in a minimalist setting</p>
        <Ask />
      </header>
      {/* <div class="ai-component-container"> 
        <AIComponent /> 
      </div> */}
      <MoodComponent mood={moodData} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Restaurant App",
  meta: [
    {
      name: "description",
      content: "A restaurant app built with Qwik and Firebase",
    },
  ],
};