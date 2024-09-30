import { component$, useStore, $, useTask$ } from "@builder.io/qwik"; // Import necessary hooks
import { menuService } from "~/services/menuService"; // Import the menuService
import './menu.css';

// Define the interface for a menu item
interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price?: number;
  type: string;
  season: string;
  weather: string;
  daytime: string;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  ingredients: string[];
  category: string;
}

export const Menu = component$(() => {
  const state = useStore<{ loading: boolean; items: MenuItem[]; error: string | null }>({
    loading: true,
    items: [],
    error: null,
  }); // Manage loading state, items, and error

  // Fetch menu items from the menuService
  const fetchMenuItems = $(async () => {
    state.loading = true; // Set loading to true
    state.error = null; // Reset error state
    state.items = []; // Reset items

    try {
      console.log("Fetching menu items..."); // Log fetching start
      const fetchedItems = await menuService.getMenuItems(); // Fetching directly from menuService
      console.log("Fetched items:", fetchedItems); // Log fetched items
      state.items = fetchedItems; // Set the fetched items
    } catch (error: any) {
      console.error("Error fetching menu items:", error);
      state.error = error.message; // Set error message
    } finally {
      state.loading = false; // Set loading to false
      console.log("Loading complete.", state.items); // Log loading complete
    }
  });

  // Fetch data when the component mounts
  useTask$(async () => {
    console.log("Initial load");
    await fetchMenuItems(); // Call the fetch function
  });

  // Display loading state
  if (state.loading) {
    return <p>Loading menu items...</p>;
  }

  // Handle error state
  if (state.error) {
    console.error("Error state:", state.error);
    return <p style={{ color: 'red' }}>{state.error}</p>; // Show error message
  }

  // Once loading is complete, render the menu items
  return (
    <div class="menu">
      <h2>Our Menu</h2>
      <div class="menu-items">
        {state.items.length > 0 ? (
          state.items.map((item) => (
            <div key={item.id || Math.random()} class="menu-item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${(item.price ?? 0).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </div>
    </div>
  );
});
