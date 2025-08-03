import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { FaStar } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export default function RideItem() {
  const { t } = useTranslation("translation", {
    keyPrefix: "components.ride_item",
  });

  return (
    <Link to={`/ride-details`}>
      <Card className="p-6 rounded-[1.25rem] shadow-[0px_0px_7px_0px_rgba(0,0,0,0.07)]">
        <div className="grid grid-cols-[1fr_auto] justify-center gap-4">
          <div className="grid grid-cols-[auto_auto_1fr] items-center justify-center gap-x-4 gap-y-4 relative col-span-2 sm:col-span-1">
            <p className="absolute top-0 bottom-0 left-0 text-[0.625rem] text-[#666666] flex items-center pl-1">
              {t("duration")}
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal">
              {t("departure_time")}
            </p>
            <img
              className="col-start-2 col-end-3 row-start-1 row-end-3 w-full h-full object-contain max-w-[26px]"
              src="/assets/direction.svg"
              alt=""
            />
            <p className="text-base lg:text-[1.3rem] font-normal">
              {t("departure_location")}
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal">
              {t("arrival_time")}
            </p>
            <p className="text-base lg:text-[1.3rem] font-normal">
              {t("arrival_location")}
            </p>
          </div>
          <p className="text-lg lg:text-[1.5rem] text-[#00665A] font-medium">
            {t("price")}
          </p>
          <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent col-span-2" />
          <div className="flex items-center gap-2 col-span-2">
            <Avatar className="size-[38px]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-base lg:text-lg px-2">{t("driver_name")}</p>
            <FaStar className="fill-[#FF9C00]" />
            <p className="text-sm lg:text-base">{t("rating")}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
