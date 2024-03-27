import React, { createContext, useState } from 'react';

export type AppTab = 'folders' | 'commandLine' | 'notes' | 'todo' | 'git';

// Define the type for your context value
type AppStateValue = {
  // Add your context properties and methods here
  currentTab: AppTab;
  setCurrentTab: React.Dispatch<React.SetStateAction<AppTab>>;
};

// Create the initial context value
const initialContextValue: AppStateValue = {
  // Initialize your context properties and methods here
  currentTab: 'folders',
  setCurrentTab: () => {},
};

// Create the context
export const AppStateContext = createContext<AppStateValue>(initialContextValue);


// Define the props for the provider component
interface AppStateProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  // Define your state or any other logic here
  const [currentTab, setCurrentTab] = useState<AppTab>('folders');

  return (
    <AppStateContext.Provider value={{
      currentTab,
      setCurrentTab
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => React.useContext(AppStateContext);
