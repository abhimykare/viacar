import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface RideSearchFilters {
  // Sort options
  sort_by?: number; // 1: Earliest departure, 2: Lowest price, 3: Close to departure, 4: Close to arrival, 5: Shortest ride
  
  // Stops filter
  stops_filter?: string; // "direct_only", "one_stop", "two_plus_stops"
  
  // Trust & Verification
  verified_drivers_only?: boolean;
  
  // Seating preferences
  max_2_in_back?: boolean;
  
  // Booking preferences
  instant_booking?: boolean;
  
  // Amenities
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  power_outlets?: boolean;
  air_conditioning?: boolean;
  accessible_for_disabled?: boolean;
  
  // Car model preferences
  car_model_year?: string; // "Last 3 years", "Last 5 years", "All"
}

interface RideSearchStore {
  filters: RideSearchFilters;
  
  // Search trigger
  searchTrigger: number;
  triggerSearch: () => void;
  
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
}

const initialFilters: RideSearchFilters = {
  sort_by: 1, // Default to earliest departure
  stops_filter: "direct_only",
  verified_drivers_only: false,
  max_2_in_back: false,
  instant_booking: false,
  smoking_allowed: false,
  pets_allowed: false,
  power_outlets: false,
  air_conditioning: false,
  accessible_for_disabled: false,
  car_model_year: "All",
};

export const useRideSearchStore = create<RideSearchStore>()(
  persist<RideSearchStore>(
    (set, get) => ({
      filters: initialFilters,
      searchTrigger: 0,
      
      triggerSearch: () => set((state) => {
        console.log("=== STORE DEBUG ===");
        console.log("TriggerSearch called, current trigger:", state.searchTrigger);
        console.log("New trigger will be:", state.searchTrigger + 1);
        return { searchTrigger: state.searchTrigger + 1 };
      }),
      
      setSortBy: (sort_by) => set((state) => ({
        filters: { ...state.filters, sort_by }
      })),
      
      setStopsFilter: (stops_filter) => set((state) => ({
        filters: { ...state.filters, stops_filter }
      })),
      
      setVerifiedDriversOnly: (verified_drivers_only) => set((state) => ({
        filters: { ...state.filters, verified_drivers_only }
      })),
      
      setMax2InBack: (max_2_in_back) => set((state) => ({
        filters: { ...state.filters, max_2_in_back }
      })),
      
      setInstantBooking: (instant_booking) => set((state) => ({
        filters: { ...state.filters, instant_booking }
      })),
      
      setSmokingAllowed: (smoking_allowed) => set((state) => ({
        filters: { ...state.filters, smoking_allowed }
      })),
      
      setPetsAllowed: (pets_allowed) => set((state) => ({
        filters: { ...state.filters, pets_allowed }
      })),
      
      setPowerOutlets: (power_outlets) => set((state) => ({
        filters: { ...state.filters, power_outlets }
      })),
      
      setAirConditioning: (air_conditioning) => set((state) => ({
        filters: { ...state.filters, air_conditioning }
      })),
      
      setAccessibleForDisabled: (accessible_for_disabled) => set((state) => ({
        filters: { ...state.filters, accessible_for_disabled }
      })),
      
      setCarModelYear: (car_model_year) => set((state) => ({
        filters: { ...state.filters, car_model_year }
      })),
      
      clearAllFilters: () => set({ filters: initialFilters }),
      
      updateFilters: (partialFilters) => set((state) => ({
        filters: { ...state.filters, ...partialFilters }
      })),
      
      getActiveFiltersCount: () => {
        const filters = get().filters;
        let count = 0;
        
        if (filters.sort_by !== initialFilters.sort_by) count++;
        if (filters.stops_filter !== initialFilters.stops_filter) count++;
        if (filters.verified_drivers_only !== initialFilters.verified_drivers_only) count++;
        if (filters.max_2_in_back !== initialFilters.max_2_in_back) count++;
        if (filters.instant_booking !== initialFilters.instant_booking) count++;
        if (filters.smoking_allowed !== initialFilters.smoking_allowed) count++;
        if (filters.pets_allowed !== initialFilters.pets_allowed) count++;
        if (filters.power_outlets !== initialFilters.power_outlets) count++;
        if (filters.air_conditioning !== initialFilters.air_conditioning) count++;
        if (filters.accessible_for_disabled !== initialFilters.accessible_for_disabled) count++;
        if (filters.car_model_year !== initialFilters.car_model_year) count++;
        
        return count;
      },
    }),
    {
      name: "ride-search-filters",
      storage: createJSONStorage(() => localStorage),
    }
  )
);