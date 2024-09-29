import { component$, useStore, useTask$, $ } from "@builder.io/qwik";
import menuData from '~/components/AIComponent/db.json'; // Adjust the path as necessary
import './ListAll.css'; // Import the CSS for ListAll
import DishCard from '../Admin/MenuManager/DishCard'; // Import the DishCard component

interface MenuItem {
    id: string;
    name: string;
    prices?: { [key: string]: number };
    price?: number;
    description?: string;
    mood?: {
        season: string;
        weather: string;
        daytime: string;
    };
    isVegan?: boolean;
    isGlutenFree?: boolean;
    allergens?: string[];
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

    // Group items by category for easier rendering
    const groupedItems: Record<string, MenuItem[]> = {
        Starters: menuData.menu.starters.map(item => ({ ...item, id: item.id.toString() })),
        'Soups and Salads': [...menuData.menu.soups_and_salads.soups, ...menuData.menu.soups_and_salads.salads]
            .map(item => ({ ...item, id: item.id.toString() })),
        'Sandwiches and Burgers': menuData.menu.sandwiches_and_burgers.map(item => ({ ...item, id: item.id.toString() })),
        Breakfast: [
            ...menuData.menu.breakfast.skillets,
            ...menuData.menu.breakfast.classics,
            ...menuData.menu.breakfast.benedicts,
            ...menuData.menu.breakfast.omelettes_and_scrambles,
            ...menuData.menu.breakfast.griddles
        ].map(item => ({ ...item, id: item.id.toString() })),
        Entrees: [
            ...menuData.menu.entrees.seafood,
            ...menuData.menu.entrees.poultry,
            ...menuData.menu.entrees.beef,
            ...menuData.menu.entrees.pasta
        ].map(item => ({ ...item, id: item.id.toString() })),
        'Sides and Extras': menuData.menu.sides_and_extras.map(item => ({ ...item, id: item.id.toString() })),
        Beverages: menuData.menu.beverages.map(item => ({ ...item, id: item.id.toString() }))
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
