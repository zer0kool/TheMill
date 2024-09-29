import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';

// Function to get user's geolocation
function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => reject(error)
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}

// Function to get the zip code from the user's coordinates using Nominatim
async function getZipCodeFromCoordsNominatim(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

  const response = await fetch(url);
  const data = await response.json();

  // Check if postal code exists in the returned address
  return data.address.postcode || '';
}

// Qwik component to display the button if the user is in the same zip code
export const RestaurantButton = component$(() => {
  // Define the restaurant's zip code
  const restaurantZipCode = '98277'; // Example: Replace with your restaurant's actual zip code

  // Store to manage proximity, zip code, and error state
  const state = useStore({
    isWithinZipCode: false,
    userZipCode: '', // Cache the user's zip code here
    error: '',
    locationFetched: false, // Track if location has already been fetched
  });

  // Use a task to fetch user's location and compare zip codes
  useVisibleTask$(async () => {
    if (!state.locationFetched) {
      // Only fetch the location if it hasn't been fetched before
      try {
        const userLocation = await getUserLocation();
        const userZipCode = await getZipCodeFromCoordsNominatim(userLocation.lat, userLocation.lon);

        // Cache the user's zip code
        state.userZipCode = userZipCode;

        // Check if the user's zip code matches the restaurant's zip code
        state.isWithinZipCode = userZipCode === restaurantZipCode;
        state.locationFetched = true; // Mark location as fetched
      } catch (err) {
        state.error = 'Unable to determine your location or zip code.';
        state.locationFetched = true; // Prevent further API calls even in case of error
      }
    }
  });

  // Render the button if the user is within the same zip code, or display an error/message
  return (
    <>
      {state.isWithinZipCode ? (
        <button class="card-button" onClick$={() => alert('You are in the same zip code! Click to order!')}>
          Order Now!
        </button>
      ) : (
        <p>{state.error || 'You are not in the same zip code as the restaurant.'}</p>
      )}
    </>
  );
});
