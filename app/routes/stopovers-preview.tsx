import Header from "~/components/layouts/header";
import type { Route } from "./+types/stopovers-preview";
import Footer from "~/components/layouts/footer";
import { Button } from "~/components/ui/button";
import { Map } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Stopovers" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const { t } = useTranslation();
  const pickup = useRideCreationStore((state) => state.rideData.pickup);
  const dropoff = useRideCreationStore((state) => state.rideData.dropoff);
  const stops = useRideCreationStore((state) => state.rideData.stops);

  // Get all stops including pickup and dropoff for the route display
  const getRouteStops = () => {
    const routeStops = [];
    
    // Add pickup as first stop
    if (pickup) {
      routeStops.push({
        type: 'pickup',
        name: pickup.address,
        placeId: pickup.placeId,
        lat: pickup.lat,
        lng: pickup.lng
      });
    }

    // Add intermediate stops
    if (stops && stops.length > 0) {
      stops.forEach((stop, index) => {
        routeStops.push({
          type: 'stop',
          name: stop.address,
          placeId: stop.placeId,
          lat: stop.lat,
          lng: stop.lng,
          order: stop.order
        });
      });
    }

    // Add dropoff as last stop
    if (dropoff) {
      routeStops.push({
        type: 'dropoff',
        name: dropoff.address,
        placeId: dropoff.placeId,
        lat: dropoff.lat,
        lng: dropoff.lng
      });
    }

    return routeStops;
  };

  const routeStops = getRouteStops();

  return (
    <div className="bg-[#F5F5F5]">
      <Header title={t("stopovers_preview.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center">
          {t("stopovers_preview.header_title")}
        </p>
        <div className="grid grid-cols-[32px_1fr] items-center gap-8 max-w-[576px] w-full mx-auto bg-white rounded-2xl px-6 py-4 relative">
          <div className="absolute top-6 bottom-6 start-6 w-[32px] flex items-center bg-[url(/assets/path.svg)] bg-center bg-repeat-y z-0"></div>
          
          {routeStops.map((stop, index) => {
            // Determine which icon to use based on position and type
            const isFirst = index === 0;
            const isLast = index === routeStops.length - 1;
            const iconSrc = isFirst 
              ? "/assets/car-green.svg" 
              : isLast 
              ? "/assets/flag-red.svg"
              : "/assets/location-pin-green.svg";
            
            return (
              <>
                <img
                  key={`icon-${index}`}
                  className="mx-auto z-[1] bg-white"
                  src={iconSrc}
                  alt=""
                />
                <div key={`content-${index}`} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg">{stop.name}</p>
                    {stop.type === 'stop' && (
                      <p className="text-base text-[#666666] font-light">
                        Stop {stop.order}
                      </p>
                    )}
                  </div>
                  <Drawer direction="right">
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-[#EBEBEB] size-[46px] shadow-none cursor-pointer"
                      >
                        <Map className="text-[24px]" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-transparent">
                      <img
                        className="rounded-l-2xl h-screen object-cover"
                        src="/assets/map-drawer.png"
                        alt=""
                      />
                    </DrawerContent>
                  </Drawer>
                </div>
              </>
            );
          })}
        </div>
        <Button
          className="bg-[#FF4848] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal mx-auto"
          asChild
        >
          <Link state={location.state} to="/date">
            {t("stopovers_preview.continue")}
          </Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}
