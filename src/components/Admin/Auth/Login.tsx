import { component$, useStore, $, useContext } from '@builder.io/qwik';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '~/services/firebaseConfig';
import { AuthContext } from '~/routes/layout';
import './Login.css';

// Define a type for the user
type User = {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
};

export default component$(() => {
  const store = useStore({
    email: '',
    password: '',
    error: '',
    loading: false,
  });

  // Update the authState type to include user
  const authState = useContext<AuthContextType>(AuthContext); // Ensure AuthContextType is defined

  const handleLogin = $(async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    store.error = '';
    store.loading = true;

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, store.email, store.password);
      const user = userCredential.user;
      authState.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      } as User; // Cast to User type
      console.log('Login successful', user);
    } catch (error) {
      if (error instanceof Error) {
        store.error = error.message;
      } else {
        store.error = 'Failed to log in. Please check your credentials.';
      }
      console.error('Login error:', error);
    } finally {
      store.loading = false;
    }
  });

  return (
    <div class="auth-container">
      <div class="auth-form">
        <h2>Welcome Back</h2>
        <p class="form-description">Please enter your credentials.</p>
        {store.error && <p class="error-message">{store.error}</p>}
        {store.loading && <div class="loader"></div>}
        <form preventdefault:submit onSubmit$={handleLogin}>
          <div class="form-group">

            <input
              type="email"
              id="email"
              value={store.email}
              onInput$={(e) => (store.email = (e.target as HTMLInputElement).value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div class="form-group">

            <input
              type="password"
              id="password"
              value={store.password}
              onInput$={(e) => (store.password = (e.target as HTMLInputElement).value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" class="submit-button" disabled={store.loading}>
            {store.loading ? 'Logging in...' : 'Login'}
          </button>
          <p class="forgot-password"><a href="#">Forgot your password?</a></p>
        </form>
      </div>
    </div>
  );
});
