import { useState, useEffect } from "react";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { Label } from "~/components/ui/label";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Button } from "~/components/ui/button";
import { Link, useLocation } from "react-router";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import CitySearch from "~/components/common/city-search";
import type { Route } from "./+types/stopovers";
import { useTranslation } from "react-i18next";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";
import { api } from "~/lib/api";

interface PopularPlace {
  place_id?: string;
  name?: string;
  mainText?: string;
  secondaryText?: string;
  address?: string;
  formatted_address?: string;
  lat: number;
  lng: number;
  types?: string[];
  rating?: number;
  rating_count?: number;
}

interface CityStop {
  id: string;
  title: string;
  defaultChecked?: boolean;
  placeId: string;
  lat: number;
  lng: number;
  address: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Stopovers" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const [cities, setCities] = useState<CityStop[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const addStop = useRideCreationStore((state) => state.addStop);
  const removeStop = useRideCreationStore((state) => state.removeStop);
  const setStops = useRideCreationStore((state) => state.setStops);
  const stops = useRideCreationStore((state) => state.rideData.stops);
  const pickup = useRideCreationStore((state) => state.rideData.pickup);
  const dropoff = useRideCreationStore((state) => state.rideData.dropoff);
  const selectedRoutePolyline = useRideCreationStore(
    (state) => state.rideData.selected_route_polyline
  );

  // Fetch popular places when component mounts
  useEffect(() => {
    const fetchPopularPlaces = async () => {
      setIsLoading(true);

      if (pickup && dropoff) {
        try {
          let encodedPolyline = selectedRoutePolyline || "";

          if (!encodedPolyline) {
            const routeResponse = await api.getRoutes({
              pickup_lat: pickup.lat,
              pickup_lng: pickup.lng,
              dropoff_lat: dropoff.lat,
              dropoff_lng: dropoff.lng,
            });

            if (
              routeResponse.success &&
              routeResponse.data &&
              routeResponse.data.routes &&
              routeResponse.data.routes.length > 0
            ) {
              // Check for polyline in different possible locations
              const firstRoute = routeResponse.data.routes[0];
              // Extract polyline from different possible structures
              if (
                firstRoute.overview_polyline &&
                firstRoute.overview_polyline.points
              ) {
                encodedPolyline = firstRoute.overview_polyline.points;
              } else if (firstRoute.polyline) {
                encodedPolyline = firstRoute.polyline;
              } else if (firstRoute.encoded_polyline) {
                encodedPolyline = firstRoute.encoded_polyline;
              }
            }
          }

          // If we don't have a polyline, we can't call getPopularPlaces
          if (!encodedPolyline) {
            setCities([]);
            setIsLoading(false);
            return;
          }

          // Get popular places along the route with the polyline
          const response = await api.getPopularPlaces({
            pickup_lat: pickup.lat,
            pickup_lng: pickup.lng,
            dropoff_lat: dropoff.lat,
            dropoff_lng: dropoff.lng,
            encoded_polyline: encodedPolyline,
            type: "city",
          });

          console.log("Full API Response:", response);
          console.log("Response.data:", response.data);
          console.log("Response.data.places:", response.data?.places);
          console.log("Places length:", response.data?.places?.length);
          console.log("Response structure check:", {
            hasSuccess: "success" in response,
            successValue: response.success,
            hasData: !!response.data,
            hasPlaces: !!response.data?.places,
            placesIsArray: Array.isArray(response.data?.places),
            placesLength: response.data?.places?.length,
          });

          const places = response.data?.places || response.places;

          if (places && Array.isArray(places) && places.length > 0) {
            const popularCities = response.data.places.map(
              (place: PopularPlace, index: number) => {
                const placeId = place.place_id || `${place.lat}-${place.lng}`;

                return {
                  id: placeId,
                  title: place.mainText || place.name || "",
                  placeId: placeId,
                  lat: place.lat,
                  lng: place.lng,
                  address:
                    place.secondaryText ||
                    place.formatted_address ||
                    place.address ||
                    "",
                  defaultChecked: index < 2,
                };
              }
            );

            console.log("Mapped popularCities:", popularCities);
            setCities(popularCities);

            const initialStops = popularCities
              .slice(0, 2)
              .map((city: CityStop, index: number) => ({
                placeId: city.placeId,
                lat: city.lat,
                lng: city.lng,
                address: city.address,
                order: index + 1,
              }));
            setStops(initialStops);
          } else {
            console.log("No places found or invalid response structure");
            console.log("response.success:", response.success);
            console.log("response.data exists:", !!response.data);
            console.log(
              "response.data.places exists:",
              !!response.data?.places
            );
            console.log(
              "response.data.places.length:",
              response.data?.places?.length
            );
            setCities([]);
          }
        } catch (error) {
          console.error("Failed to fetch popular places:", error);
          setCities([]);
        }
      } else {
        setCities([]);
      }
      setIsLoading(false);
    };

    fetchPopularPlaces();
  }, [pickup, dropoff, selectedRoutePolyline, setStops]);

