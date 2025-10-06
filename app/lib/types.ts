export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Transaction {
  id: string;
  user: User;
  date: string;
  from: string;
  to: string;
  status: "Completed" | "Pending" | "Cancelled";
  amount: string;
  image: string;
}

export interface RoutesPayload {
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
}

export interface RouteResponse {
  success: boolean;
  message: string;
  data: {
    routes: {
      duration_text: string;
      distance_text: string;
      route_description: string;
      polyline: string;
      overview_polyline: {
        points: string;
      };
      legs: {
        distance: {
          text: string;
          value: number;
        };
        duration: {
          text: string;
          value: number;
        };
      }[];
    }[];
  };
}

export interface PaymentRefund {
  id: string;
  user: User;
  date: string;
  from: string;
  to: string;
  status: "Completed" | "Pending" | "Cancelled";
  amount: string;
  image: string;
}
