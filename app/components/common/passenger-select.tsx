import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../ui/select";
import UserIcon from "../icons/user-icon";
import { useTranslation } from "react-i18next";

function PassengerSelect() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();     

  const [passengerCount, setPassengerCount] = useState<string>(() => {
    return searchParams.get("passengers") || "1";
  });

  useEffect(() => {
    const paramValue = searchParams.get("passengers") || "1";
    if (paramValue !== passengerCount) {
      setPassengerCount(paramValue);
    }
  }, [searchParams, passengerCount]);

  const handleValueChange = (value: string) => {
    setPassengerCount(value);
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("passengers", value);
        return newParams;
      },
      { replace: true }
    );
  };

  return (
    <Select value={passengerCount} onValueChange={handleValueChange}>
      <SelectTrigger className="border-0 shadow-none p-0 !ring-0 [&_.lucide]:hidden cursor-pointer max-lg:mx-auto max-lg:w-full max-lg:justify-between rounded-full max-lg:h-[50px] max-lg:!bg-[#F1F1F5]  pl-6 pr-2">
        <span className="text-[17px] text-[#282525] font-normal block lg:hidden">
          {t("search.ride.passengers.label")}
        </span>
        <span className="flex items-center justify-center gap-2 max-lg:bg-white max-lg:rounded-full h-[40px] px-6 min-w-[115px]">
          <UserIcon className="size-5 lg:size-6" />
          <SelectValue asChild>
            <span>
              <span className="block lg:hidden">
                {passengerCount || t("search.ride.passengers.placeholder")}
              </span>
              <span className="hidden lg:block">
                {passengerCount
                  ? `${passengerCount} ${t("search.ride.passengers.label")}${
                      Number(passengerCount) > 1 ? "s" : ""
                    }`
                  : t("search.ride.passengers.placeholder")}
              </span>
            </span>
          </SelectValue>
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("search.ride.passengers.placeholder")}</SelectLabel>
          <SelectItem value="1">
            1 {t("search.ride.passengers.label")}
          </SelectItem>
          <SelectItem value="2">
            2 {t("search.ride.passengers.label")}s
          </SelectItem>
          <SelectItem value="3">
            3 {t("search.ride.passengers.label")}s
          </SelectItem>
          <SelectItem value="4">
            4 {t("search.ride.passengers.label")}s
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default PassengerSelect;
