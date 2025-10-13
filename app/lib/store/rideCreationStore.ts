import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
}

interface StopData {
  placeId: string;
  lat: number;
  lng: number;
  address: string;
  order?: number;
  time?: string;
}

interface PriceData {
  pickup_order: number;
  drop_order: number;
  amount: number;
}

interface RideCreationData {
  // Pickup location
  pickup?: LocationData;
  
  // Dropoff location
  dropoff?: LocationData;
  
  // Route information
  ride_route?: string;
  
  // Selected route polyline
  selected_route_polyline?: string;
  
  // Date and time
  departure_date?: string; // YYYY-MM-DD format
  departure_time?: string; // HH:MM format
  drop_time?: string; // HH:MM format
  
  // Passenger information
  available_seats?: number;
  max_2_in_back?: boolean;
  
  // Pricing
  price_per_seat?: number;
  prices?: PriceData[];
  
  // Stops
  stops?: StopData[];
  
  // Additional options
  notes?: string;
  
  // Vehicle information
  vehicle_id?: number;
  
  // Return ride flag
  is_return?: boolean;
}

interface RideCreationStore {
  rideData: RideCreationData;
  
  // Pickup actions
  setPickup: (pickup: LocationData) => void;
  
  // Dropoff actions
  setDropoff: (dropoff: LocationData) => void;
  
  // Route actions
  setRideRoute: (route: string) => void;
  setSelectedRoutePolyline: (polyline: string) => void;
  
  // Date and time actions
  setDepartureDate: (date: string) => void;
  setDepartureTime: (time: string) => void;
  setDropTime: (time: string) => void;
  
  // Passenger actions
  setAvailableSeats: (seats: number) => void;
  setMax2InBack: (max2InBack: boolean) => void;
  
  // Pricing actions
  setPricePerSeat: (price: number) => void;
  setPrices: (prices: PriceData[]) => void;
  
  // Stops actions
  setStops: (stops: StopData[]) => void;
  addStop: (stop: StopData) => void;
  removeStop: (placeId: string) => void;
  updateStopOrder: (stops: StopData[]) => void;
  
  // Additional options
  setNotes: (notes: string) => void;
  
  // Vehicle actions
  setVehicleId: (vehicleId: number) => void;
  
  // Return ride actions
  setIsReturn: (isReturn: boolean) => void;
  
  // Utility actions
  clearRideData: () => void;
  updateRideData: (partialData: Partial<RideCreationData>) => void;
}

const initialRideData: RideCreationData = {
  pickup: undefined,
  dropoff: undefined,
  ride_route: "",
  selected_route_polyline: undefined,
  departure_date: undefined,
  departure_time: undefined,
  drop_time: undefined,
  available_seats: 1,
  max_2_in_back: false,
  price_per_seat: 3000,
  prices: [],
  stops: [],
  notes: "",
  vehicle_id: 1,
  is_return: false,
};

export const useRideCreationStore = create<RideCreationStore>()(
  persist<RideCreationStore>(
    (set, get) => ({
      rideData: initialRideData,
      
      setPickup: (pickup) => set((state) => ({
        rideData: { ...state.rideData, pickup }
      })),
      
      setDropoff: (dropoff) => set((state) => ({
        rideData: { ...state.rideData, dropoff }
      })),
      
      setRideRoute: (ride_route) => set((state) => ({
        rideData: { ...state.rideData, ride_route }
      })),
      
      setSelectedRoutePolyline: (selected_route_polyline) => set((state) => ({
        rideData: { ...state.rideData, selected_route_polyline }
      })),
      
      setDepartureDate: (departure_date) => {
        console.log("setDepartureDate called with:", departure_date);
        set((state) => {
          console.log("Setting departure_date from:", state.rideData.departure_date, "to:", departure_date);
          return {
            rideData: { ...state.rideData, departure_date }
          };
        });
        // Debug: Check localStorage after setting
        setTimeout(() => {
          const stored = localStorage.getItem('ride-creation-storage');
          console.log("localStorage after setDepartureDate:", stored);
        }, 100);
      },
      
      setDepartureTime: (departure_time) => set((state) => ({
        rideData: { ...state.rideData, departure_time }
      })),
      
      setDropTime: (drop_time) => set((state) => ({
        rideData: { ...state.rideData, drop_time }
      })),
      
      setAvailableSeats: (available_seats) => set((state) => ({
        rideData: { ...state.rideData, available_seats }
      })),
      
      setMax2InBack: (max_2_in_back) => set((state) => ({
        rideData: { ...state.rideData, max_2_in_back }
      })),
      
      setPricePerSeat: (price_per_seat) => set((state) => ({
        rideData: { ...state.rideData, price_per_seat }
      })),
      
      setPrices: (prices) => set((state) => ({
        rideData: { ...state.rideData, prices }
      })),
      
      setStops: (stops) => set((state) => ({
        rideData: { ...state.rideData, stops }
      })),
      
      addStop: (stop) => set((state) => ({
        rideData: { 
          ...state.rideData, 
          stops: [...(state.rideData.stops || []), stop] 
        }
      })),
      
      removeStop: (placeId) => set((state) => ({
        rideData: { 
          ...state.rideData, 
          stops: state.rideData.stops?.filter((stop) => stop.placeId !== placeId) || []
        }
      })),
      
      updateStopOrder: (stops) => set((state) => ({
        rideData: { 
          ...state.rideData, 
          stops: stops.map((stop, index) => ({ ...stop, order: index + 1 }))
        }
      })),
      
      setNotes: (notes) => set((state) => ({
        rideData: { ...state.rideData, notes }
      })),
      
      setVehicleId: (vehicle_id) => set((state) => ({
        rideData: { ...state.rideData, vehicle_id }
      })),
      
      setIsReturn: (is_return) => set((state) => ({
        rideData: { ...state.rideData, is_return }
      })),
      
      clearRideData: () => set({ rideData: initialRideData }),
      
      updateRideData: (partialData) => set((state) => ({
        rideData: { ...state.rideData, ...partialData }
      })),
    }),
    {
      name: "ride-creation-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);