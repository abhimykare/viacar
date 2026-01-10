import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { FaStar } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface RideItemProps {
  ride: {
    rideId: number;
    pickup_stop: {
      id: number;
      address: string;
      lat: string;
      lng: string;
      time: string;
      walking_distance_km: number;
    };
    drop_stop: {
      id: number;
      address: string;
      lat: string;
      lng: string;
      time: string;
      walking_distance_km: number;
    };
    rideAmount: {
      id: number;
      amount: string;
      distance_km: string;
      duration_minutes: number;
    };
    available_seats: number;
    driver: {
      id: number;
      name: string;
      avg_rating: string;
      profile_image: string | null;
    };
    vehicle: {
      id: number;
      brand: number;
      color: string;
    };
  };
}

export default function RideItem({ ride }: RideItemProps) {
  const { t } = useTranslation("translation", {
    keyPrefix: "components.ride_item",
  });

  // Format time for display (HH:MM format from API)
  const formatTime = (timeString: string) => {
    // Time is already in HH:MM:SS format from API
    return timeString.substring(0, 5); // Get HH:MM
  };

  // Format currency
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(numPrice);
  };

  // Parse driver name
  const driverName = ride.driver.name || 'Unknown Driver';

  return (
    <Link to={`/ride-details?rideId=${ride.rideId}&rideAmountId=${ride.rideAmount.id}`}>
      <Card className="p-6 rounded-[1.25rem] shadow-[0px_0px_7px_0px_rgba(0,0,0,0.07)]">
        <div className="grid grid-cols-[1fr_auto] justify-center gap-4">
          <div className="grid grid-cols-[auto_auto_1fr] items-center justify-center gap-x-4 gap-y-4 relative col-span-2 sm:col-span-1">
            <p className="absolute top-0 bottom-0 left-0 text-[0.625rem] text-[#666666] flex items-center pl-1">
              {parseFloat(ride.rideAmount.distance_km).toFixed(1)} km
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal">
              {formatTime(ride.pickup_stop.time)}
            </p>
            <img
              className="col-start-2 col-end-3 row-start-1 row-end-3 w-full h-full object-contain max-w-[26px]"
              src="/assets/direction.svg"
              alt=""
            />
            <p className="text-base lg:text-[1.3rem] font-normal truncate">
              {ride.pickup_stop.address}
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal">
              {formatTime(ride.drop_stop.time)}
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal truncate">
              {ride.drop_stop.address}
            </p>
          </div>
          <p className="text-lg lg:text-[1.5rem] text-[#00665A] font-medium">
            {formatPrice(ride.rideAmount.amount)}
          </p>
          <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent col-span-2" />
          <div className="flex items-center gap-2 col-span-2">
            <Avatar className="size-[38px]">
              <AvatarImage src={ride.driver.profile_image || "https://github.com/shadcn.png"} alt={driverName} />
              <AvatarFallback>{driverName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <p className="text-base lg:text-lg px-2">
              {driverName}
            </p>
            <FaStar className="fill-[#FF9C00]" />
            <p className="text-sm lg:text-base">{parseFloat(ride.driver.avg_rating).toFixed(1)}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
