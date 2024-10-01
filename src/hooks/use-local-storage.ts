"use client";

import { useCallback, useEffect, useState } from "react";

function getItemFromLocalStorage<T>(key: string): T | null {
  // FIXME: !!!!!!!!!
  if (typeof window === "undefined") return null;

  const item = window?.localStorage.getItem(key);
  if (item) return JSON.parse(item) as T;

  return null;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(
    (getItemFromLocalStorage(key) as T) ?? initialValue,
  );

  useEffect(() => {
    // Retrieve from localStorage
    const item = getItemFromLocalStorage(key);
    if (item !== null) setStoredValue(item as T);
  }, [key]);

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (value) => {
      if (value instanceof Function) {
        setStoredValue((prev: T) => {
          const newValue = value(prev);
          // Save to localStorage
          window.localStorage.setItem(key, JSON.stringify(newValue));
          return newValue;
        });
      } else {
        setStoredValue(value);
        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      return setStoredValue;
    },
    [key, setStoredValue],
  );

  return [storedValue, setValue];
}