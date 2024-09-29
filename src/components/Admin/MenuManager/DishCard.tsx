import { component$ } from '@builder.io/qwik';
import type { MenuItem } from '~/services/menuService';
import { LuSun, LuCloud, LuCloudRain, LuCloudSnow, LuSunrise, LuSunset, LuLeaf, LuSnowflake, LuUmbrella, LuThermometer, LuUtensils, LuCoffee, LuSalad } from '@qwikest/icons/lucide';
import './DishCard.css';

interface DishCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  isEditable: boolean; // New prop to check authentication
}

const DishCard = component$(({ item, onEdit, onDelete, isEditable }: DishCardProps) => {
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
      case 'main course': return <LuUtensils class="icon" />;
      case 'starter': return <LuSalad class="icon" />;
      case 'dessert': return <LuCoffee class="icon" />;
      default: return <LuUtensils class="icon" />;
    }
  };

  const getSeasonIcon = (season: string) => {
    switch (season.toLowerCase()) {
      case 'spring': return <LuLeaf class="icon" />;
      case 'summer': return <LuSun class="icon" />;
      case 'fall':
      case 'autumn': return <LuUmbrella class="icon" />;
      case 'winter': return <LuSnowflake class="icon" />;
      default: return <LuThermometer class="icon" />;
    }
  };

  return (
    <div class="menu-item">
      <h2>{item.name}</h2>
      <p class="price">${item.price ? item.price.toFixed(2) : 'Ask Me'}</p>
      <p class="description">{item.description}</p>
      <div class="tags">
        {item.weather && (
          <span class="tag">
            {getWeatherIcon(item.weather)} {item.weather}
          </span>
        )}
        {item.daytime && (
          <span class="tag">
            {getMealTypeIcon(item.daytime)} {item.daytime}
          </span>
        )}
        {item.season && (
          <span class="tag">
            {getSeasonIcon(item.season)} {item.season}
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
      {isEditable && (
        <div class="button-group">
          <button class="edit-button" onClick$={onEdit}>Edit</button>
          <button class="delete-button" onClick$={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
});

export default DishCard;
