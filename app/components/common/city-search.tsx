import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { BiSearch } from "react-icons/bi";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "~/lib/api";

interface Props {
  label?: string;
  name: string;
  onSelect?: (city: any) => void;
}

function CitySearch({ label, name, onSelect }: Props) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(name) || "";

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);

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
    console.log("Input changed to:", value);
    setSearchValue(value);
    if (selectedValue) {
      setSelectedValue("");
      updateSearchParam("");
    }

    // Fetch autocomplete results if value is not empty
    if (value.trim()) {
      console.log("Fetching autocomplete for:", value);
      fetchAutocompleteResults(value);
    } else {
      console.log("Clearing autocomplete results");
      setAutocompleteResults([]);
    }
  };

  const fetchAutocompleteResults = async (input: string) => {
    setIsLoading(true);
    try {
      const response = await api.placesAutocomplete({ input });
      console.log("Autocomplete API response:", response);

      // Handle different possible response structures
      let results = [];

      // Check if response.data exists and is an array (your current API format)
      if (Array.isArray(response.data)) {
        results = response.data;
      }
      // Check if response is an array directly
      else if (Array.isArray(response)) {
        results = response;
      }
      // Check if response.data.data exists and is an array
      else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        results = response.data.data;
      }
      // Check if data.predictions exists and is an array
      else if (
        response.data &&
        response.data.predictions &&
        Array.isArray(response.data.predictions)
      ) {
        results = response.data.predictions;
      }
      // If response.data is an object with the structure we expect, wrap it in an array
      else if (response.data && (response.data.placeId || response.data.text)) {
        results = [response.data];
      }

      console.log("Processed autocomplete results:", results);
      setAutocompleteResults(results);
    } catch (error) {
      console.error("Failed to fetch autocomplete results:", error);
      // Clear autocomplete results on error to fall back to empty state
      setAutocompleteResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLocations = useMemo(() => {
    // If we have autocomplete results, use them
    console.log("Processing autocomplete results:", autocompleteResults);
    if (autocompleteResults.length > 0) {
      const processed = autocompleteResults.map((result: any) => ({
        value: result.placeId || result.place_id,
        label:
          result.mainText ||
          result.main_text ||
          result.text ||
          result.description,
        desc: result.secondaryText || result.secondary_text || "",
        place_id: result.placeId || result.place_id,
        lat: result.lat,
        lng: result.lng,
        main_text: result.mainText || result.main_text,
        secondary_text: result.secondaryText || result.secondary_text,
        description: result.text || result.description,
      }));
      console.log("Processed locations:", processed);
      return processed;
    }

    // Return empty array if no search value or results
    return [];
  }, [autocompleteResults]);

  // Debug log for filtered locations
  useEffect(() => {
    console.log("Filtered locations:", filteredLocations);
    console.log("Open state:", open);
    console.log("Is loading:", isLoading);
  }, [filteredLocations, open, isLoading]);

  // When an item is selected, update the state, URL, and call onSelect.
  const onSelectItem = (value: string, locationData?: any) => {
    setSelectedValue(value);
    const labelText = locationData?.main_text || locationData?.label || value;
    const fullAddress =
      locationData?.description || locationData?.secondary_text || labelText;
    setSearchValue(labelText);
    updateSearchParam(value);
    if (onSelect) {
      // Pass complete location data including coordinates
      onSelect({
        placeId: locationData?.place_id || value,
        name: labelText,
        address: fullAddress,
        lat: locationData?.lat || 0,
        lng: locationData?.lng || 0,
      });
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
      setSearchValue("");
    }
  }, [searchParams, name, selectedValue]);

  return (
    <div className="w-full">
      {label && (
        <span className="text-[17px] text-[#939393] font-light mb-2 block">
          {label}
        </span>
      )}
      <div className="w-full flex items-center relative mb-4">
        <BiSearch
          className="absolute left-5 my-auto z-10"
          color="black"
          size={20}
        />
        <Input
          name="search"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => {
            console.log("Input focused, opening dropdown");
            setOpen(true);
          }}
          onBlur={onInputBlur}
          placeholder={t("locations.search_placeholder")}
          autoComplete="off"
          className={cn(
            "text-lg font-light placeholder:text-[#666666] bg-white border-0 h-[60px] rounded-full !ring-0 pl-16 w-full"
          )}
        />
      </div>
      {open && (
        <ScrollArea className="z-50 bg-white w-full h-[350px] rounded-lg shadow-lg border border-gray-200">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-6 w-full" />
            </div>
          ) : filteredLocations.length > 0 ? (
            filteredLocations.map((option) => (
              <div key={option.value} className="flex flex-col px-4 py-2 gap-2">
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectItem(option.value, option)}
                  className="cursor-pointer px-6 py-5 hover:bg-gray-100 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-900">{option.label}</p>
                    <p className="text-xs font-light text-gray-600">
                      {option.desc}
                    </p>
                  </div>
                  <ChevronRight color="#AAAAAA" />
                </div>
                <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
              </div>
            ))
          ) : searchValue.trim() ? (
            <div className="px-6 py-4 text-sm text-gray-500">
              {t("locations.no_items")}
            </div>
          ) : null}
        </ScrollArea>
      )}
    </div>
  );
}

export default CitySearch;
