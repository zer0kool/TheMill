import type { TaskCtx } from '@builder.io/qwik';
import { component$, useStore, $, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/services/firebaseConfig';
import type { AuthContextType } from '~/routes/layout';
import { AuthContext } from '~/routes/layout';
import './Login.css';

const Login = component$(() => {
  const authContext = useContext<AuthContextType>(AuthContext);
  const userSignal = useSignal<AuthContextType['user']>(null);
  const authStore = useStore<{ user: AuthContextType['user'] }>({ user: null });

  const store = useStore({
    email: '',
    password: '',
    error: '',
  });

  const handleLogin = $(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!auth) throw new Error("Authentication is not initialized");
      const userCredential = await signInWithEmailAndPassword(auth, store.email, store.password);
      const user = userCredential.user;
      userSignal.value = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      };
    } catch (error) {
      store.error = (error as Error).message;
    }
  });

  useTask$(({ track }: TaskCtx) => {
    const user = track(() => userSignal.value);
    if (user) {
      authStore.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      };
    } else {
      authStore.user = null;
    }
  });

  useTask$(({ track }: TaskCtx) => {
    const authUser = track(() => authStore.user);
    if (authUser) {
      authContext.user = authUser;
    }
  });

  return (
    <div class="login-container auth-container">
      <h2>Login</h2>
      <form preventdefault:submit onSubmit$={handleLogin}>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            value={store.email}
            onInput$={(e) => store.email = (e.target as HTMLInputElement).value}
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            value={store.password}
            onInput$={(e) => store.password = (e.target as HTMLInputElement).value}
            required
          />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      {store.error && <p class="error">{store.error}</p>}
    </div>
  );
});

export default Login;
