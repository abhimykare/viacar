import { Link, useSearchParams } from "react-router";
import SwapIcon from "../icons/swap-icon";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import LocationSelect from "./location-select";
import PassengerSelect from "./passenger-select";
import SearchIcon from "../icons/share-icon";
import DatePicker from "./date-picker";
import { cn } from "~/lib/utils";
import { CirclePlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PublishRide({ className = "" }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();
  const handleLocationSwap = () => {
    const fromValue = searchParams.get("from") || "";
    const toValue = searchParams.get("to") || "";

    const newParams = new URLSearchParams(searchParams);
    newParams.set("from", toValue);
    newParams.set("to", fromValue);

    setSearchParams(newParams, { replace: true });
  };
  return (
    <div
      className={cn(
        className,
        "bg-white py-5 lg:py-0 max-lg:rounded-b-none rounded-2xl lg:rounded-full max-lg:px-4 max-w-[500px] lg:max-w-[1000px] w-full mx-auto flex lg:grid grid-cols-[1fr_36px_1fr_2px_1fr_auto] flex-col lg:flex-row gap-4 lg:gap-5 h-auto lg:h-[104px] lg:drop-shadow-lg",
        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
      )}
    >
      <div className="flex items-center h-full w-full">
        <LocationSelect
          label={t("search.ride.leaving_from")}
          name="from"
          placeholder={t("search.ride.select_pickup")}
        />
      </div>
      <div className="py-2 lg:py-5 grid grid-cols-1 grid-rows-1 max-lg:hidden max-w-[36px] w-full h-full">
        <Separator
          className="col-start-1 -col-end-1 row-start-1 -row-end-1 mx-auto"
          orientation="vertical"
        />
        <Button
          className="col-start-1 -col-end-1 row-start-1 -row-end-1 rounded-full my-auto cursor-pointer rotate-90 lg:rotate-0 max-lg:mx-auto"
          variant="outline"
          size="icon"
          onClick={handleLocationSwap}
        >
          <SwapIcon />
        </Button>
      </div>
      <div className="flex items-center h-full w-full">
        <LocationSelect
          label={t("search.ride.going_to")}
          name="to"
          placeholder={t("search.ride.select_dropoff")}
        />
      </div>
      <div className="py-0 lg:py-5 max-lg:hidden">
        <Separator
          className="col-start-1 -col-end-1 row-start-1 -row-end-1"
          orientation="vertical"
        />
      </div>
      <div className="flex items-center lg:max-w-[200px] w-full max-lg:mx-auto">
        <PassengerSelect />
      </div>
      <div className="flex items-center justify-center lg:ml-auto">
        <Button
          className="bg-[#FF4848] rounded-full w-[228px]  h-[50px] lg:h-[65px] cursor-pointer text-xl font-normal max-lg:w-full max-lg:text-xl max-lg:font-normal"
          asChild
        >
          <Link
            to={{
              pathname: `/pickup`,
              search: searchParams.toString(),
            }}
          >
            <CirclePlus
              className="size-[20px] lg:size-[26px] hidden lg:block"
              color="white"
            />
            <span>{t("publish_comment.publish_ride")}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
