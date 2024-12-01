import React, { createContext, useContext, useState, ReactNode } from 'react';

type ComponentState = {
  currentState: 'initial' | 'editing' | 'completed';
  isLoading: boolean;
};

type ComponentStateContextType = {
  state: ComponentState;
  setCurrentState: (newState: 'initial' | 'editing' | 'completed') => void;
  setIsLoading: (loading: boolean) => void;
};

const ComponentStateContext = createContext<ComponentStateContextType | undefined>(undefined);

export const ComponentStateProvider = ({ children }: { children: ReactNode }) => {
  const [currentState, setCurrentState] = useState<'initial' | 'editing' | 'completed'>('initial');
  const [isLoading, setIsLoading] = useState(false);

  const state: ComponentState = {
    currentState,
    isLoading,
  };

  return (
    <ComponentStateContext.Provider value={{ state, setCurrentState, setIsLoading }}>
      {children}
    </ComponentStateContext.Provider>
  );
};

export const useComponentState = () => {
  const context = useContext(ComponentStateContext);
  if (!context) {
    throw new Error('useComponentState must be used within a ComponentStateProvider');
  }
  return context;
};
