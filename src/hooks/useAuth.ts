import { useSignal, useTask$} from "@builder.io/qwik";
import { auth } from "~/services/firebaseConfig"; // Adjust the import as necessary

export function useAuth() {
  const user = useSignal<{ uid: string; email: string } | null>(null); // Define the user type

  useTask$(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        user.value = { uid: currentUser.uid, email: currentUser.email || '' };
      } else {
        user.value = null;
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  });

  return { user };
}