import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LocationData {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
  lat: number;
  lng: number;
}

export interface RideSearchFilters {
  // Sort options
  sortBy: string; // "earliest", "lowest", "closest_dep", "closest_arr", "shortest"

  // Stops filter
  stops: string; // "direct", "one", "two_plus"

  // Trust & Verification
  verifiedProfile: boolean;

  // Seating preferences
  max2: boolean;

  // Booking preferences
  instantBooking: boolean;

  // Amenities
  smoking: boolean;
  pets: boolean;
  power: boolean;
  ac: boolean;
  disability: boolean;

  // Car model preferences
  carModel: string; // "3", "5", "all"
}

interface RideSearchStore {
  filters: RideSearchFilters;

  // Location data
  leavingFrom: LocationData | null;
  goingTo: LocationData | null;
  passengers: number;
  date: string | null;

  // Search trigger
  searchTrigger: number;
  triggerSearch: () => void;

  // Location actions
  setLeavingFrom: (location: LocationData | null) => void;
  setGoingTo: (location: LocationData | null) => void;
  setPassengers: (passengers: number) => void;
  setDate: (date: string | null) => void;

  // Filter actions
  setSortBy: (sortBy: number) => void;
  setStopsFilter: (stopsFilter: string) => void;
  setVerifiedDriversOnly: (verified: boolean) => void;
  setMax2InBack: (max2InBack: boolean) => void;
  setInstantBooking: (instantBooking: boolean) => void;
  setSmokingAllowed: (smokingAllowed: boolean) => void;
  setPetsAllowed: (petsAllowed: boolean) => void;
  setPowerOutlets: (powerOutlets: boolean) => void;
  setAirConditioning: (airConditioning: boolean) => void;
  setAccessibleForDisabled: (accessible: boolean) => void;
  setCarModelYear: (carModelYear: string) => void;

  // Utility actions
  clearAllFilters: () => void;
  updateFilters: (partialFilters: Partial<RideSearchFilters>) => void;
  getActiveFiltersCount: () => number;
  getSearchPayload: () => any;
}

const initialFilters: RideSearchFilters = {
  sortBy: "earliest", // Default to earliest departure
  stops: "direct",
  verifiedProfile: false,
  max2: false,
  instantBooking: false,
  smoking: false,
  pets: false,
  power: false,
  ac: false,
  disability: false,
  carModel: "all",
};

const initialLocationData = {
  leavingFrom: null,
  goingTo: null,
  passengers: 1,
  date: null,
};

