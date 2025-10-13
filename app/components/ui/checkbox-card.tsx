import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { BatteryCharging, Ruler } from "lucide-react";
import { PiUsersBold } from "react-icons/pi";
import { FaCheck, FaWheelchair } from "react-icons/fa6";
import { LuClock } from "react-icons/lu";
import { IoPawOutline } from "react-icons/io5";
import { PiCigarette } from "react-icons/pi";
import { BsSnow } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import { useRideSearchStore } from "~/lib/store/rideSearchStore";

const options = [
  {
    key: "max_passengers",
    value: "max2",
    count: 40,
    icon: PiUsersBold,
    defaultChecked: true,
  },
  {
    key: "instant_booking",
    value: "instantBooking",
    count: 40,
    icon: LuClock,
    defaultChecked: true,
  },
  {
    key: "smoking_allowed",
    value: "smoking",
    count: 40,
    icon: PiCigarette,
    defaultChecked: true,
  },
  {
    key: "pets_allowed",
    value: "pets",
    count: 40,
    icon: IoPawOutline,
  },
  {
    key: "power_outlets",
    value: "power",
    count: 40,
    icon: BatteryCharging,
  },
  {
    key: "air_conditioning",
    value: "ac",
    count: 40,
    icon: BsSnow,
  },
  {
    key: "accessible",
    value: "disability",
    count: 40,
    icon: FaWheelchair,
  },
];

const CheckboxCard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  
  const { filters, setMax2InBack, setInstantBooking, setSmokingAllowed, setPetsAllowed, setPowerOutlets, setAirConditioning, setAccessibleForDisabled } = useRideSearchStore();

  const handleCheckboxChange = (value: string, checked: boolean) => {
    switch (value) {
      case "max2":
        setMax2InBack(checked);
        break;
      case "instantBooking":
        setInstantBooking(checked);
        break;
      case "smoking":
        setSmokingAllowed(checked);
        break;
      case "pets":
        setPetsAllowed(checked);
        break;
      case "power":
        setPowerOutlets(checked);
        break;
      case "ac":
        setAirConditioning(checked);
        break;
      case "disability":
        setAccessibleForDisabled(checked);
        break;
    }
  };

  return (
    <div className="w-full max-w-sm grid grid-cols-1 gap-3">
      {options.map((option) => (
        <CheckboxPrimitive.Root
          key={option.value}
          checked={filters[option.value as keyof typeof filters] as boolean}
          onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
          className={cn(
            "relative text-sm font-normal ring-[1px] ring-[#C3C3C3] rounded-lg px-4 py-0 min-h-[55px] text-start text-muted-foreground data-[state=checked]:bg-[#FF4848] data-[state=checked]:ring-[#FF4848] data-[state=checked]:text-white cursor-pointer flex items-center justify-between gap-2.5",
            isRTL && "text-right"
          )}
        >
          <span className="font-medium tracking-tight">
            {t(`search.ride.filters.${option.key}`)}
          </span>
          <div
            className={cn(
              "flex items-center gap-2.5",
              isRTL && "flex-row-reverse"
            )}
          >
            <span className="font-medium tracking-tight">{option.count}</span>
            <option.icon className="size-[22px]" />
            <CheckboxPrimitive.Indicator className="">
              <FaCheck className="text-primary-foreground size-[22px]" />
            </CheckboxPrimitive.Indicator>
          </div>
        </CheckboxPrimitive.Root>
      ))}
    </div>
  );
};

export default CheckboxCard;
