import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { locations } from "~/constants/locations";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { BiSearch } from "react-icons/bi";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  label?: string;
  name: string;
  onSelect?: (city: string) => void;
}

function CitySearch({ label, name, onSelect }: Props) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(name) || "";

  const initialLabel =
    locations.find((loc) => loc.value === initialValue)?.label || "";

  const [searchValue, setSearchValue] = useState<string>(initialLabel);
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const labels = useMemo(() => {
    return locations.reduce((acc, item) => {
      acc[item.value] = item.label;
      return acc;
    }, {} as Record<string, string>);
  }, []);

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

  // When an item is selected, update the state, URL, and call onSelect.
  const onSelectItem = (value: string) => {
    setSelectedValue(value);
    const labelText = labels[value] || value;
    setSearchValue(labelText);
    updateSearchParam(value);
    if (onSelect) {
      onSelect(t(labelText));
    }
    setOpen(false);
  };

  const reset = () => {
    setSelectedValue("");
    setSearchValue("");
    updateSearchParam("");
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setOpen(false);
    }, 150);
  };

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
      <span className="text-[17px] text-[#939393] font-light">{label}</span>
      <div className="max-w-[827px] mx-auto flex items-center relative mb-12">
        <BiSearch className="absolute left-5 my-auto" color="black" />
        <Input
          name="search"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={onInputBlur}
          placeholder={t("locations.search_placeholder")}
          autoComplete="off"
          className={cn(
            "text-lg font-light placeholder:text-[#666666] bg-white border-0 h-[60px] rounded-full !ring-0 pl-16"
          )}
        />
      </div>
      {open && (
        <ScrollArea className="max-w-[827px] mx-auto z-10 bg-white w-full mt-1 h-[400px] rounded-lg">
          {isLoading ? (
            <div className="p-1">
              <Skeleton className="h-6 w-full" />
            </div>
          ) : filteredLocations.length > 0 ? (
            filteredLocations.map((option) => (
              <div key={option.value} className="flex flex-col px-4 py-2 gap-2">
                <div
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
                <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-sm text-gray-500">
              {t("locations.no_items")}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}

export default CitySearch;
