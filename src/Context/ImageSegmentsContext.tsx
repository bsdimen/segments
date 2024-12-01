import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

import { ImageSegments } from "../Thumbnail/SegmentsFeautre";

// Define the shape of the context value
interface ImageSegmentsContextType {
  segments: ImageSegments[];
  setSegments: Dispatch<SetStateAction<ImageSegments[]>>;
}

// Create the context with an undefined initial value
export const ImageSegmentsContext = createContext<ImageSegmentsContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
  initialValue: ImageSegments[];
}

// Create a provider component
export const ImageSegmentsProvider: React.FC<ProviderProps> = ({ children, initialValue }) => {
  const [segments, setSegments] = useState<ImageSegments[]>(initialValue);

  return (
    <ImageSegmentsContext.Provider value={{ segments, setSegments }}>
      {children}
    </ImageSegmentsContext.Provider>
  );
};

// Custom hook to access the context
export const useImageSegments = () => {
  const context = useContext(ImageSegmentsContext);
  if (!context) {
    throw new Error("useImageSegments must be used within an ImageSegmentsProvider");
  }

  return context;
};


