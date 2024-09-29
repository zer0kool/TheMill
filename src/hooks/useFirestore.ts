import { useSignal, useTask$, $ } from "@builder.io/qwik";
import { db } from "~/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import type { MenuItem } from "~/services/menuService"; // Ensure MenuItem type is defined

export function useFirestore() {
  const menuItems = useSignal<MenuItem[]>([]);
  const loading = useSignal<boolean>(true); // Loading state

  const fetchMenuItems = $(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      const items: MenuItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        price: doc.data().price,
        type: doc.data().type,
        season: doc.data().season,
        weather: doc.data().weather,
        daytime: doc.data().daytime,
        isVegan: doc.data().isVegan,
        isGlutenFree: doc.data().isGlutenFree,
        allergens: doc.data().allergens || [],
        ingredients: doc.data().ingredients || [],
        category: doc.data().category
      }));
      console.log("Fetched menu items:", items);
      menuItems.value = items;
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      loading.value = false; // Ensure this is reached
      console.log("Loading state set to false"); // Confirm this log appears
    }
  });

  useTask$(() => {
    fetchMenuItems(); // Call the fetch function
  });

  return { menuItems, loading }; // Return menuItems and loading state
}
