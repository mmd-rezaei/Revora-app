import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Car } from "@/types";

type CompareState = {
  cars: Car[];
  addCar: (car: Car) => void;
  removeCar: (id: string) => void;
  clear: () => void;
  hasCar: (id: string) => boolean;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      cars: [],
      addCar: (car) => {
        const current = get().cars;
        if (current.some((item) => item.id === car.id) || current.length >= 3) return;
        set({ cars: [...current, car] });
      },
      removeCar: (id) => set({ cars: get().cars.filter((car) => car.id !== id) }),
      clear: () => set({ cars: [] }),
      hasCar: (id) => get().cars.some((car) => car.id === id),
    }),
    { name: "revora-compare" },
  ),
);