export const useRideSearchStore = create<RideSearchStore>()(
  persist<RideSearchStore>(
    (set, get) => ({
      filters: initialFilters,
      leavingFrom: initialLocationData.leavingFrom,
      goingTo: initialLocationData.goingTo,
      passengers: initialLocationData.passengers,
      date: initialLocationData.date,
      searchTrigger: 0,

      triggerSearch: () =>
        set((state) => {
          console.log("=== STORE DEBUG ===");
          console.log(
            "TriggerSearch called, current trigger:",
            state.searchTrigger
          );
          console.log("New trigger will be:", state.searchTrigger + 1);
          return { searchTrigger: state.searchTrigger + 1 };
        }),

      setLeavingFrom: (leavingFrom) =>
        set((state) => {
          const newState = { leavingFrom };
          // Only trigger search if we have all required data
          if (leavingFrom && state.goingTo && state.date) {
            setTimeout(() => get().triggerSearch(), 0);
          }
          return newState;
        }),
      setGoingTo: (goingTo) =>
        set((state) => {
          const newState = { goingTo };
          // Only trigger search if we have all required data
          if (state.leavingFrom && goingTo && state.date) {
            setTimeout(() => get().triggerSearch(), 0);
          }
          return newState;
        }),
      setPassengers: (passengers) =>
        set((state) => {
          const newState = { passengers };
          // Only trigger search if we have all required data
          if (state.leavingFrom && state.goingTo && state.date) {
            setTimeout(() => get().triggerSearch(), 0);
          }
          return newState;
        }),
      setDate: (date) =>
        set((state) => {
          const newState = { date };
          // Only trigger search if we have all required data
          if (state.leavingFrom && state.goingTo && date) {
            setTimeout(() => get().triggerSearch(), 0);
          }
          return newState;
        }),

      setSortBy: (sortBy) =>
        set((state) => {
          const newState = { filters: { ...state.filters, sortBy } };
          // Trigger search after state update
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setStopsFilter: (stops) =>
        set((state) => {
          const newState = { filters: { ...state.filters, stops } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setVerifiedDriversOnly: (verifiedProfile) =>
        set((state) => {
          const newState = { filters: { ...state.filters, verifiedProfile } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setMax2InBack: (max2) =>
        set((state) => {
          const newState = { filters: { ...state.filters, max2 } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setInstantBooking: (instantBooking) =>
        set((state) => {
          const newState = { filters: { ...state.filters, instantBooking } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setSmokingAllowed: (smoking) =>
        set((state) => {
          const newState = { filters: { ...state.filters, smoking } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setPetsAllowed: (pets) =>
        set((state) => {
          const newState = { filters: { ...state.filters, pets } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setPowerOutlets: (power) =>
        set((state) => {
          const newState = { filters: { ...state.filters, power } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setAirConditioning: (ac) =>
        set((state) => {
          const newState = { filters: { ...state.filters, ac } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setAccessibleForDisabled: (disability) =>
        set((state) => {
          const newState = { filters: { ...state.filters, disability } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      setCarModelYear: (carModel) =>
        set((state) => {
          const newState = { filters: { ...state.filters, carModel } };
          setTimeout(() => get().triggerSearch(), 0);
          return newState;
        }),

      clearAllFilters: () => set({ filters: initialFilters }),

      updateFilters: (partialFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...partialFilters },
        })),

      getActiveFiltersCount: () => {
        const filters = get().filters;
        let count = 0;

        if (filters.sortBy !== initialFilters.sortBy) count++;
        if (filters.stops !== initialFilters.stops) count++;
        if (filters.verifiedProfile !== initialFilters.verifiedProfile) count++;
        if (filters.max2 !== initialFilters.max2) count++;
        if (filters.instantBooking !== initialFilters.instantBooking) count++;
        if (filters.smoking !== initialFilters.smoking) count++;
        if (filters.pets !== initialFilters.pets) count++;
        if (filters.power !== initialFilters.power) count++;
        if (filters.ac !== initialFilters.ac) count++;
        if (filters.disability !== initialFilters.disability) count++;
        if (filters.carModel !== initialFilters.carModel) count++;

        return count;
      },

      getSearchPayload: () => {
        const state = get();
        console.log("=== STORE DEBUG ===");
        console.log("getSearchPayload called");
        console.log("leavingFrom:", state.leavingFrom);
        console.log("goingTo:", state.goingTo);
        console.log("date:", state.date);
        console.log("passengers:", state.passengers);

        // Validate required fields
        if (!state.leavingFrom || !state.goingTo || !state.date) {
          console.log("Validation failed - missing required fields");
          console.log("!state.leavingFrom:", !state.leavingFrom);
          console.log("!state.goingTo:", !state.goingTo);
          console.log("!state.date:", !state.date);
          return null;
        }

        console.log("Validation passed, returning payload");

        // Map store filter names to API field names
        const sortByMapping = {
          earliest: 1,
          lowest: 2,
          closest_dep: 3,
        closest_arr: 4,
          shortest: 5,
        };

        const stopsMapping = {
          direct: "direct",
          one: "one",
          two_plus: "two_plus",
        };

        const carModelMapping = {
          "3": "3_years",
          "5": "5_years",
          all: "all",
        };

        return {
          user_lat: state.leavingFrom.lat,
          user_lng: state.leavingFrom.lng,
          destination_lat: state.goingTo.lat,
          destination_lng: state.goingTo.lng,
          date: state.date,
          passengers: state.passengers,
          max_walking_distance_km: 5,
          sort_by:
            sortByMapping[state.filters.sortBy as keyof typeof sortByMapping] ||
            1,
          stops_filter:
            stopsMapping[state.filters.stops as keyof typeof stopsMapping] ||
            "",
          verified_drivers_only: state.filters.verifiedProfile,
          max_2_in_back: state.filters.max2,
          instant_booking: state.filters.instantBooking,
          smoking_allowed: state.filters.smoking,
          pets_allowed: state.filters.pets,
          power_outlets: state.filters.power,
          air_conditioning: state.filters.ac,
          accessible_for_disabled: state.filters.disability,
          car_model_year:
            carModelMapping[
              state.filters.carModel as keyof typeof carModelMapping
            ] || "all",
        };
      },
    }),
    {
      name: "ride-search-filters",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
