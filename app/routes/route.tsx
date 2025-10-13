import { useState, useEffect, useRef } from "react";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/route";
import { Label } from "~/components/ui/label";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "~/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router";

import { useTranslation } from "react-i18next";
import { api } from "~/lib/api";
import { GoogleMapService } from "~/lib/googlemap";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

const CheckIcon = () => (
  <img
    src="/assets/check-green.svg"
    alt="Check Icon"
    className="absolute inset-0 m-auto size-[33px] hidden group-data-[state=checked]:block"
  />
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Select Route" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pickupLocation = useRideCreationStore((state) => state.rideData.pickup);
  const dropoffLocation = useRideCreationStore(
    (state) => state.rideData.dropoff
  );

  console.log(
    pickupLocation,
    dropoffLocation,
    "pickupLocation, dropoffLocation"
  );

  // Debug: Check the entire store state
  const rideData = useRideCreationStore((state) => state.rideData);
  console.log("Full store state:", rideData);

  // Debug: Check localStorage directly
  useEffect(() => {
    const storedData = localStorage.getItem("ride-creation-storage");
    console.log("Raw localStorage data:", storedData);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        console.log("Parsed localStorage data:", parsed);
        console.log(
          "Pickup from localStorage:",
          parsed.state?.rideData?.pickup
        );
        console.log(
          "Dropoff from localStorage:",
          parsed.state?.rideData?.dropoff
        );
      } catch (e) {
        console.error("Failed to parse localStorage data:", e);
      }
    }
  }, []);

  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapServiceRef = useRef<GoogleMapService | null>(null);

  // Get coordinates from store
  const pickupLat = pickupLocation?.lat || 0;
  const pickupLng = pickupLocation?.lng || 0;
  const dropoffLat = dropoffLocation?.lat || 0;
  const dropoffLng = dropoffLocation?.lng || 0;

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getRoutes({
          pickup_lat: pickupLat,
          pickup_lng: pickupLng,
          dropoff_lat: dropoffLat,
          dropoff_lng: dropoffLng,
        });

        console.log("API Response:", response);

        if (response.data?.routes && Array.isArray(response.data.routes)) {
          const formattedRoutes = response.data.routes.map((route) => {
            // Extract polyline from different possible structures
            let polyline = "";
            if (route.overview_polyline && route.overview_polyline.points) {
              polyline = route.overview_polyline.points;
            } else if (route.polyline) {
              polyline = route.polyline;
            } else if (route.encoded_polyline) {
              polyline = route.encoded_polyline;
            }

            return {
              id: route.route_index?.toString() || "0",
              duration: Math.floor(route.duration_minutes / 60), // hours
              minutes: route.duration_minutes % 60, // remaining minutes
              distance: route.distance_km,
              road: route.route_description || "Route",
              polyline: polyline,
              isRecommended: route.is_recommended,
              durationText: route.duration_text,
              distanceText: route.distance_text,
              durationInTraffic: route.duration_in_traffic_text,
            };
          });

          console.log("Formatted Routes:", formattedRoutes);
          setRoutes(formattedRoutes);

          // Set default to recommended route or first route
          const recommendedRoute = formattedRoutes.find((r) => r.isRecommended);
          setSelectedRouteId(recommendedRoute?.id || "0");
        } else {
          setError("No routes found");
        }
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError(err.message || "Failed to load routes");
      } finally {
        setLoading(false);
      }
    };

    if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
      fetchRoutes();
    } else {
      setLoading(false);
      setError("Missing pickup or dropoff coordinates in store");
    }
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng]);

  const handleContinue = () => {
    const selectedRoute = routes.find((route) => route.id === selectedRouteId);
    if (selectedRoute) {
      // Store the selected route's polyline in the store
      const rideCreationStore = useRideCreationStore.getState();
      rideCreationStore.setSelectedRoutePolyline(selectedRoute.polyline);

      // Navigate to stopovers page
      navigate("/stopovers", {
        state: location.state,
      });
    }
  };

  // Initialize map and display routes
  useEffect(() => {
    if (!mapContainerRef.current || !routes.length || loading) return;

    // Initialize map service
    if (!mapServiceRef.current) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key not found in environment variables");
        return;
      }
      mapServiceRef.current = new GoogleMapService(apiKey);
    }

    const initializeRouteMap = async () => {
      try {
        // Create map centered between pickup and dropoff
        const centerLat = (pickupLat + dropoffLat) / 2;
        const centerLng = (pickupLng + dropoffLng) / 2;

        // Initialize the map using the correct method
        await mapServiceRef.current?.initializeMap({
          startCoordinates: { lat: pickupLat, lng: pickupLng },
          endCoordinates: { lat: dropoffLat, lng: dropoffLng },
          mapContainerId: "route-map",
          height: "500px",
        });

        // Display all route polylines
        routes.forEach((route, index) => {
          if (route.polyline) {
            const isSelected = route.id === selectedRouteId;
            const color = isSelected ? "#FF4848" : "#666666"; // Red for selected, gray for others
            const strokeWeight = isSelected ? 6 : 3;

            mapServiceRef.current?.displayRoute(
              route.polyline,
              color,
              strokeWeight,
              route.id
            );
          }
        });
      } catch (error) {
        console.error("Failed to initialize route map:", error);
      }
    };

    initializeRouteMap();

    // Cleanup function
    return () => {
      if (mapServiceRef.current) {
        mapServiceRef.current.destroy();
      }
    };
  }, [routes, loading]);

  // Update route highlighting when selection changes
  useEffect(() => {
    if (!mapServiceRef.current || !routes.length) return;

    // Update route colors based on selection
    routes.forEach((route) => {
      if (route.polyline) {
        const isSelected = route.id === selectedRouteId;
        const color = isSelected ? "#FF4848" : "#666666";
        const strokeWeight = isSelected ? 6 : 3;

        // Remove and re-add route with new styling
        mapServiceRef.current?.removeRoute(route.id);
        mapServiceRef.current?.displayRoute(
          route.polyline,
          color,
          strokeWeight,
          route.id
        );
      }
    });
  }, [selectedRouteId, routes]);

  if (loading) {
    return (
      <div>
        <Header title={t("route.title")} />
        <div className="max-w-[1379px] w-full mx-auto px-6 pt-[80px] pb-[100px]">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-600">
              {t("common.loading") || "Loading routes..."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title={t("route.title")} />
        <div className="max-w-[1379px] w-full mx-auto px-6 pt-[80px] pb-[100px]">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-lg text-red-600">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {t("common.retry") || "Retry"}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!routes.length) {
    return (
      <div>
        <Header title={t("route.title")} />
        <div className="max-w-[1379px] w-full mx-auto px-6 pt-[80px] pb-[100px]">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-lg text-gray-600">No routes available</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header title={t("route.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-7 pt-[80px] pb-[100px]">
        <div className="border border-[#EBEBEB] rounded-2xl px-8 py-6 flex flex-col gap-7">
          <p className="text-2xl lg:text-[2.188rem]">
            {t("route.header_title") || "Select your route"}
          </p>
          <RadioGroup.Root
            value={selectedRouteId}
            onValueChange={setSelectedRouteId}
            className="flex flex-col gap-4"
          >
            {routes.map(
              ({
                id,
                duration,
                minutes,
                distance,
                road,
                durationText,
                distanceText,
                isRecommended,
                durationInTraffic,
              }) => (
                <RadioGroup.Item key={id} value={id} id={id} asChild>
                  <div className="group border border-[#EBEBEB] px-6 py-4 rounded-2xl bg-white flex items-center justify-between data-[state=checked]:border-[#69D2A5] data-[state=checked]:bg-[#F1FFF9] cursor-pointer relative">
                    {isRecommended && (
                      <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Recommended
                      </span>
                    )}
                    <Label
                      htmlFor={id}
                      className="flex flex-col items-start gap-1 cursor-pointer flex-1"
                    >
                      <span className="text-base font-normal">
                        {durationText}
                        {durationInTraffic &&
                          durationInTraffic !== durationText && (
                            <span className="text-sm text-orange-600 ml-2">
                              ({durationInTraffic} in traffic)
                            </span>
                          )}
                      </span>
                      <span className="text-sm font-normal text-[#999999]">
                        {distanceText} · {road}
                      </span>
                    </Label>
                    <div className="ml-2 size-[25px] lg:size-[33px] aspect-square relative border border-gray-300 rounded-full flex items-center justify-center group-data-[state=checked]:border-transparent flex-shrink-0">
                      <CheckIcon />
                    </div>
                  </div>
                </RadioGroup.Item>
              )
            )}
          </RadioGroup.Root>
          <div className="flex items-center justify-center pt-5">
            <Button
              className="bg-[#FF4848] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal"
              onClick={handleContinue}
              disabled={!routes.length}
            >
              {t("route.continue") || "Continue"}
            </Button>
          </div>
        </div>
        <div className="rounded-2xl decoration-0 overflow-hidden w-full h-full">
          <div
            id="route-map"
            ref={mapContainerRef}
            className="w-full h-full rounded-2xl border border-gray-200"
            style={{ minHeight: "500px" }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
