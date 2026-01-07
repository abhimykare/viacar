import { useEffect, useState } from "react";

import VehicleSearch from "~/components/common/vehicle-search";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { api } from "~/lib/api";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Route } from "./+types/add-vehicles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface Vehicle {
  id: number;
  year: number;
  color: string;
  status: number;
  model: {
    id: number;
    name: string;
    category_id: number;
    category_name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface VehicleListResponse {
  commonData: any;
  data: {
    vehicles: Vehicle[];
    total: number;
  };
  message: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Add Vehicles" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setVehicleId } = useRideCreationStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [showVehicleSearch, setShowVehicleSearch] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: VehicleListResponse = await api.getVehicleList();
      setVehicles(response.data.vehicles);
    } catch (err) {
      setError("Failed to load vehicles");
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (value: string) => {
    setSelectedVehicleId(value);
  };

  const handleContinue = () => {
    if (selectedVehicleId) {
      setVehicleId(parseInt(selectedVehicleId));
      navigate("/pickup");
    }
  };

  const handleAddNewVehicle = () => {
    setShowVehicleSearch(true);
  };

  if (loading) {
    return (
      <div>
        <Header title={t("add_vehicles.title")} />
        <div className="max-w-[1379px] w-full mx-auto px-6 py-10 lg:py-[100px] min-h-[800px]">
          <div className="text-center">Loading vehicles...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title={t("add_vehicles.title")} />
        <div className="max-w-[1379px] w-full mx-auto px-6 py-10 lg:py-[100px] min-h-[800px]">
          <div className="text-center text-red-500">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header title={t("add_vehicles.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 py-10 lg:py-[100px] min-h-[800px]">
        <p className="text-3xl lg:text-[2.188rem] text-[#0A2033] text-center font-medium max-w-[478px] mx-auto leading-tight mb-6">
          {t("add_vehicles.title")}
        </p>

        {!showVehicleSearch && vehicles.length > 0 && (
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your vehicle
            </label>
            <Select
              value={selectedVehicleId}
              onValueChange={handleVehicleSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.brand.name} {vehicle.model.name} ({vehicle.year})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedVehicleId && (
              <Button
                onClick={handleContinue}
                className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
              >
                Continue with Selected Vehicle
              </Button>
            )}
          </div>
        )}

        {!showVehicleSearch && (
          <div className="text-center mb-8">
            <Button
              onClick={handleAddNewVehicle}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Add New Vehicle
            </Button>
          </div>
        )}

        {showVehicleSearch && (
          <VehicleSearch
            name="pickup"
            path="/dropoff"
            sectionName={t("add_vehicles.pickup.section_name")}
            sectionTitle={t("add_vehicles.pickup.section_title")}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
