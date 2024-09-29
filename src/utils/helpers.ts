import type { AppConfig } from '../config/appConfig';

/**
 * Configuration settings for the application.
 * 
 * @constant {Object} config - Contains application configuration settings.
 * @property {boolean} devMode - Indicates if the application is in development mode.
 * @property {Object} mockTime - Mock time settings for testing.
 * @property {number} mockTime.hour - Hour for mock time.
 * @property {number} mockTime.minutes - Minutes for mock time.
 */
const config = {
    devMode: false, // Set to true for development mode
    mockTime: { hour: 12, minutes: 0 } // Mock time for testing (2 PM)
};

/**
 * Loads the route configuration based on the provided pathname.
 * 
 * @param {string} pathname - The pathname of the route to load the configuration for.
 * @returns {Promise<Partial<AppConfig>>} - A promise that resolves to the route configuration.
 * 
 * @example
 * const routeConfig = await loadRouteConfig('/about');
 */
export const loadRouteConfig = async (pathname: string): Promise<Partial<AppConfig>> => {
  console.log('Loading route config for:', pathname); // Debugging
  if (pathname === '/') {
    console.log('No specific route config for root path'); // Debugging
    return {};
  }

  try {
    const routeConfigModule = await import(/* @vite-ignore */ `../routes${pathname}/config`);
    return routeConfigModule.default || {};
  } catch (error) {
    console.error('Error loading route config:', error); // Debugging
    return {};
  }
};

/**
 * Merges the global configuration with the route-specific configuration.
 * 
 * @param {AppConfig} globalConfig - The global application configuration.
 * @param {Partial<AppConfig>} routeConfig - The route-specific configuration to merge.
 * @returns {AppConfig} - The merged configuration.
 * 
 * @example
 * const mergedConfig = mergeConfig(globalConfig, routeConfig);
 */
export const mergeConfig = (globalConfig: AppConfig, routeConfig: Partial<AppConfig>): AppConfig => {
  const mergedConfig = { ...globalConfig, ...routeConfig };
  console.log('Page Config:', mergedConfig); // Debugging
  return mergedConfig;
};

/**
 * Gets the current daytime based on the time of day.
 * 
 * @returns {string} - Returns "breakfast", "lunch", or "dinner" based on the current time.
 * 
 * @example
 * const mealTime = getCurrentDaytime();
 */
export const getCurrentDaytime = (): string => {
    if (config.devMode) {
        // Use mock time if in dev mode
        const { hour, minutes } = config.mockTime;
        return (hour < 12 || (hour === 11 && minutes <= 30)) 
            ? "breakfast" 
            : (hour < 17) 
                ? "lunch" 
                : "dinner";
    }

    // Get the actual current time
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    return (currentHour < 12 || (currentHour === 11 && currentMinutes <= 30)) 
        ? "breakfast" 
        : (currentHour < 17) 
            ? "lunch" 
            : "dinner";
};