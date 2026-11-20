import { createContext, useContext } from "react";
import type { Dataset } from "../api/client";
import type { Units } from "../lib/units";

type AppData = { units: Units; datasets: Dataset[] };
export const AppContext = createContext<AppData | null>(null);
export function useAppContext(): AppData {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("Pages must be rendered inside the shared app layout");
  return context;
}