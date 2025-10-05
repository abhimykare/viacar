import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Input } from "../ui/input";
import { api } from "~/lib/api";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { BiSearch } from "react-icons/bi";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ChevronRight, MapPin } from "lucide-react";
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

function ModelSearch({ label, name, path, sectionName, sectionTitle }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(name) || "";
  const brandId = searchParams.get("selectedVehicleId");
  const categoryId = searchParams.get("selectedCategoryId");

  const [vehicleModels, setVehicleModels] = useState<
    { id: number; name: string }[]
  >([]);

  // If a URL param exists, initialize the input with the matching label.
  const initialLabel =
    vehicleModels.find((model) => model.id.toString() === initialValue)?.name || "";

  const [searchValue, setSearchValue] = useState<string>(initialLabel);
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Create a map for quick lookup of labels.
  const labels = useMemo(() => {
    return vehicleModels.reduce((acc, item) => {
      acc[item.id.toString()] = item.name;
      return acc;
    }, {} as Record<string, string>);
  }, [vehicleModels]);

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
      updateSearchParam(value);
    }
  };

  // Filter models based on the search value.
  const filteredLocations = vehicleModels.filter((option) =>
    option.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // When an item is selected, update the selected state and URL.
  const onSelectItem = (value: string) => {
    setSelectedValue(value);
    const labelText = labels[value] || value;
    setSearchValue(labelText);
    updateSearchParam(value);
    setOpen(false);
    navigate(`/vehicle-color?selectedVehicleId=${brandId}&selectedVehicleName=${searchParams.get("selectedVehicleName")}&selectedCategoryId=${categoryId}&selectedModelId=${value}&selectedModelName=${labelText}`);
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

  // Fetch vehicle models when searchValue, brandId, or categoryId changes
  useEffect(() => {
    clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await api.getVehicleModels(
          searchValue,
          brandId ? parseInt(brandId) : undefined,
          categoryId ? parseInt(categoryId) : undefined
        );
        setVehicleModels(response.data.models);
      } catch (error) {
        console.error("Failed to fetch vehicle models:", error);
        setVehicleModels([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [searchValue, brandId, categoryId]);

  // Sync state with URL params when they change externally.
  useEffect(() => {
    const paramValue = searchParams.get(name) || "";
    if (paramValue !== selectedValue) {
      setSelectedValue(paramValue);
      const newLabel =
        vehicleModels.find((model) => model.id.toString() === paramValue)?.name || "";
      setSearchValue(newLabel);
    }
  }, [searchParams, name, selectedValue, vehicleModels]);

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
          placeholder={t("add_vehicles.model.search_placeholder")}
          autoComplete="off"
          className={cn(
            "text-lg font-light placeholder:text-[#666666] bg-white border-0 h-[60px] rounded-full !ring-0 pl-16"
          )}
        />
      </div>
      {open && !selectedValue && (
        <ScrollArea className="max-w-[827px] mx-auto z-10 bg-white w-full mt-1 h-[400px] rounded-lg">
          {isLoading ? (
            <div className="p-1">
              <Skeleton className="h-6 w-full" />
            </div>
          ) : filteredLocations.length > 0 ? (
            filteredLocations.map((option) => (
              <div className="flex flex-col px-4 py-2 gap-2" key={option.id}>
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectItem(option.id.toString())}
                  className="cursor-pointer px-6 py-5 hover:bg-gray-100 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <p className="text-sm">
                      {option.name}
                    </p>
                  </div>
                  <ChevronRight color="#AAAAAA" />
                </div>
                <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-sm text-gray-500">
              {t("add_vehicles.model.no_items")}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}

export default ModelSearch;
