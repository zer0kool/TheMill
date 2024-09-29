import { component$, useSignal, useTask$, $, useComputed$, useStore } from "@builder.io/qwik";
import { menuService } from "~/services/menuService";
import type { MenuItem } from "~/services/menuService";
import './MenuManager.css';
import AddDishForm from './AddDishForm';
import DishCard from './DishCard'; // Import the DishCard component

export const MenuManager = component$(() => {
  const menuItems = useSignal<MenuItem[]>([]);
  const loading = useSignal(true);
  const error = useSignal('');
  const searchTerm = useSignal('');
  const editingItem = useStore({
    id: "",
    name: "",
    description: "",
    price: 0,
    type: "starter",
    season: "winter",
    weather: "sunny",
    daytime: "breakfast",
    isVegan: false,
    isGlutenFree: false,
    allergens: [] as string[],
    ingredients: [] as string[],
    category: ""
  });
  const isEditing = useSignal(false);
  const isAddModalOpen = useSignal(false);
  const isEditModalOpen = useSignal(false);

  const newAllergen = useSignal("");
  const newIngredient = useSignal("");

  const isAuthenticated = true; // Replace with actual authentication logic

  useTask$(async () => {
    try {
      const items = await menuService.getMenuItems();
      menuItems.value = items;
      loading.value = false;
    } catch (err) {
      error.value = 'Failed to fetch menu items';
      loading.value = false;
    }
  });

  const handleAddMenuItem = $(async (newDish: Omit<MenuItem, 'id'>) => {
    try {
      await menuService.addMenuItem(newDish);
      const items = await menuService.getMenuItems();
      menuItems.value = items;
      isAddModalOpen.value = false;
    } catch (err) {
      error.value = 'Failed to add menu item';
    }
  });

  const handleEditMenuItem = $((item: MenuItem) => {
    Object.assign(editingItem, item);
    isEditing.value = true;
    isEditModalOpen.value = true;
    document.body.classList.add('modal-open');
  });

  const handleUpdateMenuItem = $(async () => {
    try {
      const updatedItem: MenuItem = {
        id: editingItem.id,
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        type: editingItem.type,
        season: editingItem.season,
        weather: editingItem.weather,
        daytime: editingItem.daytime,
        isVegan: editingItem.isVegan,
        isGlutenFree: editingItem.isGlutenFree,
        allergens: editingItem.allergens,
        ingredients: editingItem.ingredients,
        category: editingItem.category
      };
      await menuService.updateMenuItem(updatedItem.id!, updatedItem);
      isEditModalOpen.value = false;
      document.body.classList.remove('modal-open');
      const items = await menuService.getMenuItems();
      menuItems.value = items;
    } catch (err) {
      error.value = 'Failed to update menu item';
    }
  });

  const handleDeleteMenuItem = $(async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      const items = await menuService.getMenuItems();
      menuItems.value = items;
    } catch (err) {
      error.value = 'Failed to delete menu item';
    }
  });

  const handleAddAllergen = $(() => {
    if (newAllergen.value && !editingItem.allergens.includes(newAllergen.value)) {
      editingItem.allergens = [...editingItem.allergens, newAllergen.value];
      newAllergen.value = "";
    }
  });

  const handleRemoveAllergen = $((allergen: string) => {
    editingItem.allergens = editingItem.allergens.filter(a => a !== allergen);
  });

  const handleAddIngredient = $(() => {
    if (newIngredient.value && !editingItem.ingredients.includes(newIngredient.value)) {
      editingItem.ingredients = [...editingItem.ingredients, newIngredient.value];
      newIngredient.value = "";
    }
  });

  const handleRemoveIngredient = $((ingredient: string) => {
    editingItem.ingredients = editingItem.ingredients.filter(i => i !== ingredient);
  });

  const filteredMenuItems = useComputed$(() => {
    const term = searchTerm.value.toLowerCase();
    return menuItems.value.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.description.toLowerCase().includes(term)
    );
  });

  return (
    <div class="menu-manager">
      <h1>Our Dishes</h1>
      <div class="header">
        <div class="search-container">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search dishes by name" 
            bind:value={searchTerm}
            class="search-input"
          />
        </div>
        <button class="add-button" onClick$={() => isAddModalOpen.value = true}>+ Add Dish</button>
      </div>
      
      {loading.value ? (
        <p class="loading">Loading menu items...</p>
      ) : error.value ? (
        <p class="error">Error: {error.value}</p>
      ) : (
        <>
          {isAddModalOpen.value && (
            <div class="modal">
              <div class="modal-content">
                <button class="close-button" onClick$={() => isAddModalOpen.value = false}>×</button>
                <AddDishForm onAddDish={handleAddMenuItem} />
              </div>
            </div>
          )}
          
          {isEditModalOpen.value && (
            <div class="modal">
              <div class="modal-content">
                <button class="close-button" onClick$={() => {
                  isEditModalOpen.value = false;
                  document.body.classList.remove('modal-open');
                }}>×</button>
                <form preventdefault:submit onSubmit$={handleUpdateMenuItem}>
                  <h3>Edit Menu Item</h3>
                  <div class="form-group">
                    <label for="edit-name">Name</label>
                    <input 
                      type="text" 
                      id="edit-name" 
                      value={editingItem.name} 
                      onChange$={(e) => editingItem.name = (e.target as HTMLInputElement).value}
                      placeholder="Enter item name" 
                      required 
                    />
                  </div>
                  <div class="form-group">
                    <label for="edit-description">Description</label>
                    <textarea 
                      id="edit-description" 
                      value={editingItem.description} 
                      onChange$={(e) => editingItem.description = (e.target as HTMLTextAreaElement).value}
                      placeholder="Enter item description" 
                      required 
                    />
                  </div>
                  <div class="form-group">
                    <label for="edit-price">Price</label>
                    <input 
                      type="number" 
                      id="edit-price" 
                      value={editingItem.price} 
                      onChange$={(e) => editingItem.price = parseFloat((e.target as HTMLInputElement).value)}
                      placeholder="0.00" 
                      required 
                      min="0" 
                      step="0.01" 
                    />
                  </div>
                  <div class="form-row">
                    <div class="form-group half-width">
                      <label for="edit-type">Type of Dish</label>
                      <select 
                        id="edit-type" 
                        bind:value={editingItem.type} 
                        required 
                        onChange$={() => (editingItem.type = editingItem.type)}
                      >
                        <option value="starter">Starter</option>
                        <option value="main">Main Course</option>
                        <option value="dessert">Dessert</option>
                      </select>
                    </div>
                    <div class="form-group half-width">
                      <label for="edit-season">Season</label>
                      <select 
                        id="edit-season" 
                        value={editingItem.season} 
                        onChange$={(e) => editingItem.season = (e.target as HTMLSelectElement).value}
                        required 
                      >
                        <option value="winter">Winter</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="fall">Fall</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group half-width">
                      <label for="edit-weather">Weather</label>
                      <select 
                        id="edit-weather" 
                        bind:value={editingItem.weather} 
                        required 
                        onChange$={() => (editingItem.weather = editingItem.weather)}
                      >
                        <option value="sunny">Sunny</option>
                        <option value="rainy">Rainy</option>
                        <option value="cloudy">Cloudy</option>
                        <option value="snowy">Snowy</option>
                      </select>
                    </div>
                    <div class="form-group half-width">
                      <label for="edit-daytime">Daytime</label>
                      <select 
                        id="edit-daytime" 
                        value={editingItem.daytime} 
                        onChange$={(e) => editingItem.daytime = (e.target as HTMLSelectElement).value}
                        required 
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group half-width toggle-group">
                      <label for="edit-isVegan">Is Vegan?</label>
                      <label class="switch">
                        <input 
                          type="checkbox" 
                          id="edit-isVegan" 
                          checked={editingItem.isVegan} 
                          onChange$={() => editingItem.isVegan = !editingItem.isVegan} 
                        />
                        <span class="slider round"></span>
                      </label>
                    </div>
                    <div class="form-group half-width toggle-group">
                      <label for="edit-isGlutenFree">Is Gluten Free?</label>
                      <label class="switch">
                        <input 
                          type="checkbox" 
                          id="edit-isGlutenFree" 
                          checked={editingItem.isGlutenFree} 
                          onChange$={() => editingItem.isGlutenFree = !editingItem.isGlutenFree} 
                        />
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="edit-allergens">Allergens</label>
                    <div class="input-group">
                      <input type="text" id="edit-newAllergen" bind:value={newAllergen} placeholder="Add allergen" />
                      <button type="button" onClick$={handleAddAllergen}>Add</button>
                    </div>
                    <div class="tags-container">
                      {editingItem.allergens.map((allergen) => (
                        <div key={allergen} class="tag">
                          {allergen}
                          <button type="button" onClick$={() => handleRemoveAllergen(allergen)} class="remove-button">X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="edit-ingredients">Ingredients</label>
                    <div class="input-group">
                      <input type="text" id="edit-newIngredient" bind:value={newIngredient} placeholder="Add ingredient" />
                      <button type="button" onClick$={handleAddIngredient}>Add</button>
                    </div>
                    <div class="tags-container">
                      {editingItem.ingredients.map((ingredient) => (
                        <div key={ingredient} class="tag">
                          {ingredient}
                          <button type="button" onClick$={() => handleRemoveIngredient(ingredient)} class="remove-button">X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="edit-category">Category</label>
                    <input 
                      type="text" 
                      id="edit-category" 
                      bind:value={editingItem.category} 
                      placeholder="Enter item category" 
                      onChange$={() => (editingItem.category = editingItem.category)}
                    />
                  </div>
                  <div class="button-group">
                    <button type="submit" class="submit-button">Update Item</button>
                    <button type="button" class="cancel-button" onClick$={() => {
                      isEditModalOpen.value = false;
                      document.body.classList.remove('modal-open');
                    }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          <div class="menu-items-list">
            {filteredMenuItems.value.map((item) => (
              <DishCard 
                key={item.id} 
                item={item} 
                onEdit={$(() => handleEditMenuItem(item))} // Wrap in $()
                onDelete={$(() => handleDeleteMenuItem(item.id!))} // Wrap in $()
                isEditable={isAuthenticated} // Pass the authentication status
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});