import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/publish-comment";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { api } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Ride Details" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [notes, setNotes] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

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
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button
          className="bg-[#FF4848] rounded-full w-[241px] h-[55px] cursor-pointer text-xl font-normal mx-auto mt-6"
          onClick={async () => {
            setIsPublishing(true);
            try {
              // Debug: Log all URL parameters
              console.log("URL Parameters received:", Object.fromEntries(searchParams.entries()));
              
              // Debug: Log specific parameters we're looking for
              console.log("Pickup params:", {
                lat: searchParams.get("pickup_lat"),
                lng: searchParams.get("pickup_lng"),
                address: searchParams.get("pickup_address")
              });
              
              console.log("Dropoff params:", {
                lat: searchParams.get("dropoff_lat"),
                lng: searchParams.get("dropoff_lng"),
                address: searchParams.get("dropoff_address")
              });
              
              console.log("Other params:", {
                departure_date: searchParams.get("departure_date"),
                departure_time: searchParams.get("departure_time"),
                available_seats: searchParams.get("available_seats"),
                price_per_seat: searchParams.get("price_per_seat")
              });
              // Get all required parameters with validation
              const pickupLat = parseFloat(searchParams.get("pickup_lat") || "0");
              const pickupLng = parseFloat(searchParams.get("pickup_lng") || "0");
              const pickupAddress = searchParams.get("pickup_address") || "";
              const destinationLat = parseFloat(searchParams.get("dropoff_lat") || "0");
              const destinationLng = parseFloat(searchParams.get("dropoff_lng") || "0");
              const destinationAddress = searchParams.get("dropoff_address") || "";
              const pricePerSeat = parseInt(searchParams.get("price_per_seat") || "0");
              
              // Validate required location parameters
              if (pickupLat === 0 || pickupLng === 0 || destinationLat === 0 || destinationLng === 0) {
                throw new Error("Missing location data. Please complete the pickup and dropoff steps.");
              }
              
              if (!pickupAddress || !destinationAddress) {
                throw new Error("Missing address data. Please complete the pickup and dropoff steps.");
              }

              const departureDate =
                searchParams.get("departure_date") ||
                new Date().toISOString().split("T")[0];
              const departureTime =
                searchParams.get("departure_time") || "00:00:00";
              const departureDateTime = `${departureDate}T${departureTime}`;

              const rideData = {
                pickup_lat: pickupLat,
                pickup_lng: pickupLng,
                pickup_address: pickupAddress,
                destination_lat: destinationLat,
                destination_lng: destinationLng,
                destination_address: destinationAddress,
                departure_time: departureDateTime,
                available_seats: parseInt(
                  searchParams.get("available_seats") || "1"
                ),
                price_per_seat: pricePerSeat,
                notes: notes,
                vehicle_id: 1, // Default vehicle ID, can be updated later
              };

              await api.createRide(rideData);
              // Navigate to success page or show success message
              window.location.href = "/publish-ride";
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
