import { useState, useEffect, useMemo } from "react";
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

interface Props {
  label?: string;
  name: string;
  path: string;
  sectionName: string;
  sectionTitle: string;
}

function VehicleSearch({
  label,
  name,
  path,
  sectionName,
  sectionTitle,
}: Props) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(name) || "";

  const [vehicleBrands, setVehicleBrands] = useState<any[]>([]);

  // If a URL param exists, initialize the input with the matching label.
  const initialLabel =
    vehicleBrands.find((loc) => loc.id.toString() === initialValue)?.name || "";

  const [searchValue, setSearchValue] = useState<string>(initialLabel);
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchVehicleBrands = async () => {
        setIsLoading(true);
        try {
          const response = await api.getVehicleBrands(searchValue);
          setVehicleBrands(response.data.brands);
        } catch (error) {
          console.error("Failed to fetch vehicle brands:", error);
          setVehicleBrands([]);
        } finally {
          setIsLoading(false);
        }
      };

      if (searchValue) {
        fetchVehicleBrands();
      } else {
        setVehicleBrands([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const labels = useMemo(() => {
    return vehicleBrands.reduce((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {} as Record<string, string>);
  }, [vehicleBrands]);

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

  // Filter vehicles based on the search value.
  const filteredLocations = vehicleBrands.filter((option) =>
    option.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // When an item is selected, update the selected state and URL.
  const onSelectItem = (value: string) => {
    setSelectedValue(value);
    const labelText = labels[value] || value;
    setSearchValue(labelText);
    updateSearchParam(value);
    setOpen(false);
    navigate(
      `/vehicle-category?selectedVehicleId=${value}&selectedVehicleName=${labelText}`
    );
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
        vehicleBrands.find((loc) => loc.id.toString() === paramValue)?.name ||
        "";
      setSearchValue(newLabel);
    }
  }, [searchParams, name, selectedValue, vehicleBrands]);

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
          placeholder="Enter the full address"
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
              <div className="flex flex-col px-4 py-2 gap-2">
                <div
                  key={option.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectItem(option.id.toString())}
                  className="cursor-pointer px-6 py-5 hover:bg-gray-100 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <p className="text-sm">{option.name}</p>
                  </div>
                  <ChevronRight color="#AAAAAA" />
                </div>
                <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-sm text-gray-500">No items.</div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}

export default VehicleSearch;
