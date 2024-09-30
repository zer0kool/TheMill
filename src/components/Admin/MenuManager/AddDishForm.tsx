import type { QRL } from '@builder.io/qwik';
import { component$, useStore, $ } from '@builder.io/qwik';
import type { MenuItem } from '~/services/menuService';
import { db } from '~/services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './AddDishForm.css'; // Import the CSS for styling

/**
 * AddDishForm - Renders a form for adding a new dish with various attributes.
 * 
 * Note: This form includes fields for dish name, price, type, season, weather, daytime, dietary restrictions, description, allergens, and ingredients.
 *
 * @returns {JSX.Element} - The rendered form component.
 */
interface AddDishFormProps {
  onAddDish$: QRL<(newDish: Omit<MenuItem, "id">) => Promise<void>>;
}

export const AddDishForm = component$<AddDishFormProps>(({ onAddDish$ }) => {
  const store = useStore({
    name: '',
    description: '',
    price: 0,
    type: '',
    season: '',
    weather: '',
    daytime: '',
    isVegan: false,
    isGlutenFree: false,
    allergens: [] as string[],
    ingredients: [] as string[],
    category: '',
  });

  /**
   * handleSubmit - Handles the form submission, adds a new dish to the Firestore database.
   *
   * @param {Event} event - The form submission event.
   * @returns {void}
   */
  const handleSubmit = $(async () => {
    const newDish: Omit<MenuItem, "id"> = {
      ...store,
      price: Number(store.price), // Ensure price is a number
    };

    await onAddDish$(newDish);

    // Reset form after submission
    Object.keys(store).forEach(key => {
      (store as any)[key] = typeof store[key as keyof typeof store] === 'boolean' ? false : 
                            Array.isArray(store[key as keyof typeof store]) ? [] : '';
    });
    store.price = 0;
  });

  /**
   * handleAddAllergen - Adds a new allergen to the list of allergens.
   *
   * @returns {void}
   */
  const handleAddAllergen = $((): void => {
    if (store.newAllergen && !store.allergens.includes(store.newAllergen)) {
      store.allergens = [...store.allergens, store.newAllergen];
      store.newAllergen = '';
    }
  });

  /**
   * handleRemoveAllergen - Removes an allergen from the list of allergens.
   *
   * @param {string} allergen - The allergen to remove.
   * @returns {void}
   */
  const handleRemoveAllergen = $((allergen: string): void => {
    store.allergens = store.allergens.filter(a => a !== allergen);
  });

  /**
   * handleAddIngredient - Adds a new ingredient to the list of ingredients.
   *
   * @returns {void}
   */
  const handleAddIngredient = $((): void => {
    if (store.newIngredient && !store.ingredients.includes(store.newIngredient)) {
      store.ingredients = [...store.ingredients, store.newIngredient];
      store.newIngredient = '';
    }
  });

  /**
   * handleRemoveIngredient - Removes an ingredient from the list of ingredients.
   *
   * @param {string} ingredient - The ingredient to remove.
   * @returns {void}
   */
  const handleRemoveIngredient = $((ingredient: string): void => {
    store.ingredients = store.ingredients.filter(i => i !== ingredient);
  });

  return (
    <div class="menu-editor">
      <h2>Add New Dish</h2>
      {store.successMessage && <p class="success-message">{store.successMessage}</p>}
      <form onSubmit$={handleSubmit} preventdefault:submit>
        <div class="form-group">
          <label for="name">Dish Name</label>
          <input type="text" id="name" placeholder="Enter dish name" required value={store.name} onInput$={(e) => (store.name = (e.target as HTMLInputElement).value)} />
        </div>

        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" placeholder="0.00" required value={store.price} onInput$={(e) => (store.price = Number((e.target as HTMLInputElement).value))} />
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label for="type">Type of Dish</label>
            <select id="type" required value={store.type} onChange$={(e) => (store.type = (e.target as HTMLSelectElement).value)}>
              <option value="starter">Starter</option>
              <option value="main">Main Course</option>
              <option value="dessert">Dessert</option>
            </select>
          </div>

          <div class="form-group half-width">
            <label for="season">Season</label>
            <select id="season" required value={store.season} onChange$={(e) => (store.season = (e.target as HTMLSelectElement).value)}>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label for="weather">Weather</label>
            <select id="weather" required value={store.weather} onChange$={(e) => (store.weather = (e.target as HTMLSelectElement).value)}>
              <option value="sunny">Sunny</option>
              <option value="rainy">Rainy</option>
              <option value="cloudy">Cloudy</option>
              <option value="snowy">Snowy</option>
            </select>
          </div>

          <div class="form-group half-width">
            <label for="daytime">Daytime</label>
            <select id="daytime" required value={store.daytime} onChange$={(e) => (store.daytime = (e.target as HTMLSelectElement).value)}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half-width toggle-group">
            <label for="isVegan">Is Vegan?</label>
            <label class="switch">
              <input type="checkbox" id="isVegan" checked={store.isVegan} onChange$={() => (store.isVegan = !store.isVegan)} />
              <span class="slider round"></span>
            </label>
          </div>

          <div class="form-group half-width toggle-group">
            <label for="isGlutenFree">Is Gluten Free?</label>
            <label class="switch">
              <input type="checkbox" id="isGlutenFree" checked={store.isGlutenFree} onChange$={() => (store.isGlutenFree = !store.isGlutenFree)} />
              <span class="slider round"></span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" placeholder="Enter dish description" required value={store.description} onInput$={(e) => (store.description = (e.target as HTMLTextAreaElement).value)} />
        </div>

        <div class="form-group">
          <label for="allergens">Allergens (e.g., nuts, dairy, gluten)</label>
          <div class="input-group">
            <input type="text" id="newAllergen" placeholder="Add allergen" value={store.newAllergen} onInput$={(e) => (store.newAllergen = (e.target as HTMLInputElement).value)} />
            <button type="button" onClick$={handleAddAllergen}>Add</button>
          </div>
          <div class="tags-container">
            {store.allergens.map((allergen, index) => (
              <div key={index} class="tag">
                {allergen}
                <button type="button" onClick$={() => handleRemoveAllergen(allergen)} class="remove-button">X</button>
              </div>
            ))}
          </div>
        </div>

        <div class="form-group">
          <label for="ingredients">Ingredients (e.g., chicken, rice, broccoli)</label>
          <div class="input-group">
            <input type="text" id="newIngredient" placeholder="Add ingredient" value={store.newIngredient} onInput$={(e) => (store.newIngredient = (e.target as HTMLInputElement).value)} />
            <button type="button" onClick$={handleAddIngredient}>Add</button>
          </div>
          <div class="tags-container">
            {store.ingredients.map((ingredient, index) => (
              <div key={index} class="tag">
                {ingredient}
                <button type="button" onClick$={() => handleRemoveIngredient(ingredient)} class="remove-button">X</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" class="submit-button">Add Dish</button>
      </form>
    </div>
  );
});

export default AddDishForm;
