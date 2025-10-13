import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { FaStar } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface RideItemProps {
  ride: {
    id: number;
    driver: {
      id: number;
      first_name: string;
      last_name: string;
      rating: number;
    };
    pickup_lat: number;
    pickup_lng: number;
    pickup_address: string;
    destination_lat: number;
    destination_lng: number;
    destination_address: string;
    departure_time: string;
    available_seats: number;
    price_per_seat: number;
    distance_km: number;
    walking_distance_km: number;
  };
}

export default function RideItem({ ride }: RideItemProps) {
  const { t } = useTranslation("translation", {
    keyPrefix: "components.ride_item",
  });

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(price);
  };

  return (
    <Link to={`/ride-details?rideId=${ride.id}`}>
      <Card className="p-6 rounded-[1.25rem] shadow-[0px_0px_7px_0px_rgba(0,0,0,0.07)]">
        <div className="grid grid-cols-[1fr_auto] justify-center gap-4">
          <div className="grid grid-cols-[auto_auto_1fr] items-center justify-center gap-x-4 gap-y-4 relative col-span-2 sm:col-span-1">
            <p className="absolute top-0 bottom-0 left-0 text-[0.625rem] text-[#666666] flex items-center pl-1">
              {ride.distance_km} km
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal">
              {formatTime(ride.departure_time)}
            </p>
            <img
              className="col-start-2 col-end-3 row-start-1 row-end-3 w-full h-full object-contain max-w-[26px]"
              src="/assets/direction.svg"
              alt=""
            />
            <p className="text-base lg:text-[1.3rem] font-normal truncate">
              {ride.pickup_address}
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal">
              {formatTime(new Date(new Date(ride.departure_time).getTime() + ride.distance_km * 2 * 60000).toISOString())}
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal truncate">
              {ride.destination_address}
            </p>
          </div>
          <p className="text-lg lg:text-[1.5rem] text-[#00665A] font-medium">
            {formatPrice(ride.price_per_seat)}
          </p>
          <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent col-span-2" />
          <div className="flex items-center gap-2 col-span-2">
            <Avatar className="size-[38px]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>{ride.driver.first_name[0]}{ride.driver.last_name[0]}</AvatarFallback>
            </Avatar>
            <p className="text-base lg:text-lg px-2">
              {ride.driver.first_name} {ride.driver.last_name}
            </p>
            <FaStar className="fill-[#FF9C00]" />
            <p className="text-sm lg:text-base">{ride.driver.rating}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
