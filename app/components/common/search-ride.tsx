import { useEffect, useState } from "react";

import { useRideSearchStore } from "~/lib/store/rideSearchStore";
import SwapIcon from "../icons/swap-icon";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import LocationSelect from "./location-select";
import PassengerSelect from "./passenger-select";
import SearchIcon from "../icons/share-icon";
import DatePicker from "./date-picker";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";

export default function SearchRide({ className = "" }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const { setLeavingFrom, setGoingTo, leavingFrom, goingTo, triggerSearch } =
    useRideSearchStore();
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // Reverse geocoding to get location text
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.address && data.address.city) {
                setCurrentLocation(data.address.city);
                // Only set if no location is already selected
                if (!leavingFrom) {
                  // Create a basic location object for the current city
                  const currentCityData = {
                    placeId: `current_${data.address.city}`,
                    text: data.address.city,
                    mainText: data.address.city,
                    secondaryText: "Current Location",
                    lat: latitude,
                    lng: longitude,
                  };
                  setLeavingFrom(currentCityData);
                }
              } else if (data.address && data.address.town) {
                setCurrentLocation(data.address.town);
                if (!leavingFrom) {
                  const currentTownData = {
                    placeId: `current_${data.address.town}`,
                    text: data.address.town,
                    mainText: data.address.town,
                    secondaryText: "Current Location",
                    lat: latitude,
                    lng: longitude,
                  };
                  setLeavingFrom(currentTownData);
                }
              }
            })
            .catch((error) => {
              console.error("Error fetching location name:", error);
              setCurrentLocation("Kochi");
              if (!leavingFrom) {
                const kochiData = {
                  placeId: "current_kochi",
                  text: "Kochi",
                  mainText: "Kochi",
                  secondaryText: "Current Location",
                  lat: 9.9312328,
                  lng: 76.26730409999999,
                };
                setLeavingFrom(kochiData);
              }
            });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setCurrentLocation("Kochi");
          if (!leavingFrom) {
            const kochiData = {
              placeId: "current_kochi",
              text: "Kochi",
              mainText: "Kochi",
              secondaryText: "Current Location",
              lat: 9.9312328,
              lng: 76.26730409999999,
            };
            setLeavingFrom(kochiData);
          }
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setCurrentLocation("Kochi");
      if (!leavingFrom) {
        const kochiData = {
          placeId: "current_kochi",
          text: "Kochi",
          mainText: "Kochi",
          secondaryText: "Current Location",
          lat: 9.9312328,
          lng: 76.26730409999999,
        };
        setLeavingFrom(kochiData);
      }
    }
  }, [leavingFrom, setLeavingFrom]);

  const handleLocationSwap = () => {
    if (leavingFrom && goingTo) {
      setLeavingFrom(goingTo);
      setGoingTo(leavingFrom);
    }
  };
  return (
    <div
      className={cn(
        className,
        "bg-white pt-5 pb-10 lg:py-0 max-lg:rounded-b-none rounded-2xl lg:rounded-full max-lg:px-4 max-w-[500px] lg:max-w-[1000px] w-full mx-auto flex lg:grid grid-cols-[1fr_36px_1fr_2px_1fr_2px_1fr_auto] flex-col lg:flex-row gap-4 lg:gap-5 h-auto lg:h-[104px] lg:drop-shadow-lg",
        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
      )}
    >
      <div className="flex items-center h-full w-full">
        <LocationSelect
          label={t("search.ride.leaving_from")}
          name="from"
          placeholder={t("search.ride.select_pickup")}
          initialLocation={currentLocation}
        />
      </div>
      <div className="py-2 lg:py-5 grid grid-cols-1 grid-rows-1 max-lg:hidden max-w-[36px] w-full h-full">
        <Separator
          className="col-start-1 -col-end-1 row-start-1 -row-end-1 mx-auto"
          orientation="vertical"
        />
        <Button
          className="col-start-1 -col-end-1 row-start-1 -row-end-1 rounded-full my-auto cursor-pointer rotate-90 lg:rotate-0 max-lg:mx-auto"
          variant="outline"
          size="icon"
          onClick={handleLocationSwap}
        >
          <SwapIcon />
        </Button>
      </div>
      <div className="flex items-center h-full w-full">
        <LocationSelect
          label={t("search.ride.going_to")}
          name="to"
          placeholder={t("search.ride.select_dropoff")}
          initialLocation={currentLocation}
        />
      </div>
      <div className="py-0 lg:py-5 max-lg:hidden">
        <Separator
          className="col-start-1 -col-end-1 row-start-1 -row-end-1"
          orientation="vertical"
        />
      </div>
      <div className="flex items-center lg:max-w-[150px] w-full">
        <DatePicker />
      </div>
      <div className="py-5 max-lg:hidden">
        <Separator
          className="col-start-1 -col-end-1 row-start-1 -row-end-1"
          orientation="vertical"
        />
      </div>
      <div className="flex items-center lg:max-w-[200px] w-full max-lg:mx-auto">
        <PassengerSelect />
      </div>
      <div className="flex items-center justify-center lg:ml-auto">
        <Button
          className="bg-[#FF4848] rounded-full h-[58px] lg:h-[50px] lg:size-[71px] cursor-pointer max-lg:w-full max-lg:text-xl max-lg:font-normal"
          asChild
        >
          <button
            onClick={() => {
              // Always trigger search when button is clicked
              triggerSearch();

              // Only navigate if not already on the ride page
              if (location.pathname !== "/book/ride") {
                navigate("/book/ride");
              }
            }}
          >
            <SearchIcon className="size-[20px] lg:size-[26px] hidden lg:block" />
            <span className="lg:hidden">{t("search.ride.search")}</span>
          </button>
        </Button>
      </div>
    </div>
  );
}
