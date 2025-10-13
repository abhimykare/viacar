import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/pricing";
import { Button } from "~/components/ui/button";
import React, { useState } from "react";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Link, useLocation } from "react-router";
import TimeDirectionIcon from "~/components/icons/time-direction-icon";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Pricing" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const [amount, setAmount] = useState(3000);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();
  const setPricePerSeat = useRideCreationStore(
    (state) => state.setPricePerSeat
  );
  const pricePerSeat = useRideCreationStore(
    (state) => state.rideData.pricePerSeat
  );
  const pickup = useRideCreationStore((state) => state.rideData.pickup);
  const dropoff = useRideCreationStore((state) => state.rideData.dropoff);
  const stops = useRideCreationStore((state) => state.rideData.stops) || [];
  const setPrices = useRideCreationStore((state) => state.setPrices);
  
  // Dynamic pricing segments based on stops
  const [segmentPrices, setSegmentPrices] = useState<{[key: string]: number}>({});

  // Initialize prices from store
  React.useEffect(() => {
    if (pricePerSeat) {
      setAmount(pricePerSeat);
    }

    // Initialize segment prices based on route segments
    const initializeSegmentPrices = () => {
      const allStops = [pickup, ...stops, dropoff].filter(Boolean);
      const newSegmentPrices: {[key: string]: number} = {};
      
      // Generate all possible segments
      for (let i = 0; i < allStops.length - 1; i++) {
        for (let j = i + 1; j < allStops.length; j++) {
          const segmentKey = `${i + 1}-${j + 1}`;
          // Initialize with reasonable default prices based on distance
          const basePrice = 300 + (j - i) * 200;
          newSegmentPrices[segmentKey] = basePrice;
        }
      }
      
      setSegmentPrices(newSegmentPrices);
    };

    if (pickup && dropoff) {
      initializeSegmentPrices();
    }
  }, [pricePerSeat, pickup, dropoff, stops]);

  // Clear and regenerate segment prices when stops change significantly
  React.useEffect(() => {
    const initializeSegmentPrices = () => {
      const allStops = [pickup, ...stops, dropoff].filter(Boolean);
      const newSegmentPrices: {[key: string]: number} = {};
      
      // Generate all possible segments
      for (let i = 0; i < allStops.length - 1; i++) {
        for (let j = i + 1; j < allStops.length; j++) {
          const segmentKey = `${i + 1}-${j + 1}`;
          // Initialize with reasonable default prices based on distance
          const basePrice = 300 + (j - i) * 200;
          newSegmentPrices[segmentKey] = basePrice;
        }
      }
      
      setSegmentPrices(newSegmentPrices);
    };

    // Only reinitialize if we have the basic route setup
    if (pickup && dropoff) {
      initializeSegmentPrices();
    }
  }, [stops.length]); // Only watch for stops length changes to avoid excessive re-renders

  function adjustAmount(adjustment: number) {
    const newAmount = Math.max(1000, Math.min(4000, amount + adjustment));
    setAmount(newAmount);
    setPricePerSeat(newAmount);
  }

  function adjustSegmentPrice(segmentKey: string, adjustment: number) {
    setSegmentPrices(prev => ({
      ...prev,
      [segmentKey]: Math.max(1, Math.min(4000, (prev[segmentKey] || 0) + adjustment))
    }));
  }

  function setSegmentPrice(segmentKey: string, price: number) {
    const newPrice = Math.max(1, Math.min(4000, price));
    setSegmentPrices(prev => ({
      ...prev,
      [segmentKey]: newPrice
    }));
  }

  // Get all route segments for pricing
  function getRouteSegments() {
    const allStops = [pickup, ...stops, dropoff].filter(Boolean);
    const segments: Array<{pickup_order: number, drop_order: number, pickup_location: LocationData, drop_location: LocationData}> = [];
    
    for (let i = 0; i < allStops.length - 1; i++) {
      for (let j = i + 1; j < allStops.length; j++) {
        segments.push({
          pickup_order: i + 1,
          drop_order: j + 1,
          pickup_location: allStops[i]!,
          drop_location: allStops[j]!
        });
      }
    }
    
    return segments;
  }

  return (
    <div className="bg-[#F5F5F5]">
      <Header title={t("pricing.title")} />
      <div className="max-w-[686px] w-full mx-auto px-6 pt-10 lgpt-[80px] pb-12 lg:pb-[100px]">
        <div className="bg-white rounded-2xl w-full px-4 lg:px-12 py-6 lg:py-10">
          <p className="text-2xl lg:text-[2.188rem] text-[#3C3F4E] text-center font-medium leading-tight">
            {t("pricing.header_title")}
          </p>
          <div className="flex items-center justify-center space-x-2 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="size-[50px] shrink-0 rounded-full cursor-pointer"
              onClick={() => {
                const newAmount = Math.max(1, amount - 1);
                setAmount(newAmount);
                setPricePerSeat(newAmount);
              }}
              disabled={amount <= 1}
            >
              <img
                className="size-[50px]"
                src="/assets/minus-large.svg"
                alt=""
              />
              <span className="sr-only">{t("pricing.decrease")}</span>
            </Button>
            <div className="flex-1 text-center">
              <div className="text-4xl lg:text-[5.25rem] text-[#00665A] font-semibold">
                SR {amount.toLocaleString()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-[50px] shrink-0 rounded-full cursor-pointer"
              onClick={() => {
                const newAmount = Math.min(4000, amount + 1);
                setAmount(newAmount);
                setPricePerSeat(newAmount);
              }}
              disabled={amount >= 4000}
            >
              <img
                className="size-[50px]"
                src="/assets/plus-large.svg"
                alt=""
              />
              <span className="sr-only">{t("pricing.increase")}</span>
            </Button>
          </div>
          <Separator className="my-6 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
          <div className="h-auto sm:h-[35px] text-base lg:text-lg text-white bg-[#14B968] rounded-full text-center w-full sm:w-max px-6 py-1 flex items-center justify-center mx-auto mb-4">
            {t("pricing.recommended_price")}
          </div>
          <p className="text-[0.938rem] text-[#666666] font-light text-center">
            {t("pricing.perfect_price")}
          </p>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 max-w-[430px] w-full mx-auto mt-12">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-[#EBEBEB] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal shadow-none"
                >
                  <span>{t("pricing.show_prices")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[950px] w-[95vw] max-h-[80vh] p-0">
                <ScrollArea className="h-[70vh] max-h-[600px] p-6">
                  <div className="flex flex-col">
                    {getRouteSegments().map((segment, index) => {
                      const segmentKey = `${segment.pickup_order}-${segment.drop_order}`;
                      const currentPrice = segmentPrices[segmentKey] || 0;
                      const isFirstSegment = index === 0;
                      
                      return (
                        <React.Fragment key={segmentKey}>
                          {index > 0 && (
                            <Separator className="my-4 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
                          )}
                          <div className={`grid grid-cols-[${isFirstSegment ? '60px' : '26px'}_1fr] md:flex items-center gap-4 mb-5 ${isFirstSegment ? 'min-h-[167px]' : 'min-h-[139px]'}`}>
                            {isFirstSegment ? (
                              <TimeDirectionIcon
                                time="4h 40m"
                                className="h-[167px] w-[60px]"
                              />
                            ) : (
                              <img src="/assets/direction2.svg" />
                            )}
                            <div className="flex flex-col justify-between h-full">
                              <div>
                                <p className="text-base text-[#939393] font-light">
                                  {t("pricing.pickup")}
                                </p>
                                <p className="text-lg">
                                  {segment.pickup_location.address}
                                </p>
                              </div>
                              <div>
                                <p className="text-base text-[#939393] font-light">
                                  {t("pricing.drop")}
                                </p>
                                <p className="text-lg">
                                  {segment.drop_location.address}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col text-end lg:ml-auto max-lg:col-span-2">
                              <div className="flex items-center justify-center space-x-4 px-6">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-[40px] shrink-0 rounded-full cursor-pointer"
                                  onClick={() => adjustSegmentPrice(segmentKey, -1)}
                                  disabled={currentPrice <= 1}
                                >
                                  <img
                                    className="size-[30px]"
                                    src="/assets/minus-red.svg"
                                    alt=""
                                  />
                                  <span className="sr-only">
                                    {t("pricing.decrease")}
                                  </span>
                                </Button>
                                <div className="flex-1 text-center">
                                  <div className={`${isFirstSegment ? 'text-[2.188rem]' : 'text-[1.625rem]'} font-semibold font-alpha mb-2`}>
                                    SR{" "}
                                    {currentPrice.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </div>
                                  <input
                                    type="number"
                                    value={currentPrice}
                                    onChange={(e) => setSegmentPrice(segmentKey, parseInt(e.target.value) || 0)}
                                    className="w-20 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                                    min="1"
                                    max="4000"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-[40px] shrink-0 rounded-full cursor-pointer"
                                  onClick={() => adjustSegmentPrice(segmentKey, 1)}
                                  disabled={currentPrice >= 4000}
                                >
                                  <img
                                    className="size-[30px]"
                                    src="/assets/plus-green.svg"
                                    alt=""
                                  />
                                  <span className="sr-only">
                                    {t("pricing.increase")}
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Button
              className="bg-[#FF4848] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal"
              asChild
            >
              <Link
                to={location.state?.isReturn ? "/publish-comment" : "/return"}
                onClick={() => {
                  // Convert segment prices to the required format for createRide API
                  const prices = Object.entries(segmentPrices).map(([segmentKey, amount]) => {
                    const [pickup_order, drop_order] = segmentKey.split('-').map(Number);
                    return { pickup_order, drop_order, amount };
                  });
                  
                  // Save to store
                  setPrices(prices);
                  
                  // Also save to localStorage for persistence
                  localStorage.setItem("ride_prices", JSON.stringify(prices));
                }}
              >
                {t("pricing.continue")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
