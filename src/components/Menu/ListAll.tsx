import { component$, useStore, useTask$, $ } from "@builder.io/qwik";
import menuData from '~/components/AIComponent/db.json'; // Adjust the path as necessary
import './ListAll.css'; // Import the CSS for ListAll
import DishCard from '../Admin/MenuManager/DishCard'; // Import the DishCard component

interface MenuItem {
    id: string;  // Change this to string
    name: string;
    prices: { [key: string]: number };
    price?: number;
    description: string;
    mood: {
        season: string;
        weather: string;
        daytime: string;
    };
    isVegan: boolean;
    isGlutenFree: boolean;
    allergens: string[];
    ingredients?: string[];
    recommendationWeight?: number;
}

const ListAll = component$(() => {
    // State to manage the number of items to show per category
    const state = useStore({
        itemsToShow: {} as Record<string, number>
    });

    // useTask$ runs once when the component is mounted
    useTask$(() => {
        // Initialize itemsToShow for each category
        const categories = ['Starters', 'Soups and Salads', 'Sandwiches and Burgers', 'Breakfast', 'Entrees', 'Sides and Extras', 'Beverages'];
        categories.forEach(category => {
            state.itemsToShow[category] = 4; // Initially show 4 items per category
        });
    });

    // Function to map items to MenuItem interface
    const mapToMenuItem = (item: any): MenuItem => ({
        ...item,
        id: String(item.id),  // Convert id to string
        prices: item.prices || { single: item.price },  // Ensure prices is always an object
    });

    // Group items by category for easier rendering
    const groupedItems: Record<string, MenuItem[]> = {
        Starters: menuData.menu.starters.map(mapToMenuItem),
        'Soups and Salads': [...menuData.menu.soups_and_salads.soups, ...menuData.menu.soups_and_salads.salads].map(mapToMenuItem),
        'Sandwiches and Burgers': menuData.menu.sandwiches_and_burgers.map(mapToMenuItem),
        Breakfast: [
            ...menuData.menu.breakfast.skillets.map(mapToMenuItem),
            ...menuData.menu.breakfast.classics.map(mapToMenuItem),
            ...menuData.menu.breakfast.benedicts.map(mapToMenuItem),
            ...menuData.menu.breakfast.omelettes_and_scrambles.map(mapToMenuItem),
            ...menuData.menu.breakfast.griddles.map(mapToMenuItem)
        ],
        Entrees: [
            ...menuData.menu.entrees.seafood.map(mapToMenuItem),
            ...menuData.menu.entrees.poultry.map(mapToMenuItem),
            ...menuData.menu.entrees.beef.map(mapToMenuItem),
            ...menuData.menu.entrees.pasta.map(mapToMenuItem)
        ],
        'Sides and Extras': menuData.menu.sides_and_extras.map(mapToMenuItem),
        Beverages: menuData.menu.beverages.map(mapToMenuItem)
    };

    // Function to load more items for a specific category
    const loadMoreItems = $((category: string) => {
        // Increase the number of items to show for the specific category
        state.itemsToShow[category] += 4;
    });

    return (
        <div class="list-all">
            {Object.entries(groupedItems).map(([category, items]) => (
                items.length > 0 && (
                    <div key={category} class="category-section">
                        <h2>{category}</h2>
                        <div class="menu-items-list">
                            {items.slice(0, state.itemsToShow[category]).map((item: MenuItem) => (
                                <DishCard 
                                    key={item.id} 
                                    item={item} 
                                    isEditable={false}
                                />
                            ))}
                        </div>
                        {items.length > state.itemsToShow[category] && (
                            <button 
                                class="load-more" 
                                onClick$={() => loadMoreItems(category)}
                            >
                                Load More
                            </button>
                        )}
                    </div>
                )
            ))}
        </div>
    );
});

export default ListAll;
