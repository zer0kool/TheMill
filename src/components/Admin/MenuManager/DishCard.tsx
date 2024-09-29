import type { PropFunction } from '@builder.io/qwik';
import { component$, $ } from '@builder.io/qwik';
import type { MenuItem } from '~/services/menuService';
import { LuSun, LuCloud, LuCloudRain, LuCloudSnow, LuLeaf, LuSnowflake, LuUmbrella, LuThermometer, LuUtensils, LuCoffee, LuSalad } from '@qwikest/icons/lucide';
import './DishCard.css';

interface DishCardProps {
  item: MenuItem;
  onEdit: PropFunction<() => void>;
  onDelete: PropFunction<() => void>;
  isEditable: boolean;
}

export default component$((props: DishCardProps) => {
  const getWeatherIcon = $((weather: string) => {
    switch (weather.toLowerCase()) {
      case 'sunny': return <LuSun class="icon" />;
      case 'warm': return <LuSun class="icon" />;
      case 'cloudy': return <LuCloud class="icon" />;
      case 'rainy': return <LuCloudRain class="icon" />;
      case 'cold': return <LuCloudRain class="icon" />;
      case 'snowy': return <LuCloudSnow class="icon" />;
      default: return null;
    }
  });

  const getMealTypeIcon = $((mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return <LuCoffee class="icon" />;
      case 'lunch': return <LuSalad class="icon" />;
      case 'dinner': return <LuUtensils class="icon" />;
      case 'main course': return <LuUtensils class="icon" />;
      case 'starter': return <LuSalad class="icon" />;
      case 'dessert': return <LuCoffee class="icon" />;
      default: return <LuUtensils class="icon" />;
    }
  });

  const getSeasonIcon = $((season: string) => {
    switch (season.toLowerCase()) {
      case 'spring': return <LuLeaf class="icon" />;
      case 'summer': return <LuSun class="icon" />;
      case 'fall':
      case 'autumn': return <LuUmbrella class="icon" />;
      case 'winter': return <LuSnowflake class="icon" />;
      default: return <LuThermometer class="icon" />;
    }
  });

  return (
    <div class="menu-item">
      <h2>{props.item.name}</h2>
      <p class="price">${props.item.price ? props.item.price.toFixed(2) : 'Ask Me'}</p>
      <p class="description">{props.item.description}</p>
      <div class="tags">
        {props.item.weather && (
          <span class="tag">
            {getWeatherIcon(props.item.weather)} {props.item.weather}
          </span>
        )}
        {props.item.daytime && (
          <span class="tag">
            {getMealTypeIcon(props.item.daytime)} {props.item.daytime}
          </span>
        )}
        {props.item.season && (
          <span class="tag">
            {getSeasonIcon(props.item.season)} {props.item.season}
          </span>
        )}
      </div>
      <div class="dietary-tags">
        {props.item.isVegan && <span class="dietary-tag vegan">Vegan</span>}
        {props.item.isGlutenFree && <span class="dietary-tag gluten-free">Gluten-Free</span>}
      </div>
      {props.item.allergens && props.item.allergens.length > 0 && (
        <p class="allergens"><strong>Allergens:</strong> {props.item.allergens.join(', ')}</p>
      )}
      {props.isEditable && (
        <div class="button-group">
          <button onClick$={props.onEdit} class="edit-button">Edit</button>
          <button onClick$={props.onDelete} class="delete-button">Delete</button>
        </div>
      )}
    </div>
  );
});
