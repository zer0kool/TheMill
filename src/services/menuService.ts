import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

const COLLECTION_NAME = "menu";

export interface MenuItem {
  id: string;
  name: string;
  price?: number;
  prices?: { [key: string]: number };
  description: string;
  type: string;
  season: string;
  weather: string;
  daytime: string;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  ingredients: string[];
  category: string;
  mood?: { season: string; weather: string; daytime: string };
  recommendationWeight?: number;
}

export const menuService = {
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
    } catch (error) {
      console.error("Error fetching menu items:", error);
      throw error;
    }
  },

  async addMenuItem(item: Omit<MenuItem, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
      return docRef.id;
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  },

  async updateMenuItem(id: string, item: Partial<MenuItem>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), item);
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }
};