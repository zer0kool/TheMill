import { useSignal, useTask$, $ } from "@builder.io/qwik";
import { auth } from "~/services/firebaseConfig"; // Adjust the import as necessary

export function useAuth() {
  const user = useSignal<{ uid: string; email: string } | null>(null); // Define the user type

  useTask$(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: { uid: any; email: any; }) => {
      if (currentUser) {
        // Only store serializable data
        user.value = {
          uid: currentUser.uid,
          email: currentUser.email || '',
        };
      } else {
        user.value = null; // Handle the case when no user is signed in
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  });

  return { user };
}