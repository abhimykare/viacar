import Header from "~/components/layouts/header";
import type { Route } from "./+types/date";
import Footer from "~/components/layouts/footer";
import { CalendarBasic } from "~/components/ui/calendar-basic";
import { useState, useEffect, type SetStateAction } from "react";
import { isBefore, startOfDay } from "date-fns";
import { Button } from "~/components/ui/button";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Date" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const { t } = useTranslation();
  const setDepartureDate = useRideCreationStore((state) => state.setDepartureDate);
  const departureDate = useRideCreationStore((state) => state.rideData.departure_date);

  // Debug logging
  console.log("Date page - departureDate from store:", departureDate);
  console.log("Date page - selected state:", selected);

  // Initialize selected state with stored date on page load
  useEffect(() => {
    if (departureDate && !selected) {
      console.log("Initializing selected with stored departureDate:", departureDate);
      setSelected(new Date(departureDate + 'T00:00:00'));
    }
  }, [departureDate]);

  // Sync store date with selected state when store changes
  useEffect(() => {
    if (departureDate && selected) {
      const storedDate = new Date(departureDate + 'T00:00:00');
      if (selected.getTime() !== storedDate.getTime()) {
        console.log("Syncing selected with store date:", departureDate);
        setSelected(storedDate);
      }
    }
  }, [departureDate, selected]);

  // Debug: Show current store state on page
  const showStoreDebug = () => {
    console.log("=== DATE PAGE DEBUG ===");
    console.log("departureDate from store:", departureDate);
    console.log("selected state:", selected);
    console.log("localStorage ride-creation-storage:", localStorage.getItem('ride-creation-storage'));
    console.log("======================");
  };

  return (
    <div>
      <Header title={t("date.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center">
          {t("date.header_title")}
        </p>
        
        {/* Debug button to show store state */}
        <div className="text-center">
          <button 
            onClick={showStoreDebug}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            Debug Store State
          </button>
          <div className="text-xs text-gray-600 mt-2">
            Stored date: {departureDate || 'none'} | Selected: {selected ? selected.toISOString().split('T')[0] : 'none'}
          </div>
          {departureDate && (
            <div className="text-xs text-green-600 mt-1">
              ✓ Date successfully stored: {departureDate}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <CalendarBasic
            className="shadow-2xl rounded-2xl max-w-[394px]"
            mode="single"
            disabled={(date) => isBefore(date, startOfDay(new Date()))}
            selected={selected || (departureDate ? new Date(departureDate + 'T00:00:00') : undefined)}
            onSelect={(value: SetStateAction<Date | undefined>) => {
              setSelected(value);
              if (value) {
                // Convert Date to YYYY-MM-DD format for the store
                const dateString = value.toISOString().split('T')[0];
                console.log("Setting departure date to:", dateString);
                setDepartureDate(dateString);
                
                // Debug: Check if it was stored correctly
                setTimeout(() => {
                  const storedData = localStorage.getItem('ride-creation-storage');
                  if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    console.log("After setting - departure_date in localStorage:", parsedData.state?.rideData?.departure_date);
                  }
                }, 100);
              }
            }}
            components={{
              Footer: () => (
                <tbody>
                  <tr>
                    <td>
                      <div className="flex items-center justify-center pt-10">
                        <Button
                          className="bg-[#FF4848] w-[140px] h-[48px] rounded-full"
                          asChild
                        >
                          <Link state={location.state} to="/time">
                            {t("date.apply")}
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ),
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