  // Sync local cities state with store stops
  useEffect(() => {
    if (stops && stops.length > 0 && cities.length > 0) {
      const updatedCities = cities.map((city) => ({
        ...city,
        defaultChecked: stops.some((stop) => stop.placeId === city.placeId),
      }));
      setCities(updatedCities);
    }
  }, [stops]);

  // Empty state - no hardcoded data, only dynamic API results

  const handleAddCity = (cityData: any) => {
    // Only add if the city is not already in the list
    const exists = cities.some((c) => c.placeId === cityData.placeId);
    if (!exists) {
      const newCity = {
        id: cityData.placeId,
        title: cityData.name,
        placeId: cityData.placeId,
        lat: cityData.lat || 0,
        lng: cityData.lng || 0,
        address: cityData.address,
        defaultChecked: true, // Auto-check the newly added city
      };
      setCities((prev) => [...prev, newCity]);

      // Also add to stops list
      addStop({
        placeId: cityData.placeId,
        lat: cityData.lat || 0,
        lng: cityData.lng || 0,
        address: cityData.address,
        order: stops ? stops.length + 1 : 1,
      });
    }
    setDialogOpen(false);
  };

  const handleCityToggle = (
    cityId: string,
    cityTitle: string,
    checked: boolean,
    cityData: CityStop
  ) => {
    if (checked) {
      addStop({
        placeId: cityData.placeId,
        lat: cityData.lat,
        lng: cityData.lng,
        address: cityData.address,
        order: stops ? stops.length + 1 : 1,
      });
    } else {
      removeStop(cityData.placeId);
    }
  };

  return (
    <div>
      <Header title={t("stopovers.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 pt-8 lg:pt-[80px] pb-10 lg:pb-[100px] flex flex-col gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center">
          {t("stopovers.header_title")}
        </p>
        <div className="flex flex-col max-w-[430px] w-full mx-auto divide-y divide-[#EBEBEB]">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              {t("stopovers.loading_cities")}
            </div>
          ) : cities.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500 mb-4">
                {t("stopovers.no_cities_available")}
              </p>
              {!pickup || !dropoff ? (
                <Button
                  className="bg-[#FF4848] rounded-full w-full md:w-[208px] h-[55px] cursor-pointer text-xl font-normal mx-auto"
                  asChild
                >
                  <Link to="/ride-creation">Set Pickup & Dropoff</Link>
                </Button>
              ) : null}
            </div>
          ) : (
            cities.map(
              ({ id, title, defaultChecked, placeId, lat, lng, address }) => (
                <Checkbox.Root
                  key={id}
                  id={id}
                  className="group py-4 flex items-center gap-4 cursor-pointer"
                  defaultChecked={defaultChecked}
                  onCheckedChange={(checked) =>
                    handleCityToggle(id, title, checked as boolean, {
                      id,
                      title,
                      placeId,
                      lat,
                      lng,
                      address,
                    })
                  }
                >
                  <img
                    className="size-[25px] lg:size-[30px]"
                    src="/assets/building.svg"
                    alt="Building Icon"
                  />
                  <Label
                    htmlFor={id}
                    className="flex items-center gap-1 flex-1"
                  >
                    <span className="text-base font-normal">{title}</span>
                  </Label>
                  <div className="size-[33px] relative border border-gray-300 group-data-[state=checked]:border-transparent rounded-full flex items-center justify-center">
                    <Checkbox.Indicator>
                      <img
                        src="/assets/check-green.svg"
                        alt="Check Icon"
                        className="absolute inset-0 m-auto size-[33px]"
                      />
                    </Checkbox.Indicator>
                  </div>
                </Checkbox.Root>
              )
            )
          )}
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 max-w-[430px] w-full mx-auto">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[#EBEBEB] rounded-full w-full md:w-[208px] h-[55px] cursor-pointer text-xl font-normal shadow-none"
              >
                <Plus />
                <span>{t("stopovers.add_city")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-[896px] min-h-[464px] w-full p-6">
              <CitySearch name="stopover-search" onSelect={handleAddCity} />
            </DialogContent>
          </Dialog>
          <Button
            className="bg-[#FF4848] rounded-full w-full md:w-[208px] h-[55px] cursor-pointer text-xl font-normal"
            asChild
          >
            <Link state={location.state} to="/stopovers-preview">
              {t("stopovers.continue")}
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
