import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/publish-comment";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { api } from "~/lib/api";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";
import { formatApiDateToYYYYMMDD, formatTimeToHHMM } from "~/lib/utils";

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
  console.log("rideData", rideData);

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
              console.log("Store data:", rideData);

              // Validate required location parameters
              if (!rideData.pickup || !rideData.dropoff) {
                throw new Error(
                  "Missing location data. Please complete the pickup and dropoff steps."
                );
              }

              if (!rideData.pickup.lat || !rideData.pickup.lng || !rideData.dropoff.lat || !rideData.dropoff.lng) {
                throw new Error(
                  "Missing location coordinates. Please complete the pickup and dropoff steps."
                );
              }

              // Validate vehicle
              if (!rideData.vehicle_id) {
                throw new Error("Please select a vehicle before publishing.");
              }

              const departureDate =
                rideData.departure_date ||
                new Date().toISOString().split("T")[0];

              // Format pickup time to HH:MM format
              let pickupTime = rideData.departure_time || "00:00";
              pickupTime = formatTimeToHHMM(pickupTime);

              // Calculate drop time if not provided (add 1 hour to pickup time as default)
              let dropTime = rideData.drop_time;
              if (!dropTime && pickupTime) {
                const [hours, minutes] = pickupTime.split(":").map(Number);
                const dropHours = (hours + 1) % 24;
                dropTime = `${dropHours.toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}`;
              }
              dropTime = formatTimeToHHMM(dropTime || pickupTime);

              // Build stops array - ALWAYS include pickup and drop as stops
              const allStops = [];
              
              // Add pickup as first stop (order 0)
              allStops.push({
                lat: rideData.pickup.lat,
                lng: rideData.pickup.lng,
                address: rideData.pickup.address,
                order: 0,
                time: pickupTime,
              });

              // Add intermediate stops if any
              if (rideData.stops && rideData.stops.length > 0) {
                rideData.stops.forEach((stop, index) => {
                  let stopTime = stop.time || pickupTime;
                  stopTime = formatTimeToHHMM(stopTime);
                  allStops.push({
                    lat: stop.lat,
                    lng: stop.lng,
                    address: stop.address,
                    order: index + 1,
                    time: stopTime,
                  });
                });
              }

              // Add dropoff as last stop
              const dropOrder = allStops.length;
              allStops.push({
                lat: rideData.dropoff.lat,
                lng: rideData.dropoff.lng,
                address: rideData.dropoff.address,
                order: dropOrder,
                time: dropTime,
              });

              // Build prices array - at minimum, include pickup to drop price
              const allPrices = [];
              
              if (rideData.prices && rideData.prices.length > 0) {
                // Use custom prices if provided
                allPrices.push(...rideData.prices.map((price) => ({
                  pickup_order: price.pickup_order,
                  drop_order: price.drop_order,
                  amount: price.amount,
                })));
              } else {
                // Default: single price from pickup (order 0) to drop (last order)
                allPrices.push({
                  pickup_order: 0,
                  drop_order: dropOrder,
                  amount: rideData.price_per_seat || 0,
                });
              }

              // Create ride data according to API specification
              const rideDataToSend = {
                vehicle_id: rideData.vehicle_id,
                pickup_lat: rideData.pickup.lat,
                pickup_lng: rideData.pickup.lng,
                pickup_address: rideData.pickup.address,
                drop_lat: rideData.dropoff.lat,
                drop_lng: rideData.dropoff.lng,
                drop_address: rideData.dropoff.address,
                date: formatApiDateToYYYYMMDD(departureDate),
                pickup_time: pickupTime,
                drop_time: dropTime,
                passengers: rideData.available_seats || 1,
                ride_route: rideData.ride_route || "main_route",
                max_2_in_back: rideData.max_2_in_back || false,
                stops: allStops,
                prices: allPrices,
                price_per_seat: rideData.price_per_seat || 0,
                notes: notes || "",
              };

              console.log("Sending ride creation request:", rideDataToSend);
              const response = await api.createRide(rideDataToSend);
              console.log("Ride created successfully:", response);

              // Test search with the created ride data
              if (response?.data) {
                console.log("Testing search API with created ride...");
                const searchResponse = await api.searchRides({
                  user_lat: rideData.pickup.lat,
                  user_lng: rideData.pickup.lng,
                  destination_lat: rideData.dropoff.lat,
                  destination_lng: rideData.dropoff.lng,
                  date: formatApiDateToYYYYMMDD(departureDate),
                  passengers: 1,
                  max_walking_distance_km: 5,
                });
                console.log("Search API response:", searchResponse);
                
                if (searchResponse?.data?.rides?.length > 0) {
                  const foundRide = searchResponse.data.rides.find(
                    (ride: any) => ride.rideId === response.data.id
                  );
                  if (foundRide) {
                    console.log("✅ Successfully found the created ride in search results!");
                  } else {
                    console.log("⚠️ Created ride not found in search results yet (may need time to index)");
                  }
                }
              }

              alert(`Ride published successfully! Ride ID: ${response?.data?.id || 'N/A'}`);
              setIsPublishing(false);
              
              // Navigate to success page or ride list
              // window.location.href = "/publish-ride";
            } catch (error: any) {
              console.error("Failed to create ride:", error);
              const errorMessage = error?.message || "Failed to publish ride. Please try again.";
              alert(errorMessage);
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
