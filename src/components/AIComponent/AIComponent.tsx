import { component$, useStore, useTask$ } from "@builder.io/qwik";
import menuData from './db.json'; // Adjust the path as necessary
import Recommendations from './Recommendations'; // Import the new Recommendations component
import './AIComponent.css';

// Define an interface for your menu item
interface MenuItem {
    id: number;
    name: string;
    prices: { cup: number; bowl: number; };
    mood: { season: string; weather: string; daytime: string; };
    isVegan: boolean;
    isGlutenFree: boolean;
    recommendationWeight: number;
    description: string;
    allergens: string[];
    ingredients: string[];
}

const AIComponent = component$(() => {
    const state = useStore({
        searchTerm: "",
        recommendations: [] as MenuItem[] // Explicitly type as MenuItem[]
    });

    // Convert filterMenuItems to a QRL
    const filterMenuItems = useTask$(() => {
        const allItems = [
            ...menuData.menu.starters,
            ...menuData.menu.soups_and_salads.soups,
            ...menuData.menu.soups_and_salads.salads,
            ...menuData.menu.sandwiches_and_burgers,
            ...menuData.menu.breakfast.skillets,
            ...menuData.menu.breakfast.classics,
            ...menuData.menu.breakfast.benedicts,
            ...menuData.menu.breakfast.omelettes_and_scrambles,
            ...menuData.menu.breakfast.griddles,
            ...menuData.menu.entrees.seafood,
            ...menuData.menu.entrees.poultry,
            ...menuData.menu.entrees.beef,
            ...menuData.menu.entrees.pasta,
            ...menuData.menu.sides_and_extras,
            ...menuData.menu.beverages,
        ];

        const filteredItems = allItems.filter(item =>
            item.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );

        state.recommendations = filteredItems.slice(0, 10); // Limit to 10 recommendations
    });

    return (
        <div class="ai-wrap">
            <div class="ai-component">
                <h2 class="ai-title">Search for Menu Items</h2>
                <input
                    type="text"
                    class="search-input"
                    placeholder="Type to search..."
                    value={state.searchTerm}
                    onInput$={(e) => {
                        const target = e.target as HTMLInputElement; // Ensure target is an HTMLInputElement
                        state.searchTerm = target.value; // Update search term
                        if (state.searchTerm === "") {
                            state.recommendations = []; // Clear recommendations if input is empty
                        } else {
                            filterMenuItems(); // Filter items on input change
                        }
                    }}
                />
            </div>
            {state.searchTerm && ( // Only render recommendations if searchTerm is not empty
                <Recommendations recommendations={state.recommendations} />
            )}
        </div>
    );
});
export default AIComponent;

