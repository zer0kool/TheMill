// Define the type for the configuration
export type AppConfig = {
    Header: boolean;
    Footer: boolean;
    AIComponent: boolean;
    Menu: boolean;
  };
  
  // Default app configuration
  export const appConfig: AppConfig = {
    Header: true,
    Footer: true,
    AIComponent: true,
    Menu: true,
  };
  