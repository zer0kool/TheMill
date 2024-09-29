import { component$, useStore, useTask$ } from "@builder.io/qwik";
import menuData from './db.json'; // Adjust the path as necessary
import { getCurrentDaytime } from '~/utils/helpers'; // Import from helpers
import './MoodComponent.css'; // Import the CSS for MoodComponent
import { LuSun, LuCloud, LuCloudRain, LuCloudSnow, LuSunrise, LuSunset, LuLeaf, LuSnowflake, LuUmbrella, LuThermometer, LuUtensils, LuCoffee, LuSalad } from '@qwikest/icons/lucide';

const MoodComponent = component$(({ mood }) => {
    const daytime = getCurrentDaytime(); // Get the current daytime
    console.log("Current Daytime:", daytime); // Debugging: log the current daytime

    const state = useStore({
        currentMood: mood || { season: "summer", weather: "warm", daytime },
        filteredItems: []
    });

    // Use useTask$ to filter items based on the current mood
    useTask$(() => {
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

        // Filter items based on mood and daytime
        state.filteredItems = allItems.filter(item => 
            item.mood?.season === state.currentMood.season && // Use optional chaining
            item.mood?.weather === state.currentMood.weather &&
            item.mood?.daytime === state.currentMood.daytime // Ensure this matches the current time
        );
    });

    const getWeatherIcon = (weather: string) => {
        switch (weather.toLowerCase()) {
            case 'sunny': return <LuSun class="icon" />;
            case 'warm': return <LuSun class="icon" />;
            case 'cloudy': return <LuCloud class="icon" />;
            case 'rainy': return <LuCloudRain class="icon" />;
            case 'cold': return <LuCloudRain class="icon" />;
            case 'snowy': return <LuCloudSnow class="icon" />;
            default: return null;
        }
    };

    const getMealTypeIcon = (mealType: string) => {
        switch (mealType.toLowerCase()) {
            case 'breakfast': return <LuCoffee class="icon" />;
            case 'lunch': return <LuSalad class="icon" />;
            case 'dinner': return <LuUtensils class="icon" />;
            default: return <LuUtensils class="icon" />;
        }
    };

    return (
        <div class="mood-component">
            <h2>Recommended Items for {state.currentMood.daytime}</h2>
            <div class="menu-items-list">
                {state.filteredItems.length > 0 ? (
                    state.filteredItems.map(item => (
                        <div class="menu-item" key={item.id}>
                            <h3>{item.name}</h3>
                            <p class="price">
                                ${item.prices 
                                    ? `${Math.min(...Object.values(item.prices))} - ${Math.max(...Object.values(item.prices))}` 
                                    : item.price}
                            </p>
                            <p class="description">{item.description || 'A delicious menu item'}</p>
                            <div class="tags">
                                {item.mood?.weather && (
                                    <span class="tag">
                                        {getWeatherIcon(item.mood.weather)} {item.mood.weather}
                                    </span>
                                )}
                                {item.mood?.daytime && (
                                    <span class="tag">
                                        {getMealTypeIcon(item.mood.daytime)} {item.mood.daytime}
                                    </span>
                                )}
                            </div>
                            <div class="dietary-tags">
                                {item.isVegan && <span class="dietary-tag vegan">Vegan</span>}
                                {item.isGlutenFree && <span class="dietary-tag gluten-free">Gluten-Free</span>}
                            </div>
                            {item.allergens && item.allergens.length > 0 && (
                                <p class="allergens"><strong>Allergens:</strong> {item.allergens.join(', ')}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No recommendations found.</p>
                )}
            </div>
        </div>
    );
});

export default MoodComponent;
