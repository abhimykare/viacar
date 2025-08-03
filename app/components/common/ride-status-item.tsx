import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { FaStar } from "react-icons/fa6";
import { RxDownload } from "react-icons/rx";

export default function RideStatusItem() {
  const { t } = useTranslation();

  return (
    <Card className="p-6 rounded-[1.25rem] shadow-[0px_0px_7px_0px_rgba(0,0,0,0.07)] border-0">
      <div className="flex items-center justify-between">
        <p className="text-xl">{t("your_rides.ride_status.date")}</p>
        <div className="flex items-center gap-2">
          <img src="/assets/tick-green.svg" alt="" />
          <span className="text-base text-[#15CF74] font-light">
            {t("your_rides.ride_status.completed")}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] justify-center gap-4">
        <div className="grid grid-cols-[auto_19px_1fr] items-center justify-center gap-x-4 gap-y-4 relative max-lg:col-span-2">
          <p className="absolute top-0 bottom-0 left-0 text-[0.625rem] text-[#666666] flex items-center pl-1">
            4h 40m
          </p>
          <p className="text-base font-normal">
            {t("your_rides.ride_status.pickup_time")}
          </p>
          <img
            className="col-start-2 col-end-3 row-start-1 row-end-3 w-full h-full object-contain"
            src="/assets/direction.svg"
            alt=""
          />
          <p className="text-base font-normal">
            {t("your_rides.ride_status.pickup_address")}
          </p>
          <p className="text-base font-normal">
            {t("your_rides.ride_status.drop_time")}
          </p>
          <p className="text-base font-normal">
            {t("your_rides.ride_status.drop_address")}
          </p>
        </div>
        <p className="text-lg text-[#00665A] font-medium max-lg:col-span-2">
          {t("your_rides.ride_status.price")}
        </p>
        <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent col-span-2" />
        <div className="flex items-center gap-2 col-span-2">
          <Avatar className="size-[38px]">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-lg px-2">
            {t("your_rides.ride_status.passenger_name")}
          </p>
          <FaStar className="fill-[#FF9C00]" />
          <p className="text-base">{t("your_rides.ride_status.rating")}</p>
          <Link to={``} className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-light">
              {t("your_rides.ride_status.invoice")}
            </span>
            <RxDownload />
          </Link>
        </div>
      </div>
    </Card>
  );
}
