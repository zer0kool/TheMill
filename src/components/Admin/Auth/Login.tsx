import { component$, $, useSignal } from '@builder.io/qwik';
import { getAuth } from '~/utils/firebase';

export default component$(() => {
  const emailSignal = useSignal('');
  const passwordSignal = useSignal('');

  const handleLogin = $(async () => {
    const auth = await getAuth();
    if (!auth) {
      console.error('Auth is not available');
      return;
    }

    const { signInWithEmailAndPassword } = await import('firebase/auth');
    try {
      await signInWithEmailAndPassword(auth, emailSignal.value, passwordSignal.value);
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Login failed:', error);
    }
  });

  return (
    <form preventdefault:submit onSubmit$={handleLogin}>
      <input
        type="email"
        value={emailSignal.value}
        onInput$={(e) => (emailSignal.value = (e.target as HTMLInputElement).value)}
      />
      <input
        type="password"
        value={passwordSignal.value}
        onInput$={(e) => (passwordSignal.value = (e.target as HTMLInputElement).value)}
      />
      <button type="submit">Login</button>
    </form>
  );
});
