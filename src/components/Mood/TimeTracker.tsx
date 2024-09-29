import { component$, useSignal, useTask$, useStyles$ } from '@builder.io/qwik';
import { LuSun, LuMoon } from '@qwikest/icons/lucide';

const styles = `
  .time-tracker {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 8px;
    font-size: 1.2rem;
    line-height: 1;
  }
  .time-tracker .icon {
    margin-right: 0px;
  }
`;

export default component$(() => {
  const currentTime = useSignal(new Date());
  const isDaytime = useSignal(true);

  useStyles$(styles); // Apply styles

  useTask$(() => {
    const timer = setInterval(() => {
      const now = new Date();
      currentTime.value = now;
      isDaytime.value = now.getHours() >= 6 && now.getHours() < 18;
    }, 1000);

    return () => clearInterval(timer);
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div class="time-tracker">
      <span class="icon">
        {isDaytime.value ? <LuSun class="icon" /> : <LuMoon class="icon" />}
      </span>
      <span class="time">{formatTime(currentTime.value)}</span>
    </div>
  );
});
