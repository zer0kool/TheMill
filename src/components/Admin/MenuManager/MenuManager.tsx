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
    name: useSignal(""),
    description: useSignal(""),
    price: useSignal(0),
    type: useSignal("starter"),
    season: useSignal("winter"),
    weather: useSignal("sunny"),
    daytime: useSignal("breakfast"),
    isVegan: useSignal(false),
    isGlutenFree: useSignal(false),
    allergens: useSignal([] as string[]),
    ingredients: useSignal([] as string[]),
    category: useSignal("")
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
    editingItem.id = item.id!;
    editingItem.name.value = item.name;
    editingItem.description.value = item.description;
    editingItem.price.value = item.price;
    editingItem.type.value = item.type;
    editingItem.season.value = item.season;
    editingItem.weather.value = item.weather;
    editingItem.daytime.value = item.daytime;
    editingItem.isVegan.value = item.isVegan;
    editingItem.isGlutenFree.value = item.isGlutenFree;
    editingItem.allergens.value = [...item.allergens];
    editingItem.ingredients.value = [...item.ingredients];
    editingItem.category.value = item.category;
    isEditing.value = true;
    isEditModalOpen.value = true;
    document.body.classList.add('modal-open');
  });

  const handleUpdateMenuItem = $(async () => {
    try {
      const updatedItem: MenuItem = {
        id: editingItem.id,
        name: editingItem.name.value,
        description: editingItem.description.value,
        price: editingItem.price.value,
        type: editingItem.type.value,
        season: editingItem.season.value,
        weather: editingItem.weather.value,
        daytime: editingItem.daytime.value,
        isVegan: editingItem.isVegan.value,
        isGlutenFree: editingItem.isGlutenFree.value,
        allergens: editingItem.allergens.value,
        ingredients: editingItem.ingredients.value,
        category: editingItem.category.value, // Make sure this line is included
      };

      await menuService.updateMenuItem(updatedItem);
      isEditModalOpen.value = false;
      document.body.classList.remove('modal-open');
      const items = await menuService.getMenuItems();
      menuItems.value = items;
    } catch (err) {
      console.error('Error updating menu item:', err);
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
    if (newAllergen.value && !editingItem.allergens.value.includes(newAllergen.value)) {
      editingItem.allergens.value = [...editingItem.allergens.value, newAllergen.value];
      newAllergen.value = "";
    }
  });

  const handleRemoveAllergen = $((allergen: string) => {
    editingItem.allergens.value = editingItem.allergens.value.filter(a => a !== allergen);
  });

  const handleAddIngredient = $(() => {
    if (newIngredient.value && !editingItem.ingredients.value.includes(newIngredient.value)) {
      editingItem.ingredients.value = [...editingItem.ingredients.value, newIngredient.value];
      newIngredient.value = "";
    }
  });

  const handleRemoveIngredient = $((ingredient: string) => {
    editingItem.ingredients.value = editingItem.ingredients.value.filter(i => i !== ingredient);
  });

  const filteredMenuItems = useComputed$(() => {
    const term = searchTerm.value.toLowerCase();
    return menuItems.value.filter((item: { name: string; description: string }) => 
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
                <AddDishForm onAddDish$={handleAddMenuItem} />
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
                      bind:value={editingItem.name}
                      placeholder="Enter item name" 
                      required 
                    />
                  </div>
                  <div class="form-group">
                    <label for="edit-description">Description</label>
                    <textarea 
                      id="edit-description" 
                      bind:value={editingItem.description}
                      placeholder="Enter item description" 
                      required 
                    />
                  </div>
                  <div class="form-group">
                    <label for="edit-price">Price</label>
                    <input
                      type="number"
                      id="edit-price"
                      bind:value={editingItem.price}
                      placeholder="Enter item price"
                      required
                    />
                  </div>
                  <div class="form-row">
                    <div class="form-group half-width">
                      <label for="edit-type">Type of Dish</label>
                      <select 
                        id="edit-type" 
                        bind:value={editingItem.type} 
                        required 
                        onChange$={() => (editingItem.type.value = editingItem.type.value)}
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
                        value={editingItem.season.value} 
                        onChange$={(e) => editingItem.season.value = (e.target as HTMLSelectElement).value}
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
                        onChange$={() => (editingItem.weather.value = editingItem.weather.value)}
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
                        value={editingItem.daytime.value} 
                        onChange$={(e) => editingItem.daytime.value = (e.target as HTMLSelectElement).value}
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
                          checked={editingItem.isVegan.value} 
                          onChange$={() => editingItem.isVegan.value = !editingItem.isVegan.value} 
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
                          checked={editingItem.isGlutenFree.value} 
                          onChange$={() => editingItem.isGlutenFree.value = !editingItem.isGlutenFree.value} 
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
                      {editingItem.allergens.value.map((allergen) => (
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
                      {editingItem.ingredients.value.map((ingredient) => (
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
                      value={editingItem.category.value}
                      onChange$={(event) => editingItem.category.value = (event.target as HTMLInputElement).value}
                      placeholder="Enter item category" 
                      required
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
                onEdit={$(() => handleEditMenuItem(item))}
                onDelete={$(() => handleDeleteMenuItem(item.id!))}
                isEditable={isAuthenticated}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});