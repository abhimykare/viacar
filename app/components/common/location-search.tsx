import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { locations } from "~/constants/locations";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronRight, MapPin, Search } from "lucide-react";
import CloseIcon from "../icons/close-icon";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface Props {
  label?: string;
  name: string;
  path: string;
  sectionName: string;
  sectionTitle: string;
}

function LocationSearch({
  label,
  name,
  path,
  sectionName,
  sectionTitle,
}: Props) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(name) || "";

  // If a URL param exists, initialize the input with the matching label.
  const initialLabel =
    locations.find((loc) => loc.value === initialValue)?.label || "";

  const [searchValue, setSearchValue] = useState<string>(initialLabel);
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Create a map for quick lookup of labels.
  const labels = useMemo(() => {
    return locations.reduce((acc, item) => {
      acc[item.value] = item.label;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  // Update URL search param.
  const updateSearchParam = (value: string) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev as any);
        newParams.set(name, value);
        return newParams;
      },
      { replace: true }
    );
  };

  // When the user types, update the input and clear any previous selection.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (selectedValue) {
      setSelectedValue("");
      updateSearchParam("");
    }
  };

  const filteredLocations = useMemo(() => {
    if (!searchValue) return locations;
    return locations.filter((location) =>
      t(location.label).toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, t]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  // When an item is selected, update the selected state and URL.
  const onSelectItem = (value: string) => {
    setSelectedValue(value);
    const labelText = labels[value] || value;
    setSearchValue(labelText);
    updateSearchParam(value);
    setOpen(false);
  };

  // Reset selection.
  const reset = () => {
    setSelectedValue("");
    setSearchValue("");
    updateSearchParam("");
  };

  // Hide the list after a short delay (to allow clicks to register).
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  // Sync state with URL params when they change externally.
  useEffect(() => {
    const paramValue = searchParams.get(name) || "";
    if (paramValue !== selectedValue) {
      setSelectedValue(paramValue);
      const newLabel =
        locations.find((loc) => loc.value === paramValue)?.label || "";
      setSearchValue(newLabel);
    }
  }, [searchParams, name, selectedValue]);

  return (
    <div className="relative">
      <span className="text-[17px] text-[#939393] font-light">
        {t(label || "")}
      </span>
      <div className="max-w-[827px] mx-auto flex items-center relative mb-12">
        <Search className="absolute left-5 my-auto size-[30px]" color="black" />
        <Input
          name="search"
          value={t(searchValue)}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={onInputBlur}
          placeholder={t("locations.search_placeholder")}
          autoComplete="off"
          className={cn(
            "text-lg font-light placeholder:text-[#666666] bg-white border-0 h-[60px] rounded-full !ring-1 !ring-ring/5 pl-16 shadow-md"
          )}
        />
      </div>
      {open && !selectedValue && (
        <ScrollArea className="max-w-[827px] mx-auto z-10 bg-white w-full mt-1 h-[400px] rounded-lg">
          <div className="divide-y divide-[#CDCDCD] divide-dashed px-4 py-2">
            {isLoading ? (
              <div className="p-1">
                <Skeleton className="h-6 w-full" />
              </div>
            ) : filteredLocations.length > 0 ? (
              filteredLocations.map((option) => (
                <div className="flex flex-col">
                  <div
                    key={option.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelectItem(option.value)}
                    className="cursor-pointer px-6 py-5 hover:bg-gray-100 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <p className="text-sm">{t(option.label)}</p>
                      <p className="text-xs font-light">{t(option.desc)}</p>
                    </div>
                    <ChevronRight color="#AAAAAA" />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-sm text-gray-500">
                {t("locations.no_items")}
              </div>
            )}
          </div>
        </ScrollArea>
      )}
      {selectedValue && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="bg-[#F3F5F9] rounded-2xl">
            <div className="px-6 lg:px-14 py-4 lg:py-10">
              <p className="text-base text-[#666666] font-light">
                {t(sectionName)}
              </p>
              <p className="text-2xl lg:text-[2.188rem] leading-[120%] mb-10">
                {t(sectionTitle)}
              </p>
              <div className="bg-white border border-[#EBEBEB] rounded-full h-[60px] w-full flex items-center gap-4 px-6 mb-6  max-lg:max-w-[500px] max-lg:mx-auto">
                <img
                  className="size-[30px]"
                  src="/assets/location-man.svg"
                  alt=""
                />
                <p className="text-base text-[#263238]">
                  {t(labels[selectedValue])}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={reset}
                  className="text-blue-500 underline ml-auto cursor-pointer"
                >
                  <CloseIcon className="size-[20px]" color="#B5B4B4" />
                </Button>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 max-lg:max-w-[500px] max-lg:mx-auto">
                <Button
                  variant="outline"
                  className="border-[#EBEBEB] bg-transparent shadow-none rounded-full h-[55px] w-full lg:w-[286px] text-lg text-[#3C3F4E] font-normal"
                >
                  <MapPin />
                  <span>{t("locations.why_exact_location")}</span>
                </Button>
                <Button
                  className="bg-[#FF4848] rounded-full w-full lg:w-[228px] h-[55px] cursor-pointer text-xl font-normal"
                  asChild
                >
                  <Link to={path}>{t("locations.continue")}</Link>
                </Button>
              </div>
            </div>
            <img
              className="rounded-b-2xl w-full"
              src="/assets/flag-map.svg"
              alt=""
            />
          </div>
          <div className="rounded-2xl decoration-0 overflow-hidden w-full h-full">
            <img
              className=" w-full h-full"
              src="/assets/map-select.png"
              alt=""
            />
            {/* <div id="embed-map-display" className="h-full w-full">
              <iframe
                className="h-full w-full border-0"
                src="https://www.google.com/maps/embed/v1/place?q=saudi+aradia&key="
              ></iframe>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
export default LocationSearch;
