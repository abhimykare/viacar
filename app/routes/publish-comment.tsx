import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import type { Route } from "./+types/publish-comment";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { api } from "~/lib/api";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Ride Details" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const [notes, setNotes] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const rideData = useRideCreationStore((state) => state.rideData);
  const storeSetNotes = useRideCreationStore((state) => state.setNotes);

  return (
    <div>
      <Header title={t("publish_comment.title")} />
      <div className="max-w-[894px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-4 lg:gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center leading-tight max-w-[664px] mx-auto mb-6">
          {t("publish_comment.header_title")}
        </p>
        <div className="border border-[#EBEBEB] rounded-2xl p-6">
          <p className="text-base lg:text-xl text-center mb-6">
            {t("publish_comment.section_title")}
          </p>
          <Textarea
            className="text-sm font-light placeholder:text-[#999999] bg-[#F5F5F5] rounded-2xl !border-0 !ring-0 min-h-[228px] p-6"
            placeholder={t("publish_comment.placeholder")}
            value={notes}
            onChange={(e) => {
              const newNotes = e.target.value;
              setNotes(newNotes);
              storeSetNotes(newNotes);
            }}
          />
        </div>
        <Button
          className="bg-[#FF4848] rounded-full w-[241px] h-[55px] cursor-pointer text-xl font-normal mx-auto mt-6"
          onClick={async () => {
            setIsPublishing(true);
            try {
              // Debug: Log store data
              console.log("Store data:", rideData);

              // Validate required location parameters
              if (!rideData.pickup || !rideData.dropoff) {
                throw new Error(
                  "Missing location data. Please complete the pickup and dropoff steps."
                );
              }

              if (!rideData.pickup.placeId || !rideData.dropoff.placeId) {
                throw new Error(
                  "Missing location data. Please complete the pickup and dropoff steps."
                );
              }

              // Validate stops data if present
              if (rideData.stops && rideData.stops.length > 0) {
                rideData.stops.forEach((stop, index) => {
                  if (!stop.placeId || !stop.lat || !stop.lng || !stop.address) {
                    throw new Error(
                      `Invalid stop data at position ${index + 1}. Please check your stopovers.`
                    );
                  }
                });
              }

              // Validate prices data if present
              if (rideData.prices && rideData.prices.length > 0) {
                rideData.prices.forEach((price, index) => {
                  if (!price.pickup_order || !price.drop_order || price.amount === undefined) {
                    throw new Error(
                      `Invalid price data at position ${index + 1}. Please check your pricing.`
                    );
                  }
                });
              }

              const departureDate =
                rideData.departureDate ||
                new Date().toISOString().split("T")[0];
              
              // Convert HH:MM:SS to HH:MM format for API
              let pickupTime = rideData.departureTime || "00:00";
              if (pickupTime.includes(':') && pickupTime.split(':').length === 3) {
                // Convert HH:MM:SS to HH:MM
                pickupTime = pickupTime.substring(0, 5);
              }
              
              // Calculate drop time if not provided (add 1 hour to pickup time as default)
              let dropTime = rideData.drop_time;
              if (!dropTime && pickupTime) {
                const [hours, minutes] = pickupTime.split(':').map(Number);
                const dropHours = (hours + 1) % 24;
                dropTime = `${dropHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
              }

              // Get vehicle ID from localStorage or use default
              const vehicleId = parseInt(
                localStorage.getItem("selected_vehicle_id") || "1"
              );

              // Prepare stops data with proper ordering and time format
              const stopsWithOrder = rideData.stops?.map((stop, index) => {
                let stopTime = stop.time || pickupTime;
                // Convert stop time to HH:MM format if it's in HH:MM:SS
                if (stopTime && stopTime.includes(':') && stopTime.split(':').length === 3) {
                  stopTime = stopTime.substring(0, 5);
                }
                return {
                  ...stop,
                  order: index + 1,
                  time: stopTime
                };
              }) || [];

              // Prepare prices data from store
              const prices = rideData.prices?.map(price => ({
                pickup_order: price.pickup_order,
                drop_order: price.drop_order,
                amount: price.amount
              })) || [];

              // Create ride data according to Swagger API specification
              const rideDataToSend = {
                vehicle_id: vehicleId,
                pickup_lat: rideData.pickup.lat,
                pickup_lng: rideData.pickup.lng,
                pickup_address: rideData.pickup.address,
                drop_lat: rideData.dropoff.lat,
                drop_lng: rideData.dropoff.lng,
                drop_address: rideData.dropoff.address,
                date: departureDate,
                pickup_time: pickupTime,
                drop_time: dropTime || pickupTime, // Ensure drop_time is provided
                passengers: rideData.availableSeats || 1,
                ride_route: rideData.ride_route || "main_route", // Provide default route name
                max_2_in_back: rideData.max_2_in_back || false,
                stops: stopsWithOrder.length > 0 ? stopsWithOrder : undefined,
                prices: prices.length > 0 ? prices : undefined,
                price_per_seat: rideData.pricePerSeat || 0,
                notes: rideData.notes || "",
              };

              console.log("Final ride data being sent to API:", rideDataToSend);
              console.log("Stops data:", rideDataToSend.stops);
              console.log("Prices data:", rideDataToSend.prices);

              console.log("Sending ride creation request...");
              const response = await api.createRide(rideDataToSend);
              console.log("Ride created successfully:", response);

              // Navigate to success page or show success message
              if (response?.data?.ride_id) {
                // Navigate to ride details page with the new ride ID
                window.location.href = `/ride-details/${response.data.ride_id}`;
              } else {
                // Fallback to generic success page
                window.location.href = "/publish-ride";
              }
            } catch (error) {
              console.error("Failed to create ride:", error);
              alert("Failed to publish ride. Please try again.");
              setIsPublishing(false);
            }
          }}
          disabled={isPublishing}
        >
          {isPublishing ? "Publishing..." : t("publish_comment.publish_ride")}
        </Button>
      </div>
      <Footer />
    </div>
  );
}
