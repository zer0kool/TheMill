import { component$, useStore, useTask$, $ } from "@builder.io/qwik";
import menuData from '~/components/AIComponent/db.json'; // Adjust the path as necessary
import './ListAll.css'; // Import the CSS for ListAll
import DishCard from '../Admin/MenuManager/DishCard'; // Import the DishCard component
import type { MenuItem } from "~/services/menuService";

const mapToMenuItem = (item: any): MenuItem => ({
  ...item,
  id: item.id.toString(),
  type: item.mood?.season || '',
  season: item.mood?.season || '',
  weather: item.mood?.weather || '',
  daytime: item.mood?.daytime || '',
  category: '', // Add appropriate category
  price: item.price || (item.prices ? Object.values(item.prices)[0] : 0),
});

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
        Starters: menuData.menu.starters.map(mapToMenuItem),
        'Soups and Salads': [...menuData.menu.soups_and_salads.soups, ...menuData.menu.soups_and_salads.salads]
            .map(mapToMenuItem),
        'Sandwiches and Burgers': menuData.menu.sandwiches_and_burgers.map(mapToMenuItem),
        Breakfast: [
            ...menuData.menu.breakfast.skillets,
            ...menuData.menu.breakfast.classics,
            ...menuData.menu.breakfast.benedicts,
            ...menuData.menu.breakfast.omelettes_and_scrambles,
            ...menuData.menu.breakfast.griddles
        ].map(mapToMenuItem),
        Entrees: [
            ...menuData.menu.entrees.seafood,
            ...menuData.menu.entrees.poultry,
            ...menuData.menu.entrees.beef,
            ...menuData.menu.entrees.pasta
        ].map(mapToMenuItem),
        'Sides and Extras': menuData.menu.sides_and_extras.map(mapToMenuItem),
        Beverages: menuData.menu.beverages.map(mapToMenuItem)
    };

    // Function to load more items for a specific category
    const loadMoreItems = $((category: string) => {
        // Increase the number of items to show for the specific category
        state.itemsToShow[category] += 4;
    });

    const onEdit = $(() => {});
    const onDelete = $(() => {});

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
                                    onEdit={onEdit}
                                    onDelete={onDelete}
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
