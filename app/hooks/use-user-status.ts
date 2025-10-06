import { useState, useEffect } from "react";
import { api } from "~/lib/api";

interface UserStatus {
  id_verification: {
    completed: boolean;
    status: string;
    submitted_at: string | null;
    verified_at: string | null;
  };
  account: {
    is_verified: number;
    is_driver: number;
    is_ride_publishable: number;
    status: string;
  };
  bank_details: {
    has_bank_details: boolean;
    count: number;
  };
  vehicles: {
    has_vehicles: boolean;
    count: number;
  };
}

interface UseUserStatusResult {
  userStatus: UserStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserStatus = (): UseUserStatusResult => {
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  const refetch = () => setRefreshIndex((prev) => prev + 1);

  useEffect(() => {
    const fetchUserStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getUserStatus();
        if (response && response.data) {
          setUserStatus(response.data);
        } else {
          setError("Failed to fetch user status: No data received");
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
        console.error("Error fetching user status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, [refreshIndex]);

  return { userStatus, loading, error, refetch };
};