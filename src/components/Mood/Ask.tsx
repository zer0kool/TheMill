import { component$, useSignal, useStyles$ } from '@builder.io/qwik';

const styles = `
  .ask-container {
    z-index: 99;
    border-radius: 20px;
    padding: 30px 0 50px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .38rem;
  }

  .ask-container .mood-input {
    width: 100%;
    padding: 15px;
    border: 2px solid transparent;
    border-radius: 25px;
    font-size: 1.2rem;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 2px solid grey;
    width: 380px;
  }
  
  .ask-container .mood-input:focus {
    outline: none;
    box-shadow: rgb(38 57 77 / 58%) 0px 20px 30px -10px;
    border: 2px solid #d5d7dd;
  }

  .ask-container .mood-info {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    font-size: .875rem;
    color: #ffffff;
    gap: 1rem;
    align-items: center;
  }
`;

export default component$(() => {
  const mood = useSignal('');

  useStyles$(styles); // Apply styles

  return (
    <div class="ask-container">
      <input
        type="text"
        placeholder="What are you in the mood for?"
        value={mood.value}
        onInput$={(event) => mood.value = (event.target as HTMLInputElement).value}
        class="mood-input"
      />
    </div>
  );
});
