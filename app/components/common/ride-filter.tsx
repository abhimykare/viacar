import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { SwitchGreen } from "~/components/ui/switch-green";
import CheckboxCard from "~/components/ui/checkbox-card";
import { useTranslation } from "react-i18next";
import { useRideSearchStore } from "~/lib/store/rideSearchStore";
import { useEffect } from "react";

interface Props {
  className?: string;
}

export default function RideFilters({ className }: Props) {
  const { t } = useTranslation("translation", {
    keyPrefix: "components.ride_filter",
  });

  const {
    filters,
    setSortBy,
    setStopsFilter,
    setVerifiedDriversOnly,
    setMax2InBack,
    setInstantBooking,
    setSmokingAllowed,
    setPetsAllowed,
    setPowerOutlets,
    setAirConditioning,
    setAccessibleForDisabled,
    setCarModelYear,
    triggerSearch,
    clearFilters
  } = useRideSearchStore();

  // Trigger search when filters change
  useEffect(() => {
    triggerSearch();
  }, [filters, triggerSearch]);

  const handleClearSort = () => {
    setSortBy("earliest");
  };

  const handleClearStops = () => {
    setStopsFilter("direct");
  };

  const handleClearAmenities = () => {
    setMax2InBack(false);
    setInstantBooking(false);
    setSmokingAllowed(false);
    setPetsAllowed(false);
    setPowerOutlets(false);
    setAirConditioning(false);
    setAccessibleForDisabled(false);
  };

  const handleClearCarModel = () => {
    setCarModelYear("all");
  };

  return (
    <ScrollArea className={className}>
      <div className="flex flex-col w-full h-screen lg:h-full p-6 lg:p-12">
        <div className="flex items-center justify-between pb-4">
          <p className="text-[1.5rem] font-medium">{t("title")}</p>
          <Button
            className="text-[#898787] font-light cursor-pointer !px-0"
            variant="link"
            onClick={clearFilters}
          >
            {t("reset_all")} <X />
          </Button>
        </div>
        <div className="flex items-center justify-between pb-4">
          <p className="text-lg font-medium">{t("sort_by")}</p>
          <Button
            className="text-sm text-[#898787] font-light cursor-pointer p-0"
            variant="link"
            onClick={handleClearSort}
          >
            {t("clear_all")}
          </Button>
        </div>
        <RadioGroup 
          className="gap-6" 
          value={filters.sortBy}
          onValueChange={(value) => setSortBy(value)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="earliest"
                id="s1"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="s1"
              >
                {t("sort_options.earliest_departure")}
              </Label>
            </div>
            <img className="size-[18px]" src="/assets/time.svg" alt="" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="cheapest"
                id="s2"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="s2"
              >
                {t("sort_options.lowest_price")}
              </Label>
            </div>
            <img className="size-[18px]" src="/assets/coins.svg" alt="" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="closest_departure"
                id="s3"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="s3"
              >
                {t("sort_options.close_to_departure")}
              </Label>
            </div>
            <img className="size-[18px]" src="/assets/walk.svg" alt="" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="closest_arrival"
                id="s4"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="s4"
              >
                {t("sort_options.close_to_arrival")}
              </Label>
            </div>
            <img className="size-[18px]" src="/assets/walk.svg" alt="" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="shortest"
                id="s5"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="s5"
              >
                {t("sort_options.shortest_ride")}
              </Label>
            </div>
            <img className="size-[18px]" src="/assets/stopwatch.svg" alt="" />
          </div>
        </RadioGroup>
        <Separator className="my-10 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
        <div className="flex items-center justify-between pb-4">
          <p className="text-lg font-medium">{t("stops.title")}</p>
          <Button
            className="text-sm text-[#898787] font-light cursor-pointer p-0"
            variant="link"
            onClick={handleClearStops}
          >
            {t("clear_all")}
          </Button>
        </div>
        <RadioGroup 
          className="gap-6" 
          value={filters.stops}
          onValueChange={(value) => setStopsFilter(value)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="direct"
                id="n1"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="n1"
              >
                {t("stops.direct")}
              </Label>
            </div>
            <p className="text-sm text-[#999999] font-normal">40</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="one"
                id="n2"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="n2"
              >
                {t("stops.one_stop")}
              </Label>
            </div>
            <p className="text-sm text-[#999999] font-normal">5</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="two_plus"
                id="n3"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="n3"
              >
                {t("stops.two_plus_stops")}
              </Label>
            </div>
            <p className="text-sm text-[#999999] font-normal">25</p>
          </div>
        </RadioGroup>
        <Separator className="my-10 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
        <div className="flex items-center justify-between pb-4">
          <p className="text-lg font-medium">{t("trust.title")}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-normal" htmlFor="vp">
              {t("trust.verified_profile")}
            </Label>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-[#999999] font-normal">35</p>
            <SwitchGreen 
              checked={filters.verifiedProfile} 
              onCheckedChange={setVerifiedDriversOnly}
              id="vp" 
            />
          </div>
        </div>
        <Separator className="my-10 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
        <div className="flex items-center justify-between pb-4">
          <p className="text-lg font-medium">{t("amenities.title")}</p>
          <Button
            className="text-sm text-[#898787] font-light cursor-pointer p-0"
            variant="link"
            onClick={handleClearAmenities}
          >
            {t("clear_all")}
          </Button>
        </div>
        <CheckboxCard />
        <Separator className="my-10 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
        <div className="flex items-center justify-between pb-4">
          <p className="text-lg font-medium">{t("car_model.title")}</p>
          <Button
            className="text-sm text-[#898787] font-light cursor-pointer p-0"
            variant="link"
            onClick={handleClearCarModel}
          >
            {t("clear_all")}
          </Button>
        </div>
        <RadioGroup 
          className="gap-6" 
          value={filters.carModel}
          onValueChange={(value) => setCarModelYear(value)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="3_years"
                id="s1"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="s1"
              >
                {t("car_model.last_3_years")}
              </Label>
            </div>
            <p className="text-sm text-[#999999] font-normal">25</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="5_years"
                id="s2"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="s2"
              >
                {t("car_model.last_5_years")}
              </Label>
            </div>
            <p className="text-sm text-[#999999] font-normal">45</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="[&_svg]:fill-[#FF4848] [&_svg]:stroke-[#FF4848] [&_svg]:!size-[11px] size-[22px] border-2 border-[#999999]"
                value="all"
                id="s3"
              />
              <Label
                className="text-sm text-[#666666] font-normal"
                htmlFor="s3"
              >
                {t("car_model.all")}
              </Label>
            </div>
            <p className="text-sm text-[#999999] font-normal">70</p>
          </div>
        </RadioGroup>
      </div>
    </ScrollArea>
  );
}
