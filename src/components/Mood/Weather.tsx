import { component$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import { LuSun, LuCloud, LuCloudRain, LuCloudSnow } from '@qwikest/icons/lucide';

interface WeatherData {
  condition: string;
  temp_c: number;
}

const styles = `
  .weather {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 8px;
    font-size: 1.2rem;
    line-height: 1;
  }
  .weather .icon {
    margin-right: 0px;
  }
`;

export default component$(() => {
  const weather = useSignal<WeatherData | null>(null);
  
  useStyles$(styles); // Apply styles

  useTask$(async () => {
    try {
      const apiKey = '3d2a9d1b85284eada6e30427242709';
      const city = 'seattle'; // Replace with the desired city or use geolocation
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
      );
      const data = await response.json();
      weather.value = {
        condition: data.current.condition.text,
        temp_c: data.current.temp_c,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <LuSun class="icon" />;
      case 'partly cloudy':
      case 'cloudy':
      case 'overcast':
        return <LuCloud class="icon" />;
      case 'rain':
      case 'light rain':
      case 'moderate rain':
      case 'heavy rain':
        return <LuCloudRain class="icon" />;
      case 'snow':
      case 'light snow':
      case 'moderate snow':
      case 'heavy snow':
        return <LuCloudSnow class="icon" />;
      default:
        return <LuCloud class="icon" />;
    }
  };

  return (
    <div class="weather">
      {weather.value ? (
        <>
          <span class="icon">{getWeatherIcon(weather.value.condition)}</span>
          <span class="condition">{weather.value.condition} </span>
          <span class="temperature"> {Math.round(weather.value.temp_c)}°C</span>
        </>
      ) : (
        <span>Loading weather...</span>
      )}
    </div>
  );
});
