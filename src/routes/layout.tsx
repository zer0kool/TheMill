import { component$, Slot, useStore, useContextProvider, createContextId, useTask$ } from "@builder.io/qwik";
import { auth } from '~/services/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import Navigation from '~/components/Navbar/Navbar';
import Footer from '~/components/Footer/Footer';

export interface AuthContextType {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    emailVerified: boolean;
  } | null;
}

export const AuthContext = createContextId<AuthContextType>('auth-context');

export default component$(() => {
  const authState = useStore<AuthContextType>({
    user: null,
  });

  useContextProvider(AuthContext, authState);

  useTask$(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          authState.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
          };
          console.log('User logged in:', authState.user);
        } else {
          authState.user = null;
          console.log('User logged out');
        }
      });

      return () => unsubscribe();
    }
  });

  return (
    <>
    <Navigation />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});