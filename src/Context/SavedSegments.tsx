import React, { createContext, useContext, ReactNode } from "react";
import { ImageSegments } from "../SegmentsFeautre";

export const SavedSegmentsContext = createContext<ImageSegments[] | undefined>(undefined);

export const useSavedSegments = () => {
  const context = useContext(SavedSegmentsContext);
  if (!context) {
    throw new Error("useSavedSegments must be used within an SavedSegmentsProvider");
  }

  return context;
};
