import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { api } from "~/lib/api";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronRight, MapPin, Search } from "lucide-react";
import CloseIcon from "../icons/close-icon";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { createLocationMap, GoogleMapService } from "~/lib/googlemap";

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapServiceRef = useRef<GoogleMapService | null>(null);

  // If a URL param exists, initialize the input with the matching label.
  const initialLabel = ""; // Will be updated by API call or kept empty until selection

  const [searchValue, setSearchValue] = useState<string>(initialLabel);
  const [debouncedSearchValue, setDebouncedSearchValue] =
    useState<string>(initialLabel);
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExactLocationMode, setIsExactLocationMode] = useState(false);

  const labels = useMemo(() => {
    return suggestions.reduce((acc, item) => {
      acc[item.placeId] = item.text;
      return acc;
    }, {} as Record<string, string>);
  }, [suggestions]);

  const updateSearchParam = (value: string, lat?: number, lng?: number, address?: string) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev as any);
        newParams.set(name, value);
        if (lat !== undefined) newParams.set(`${name}_lat`, lat.toString());
        if (lng !== undefined) newParams.set(`${name}_lng`, lng.toString());
        if (address !== undefined) newParams.set(`${name}_address`, address);
        return newParams;
      },
      { replace: true }
    );
  };

  // Debounce search value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  // Fetch suggestions when debouncedSearchValue changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchValue) {
        setIsLoading(true);
        try {
          const response = await api.placesAutocomplete({
            input: debouncedSearchValue,
          });
          setSuggestions(response.data || []);
        } catch (error) {
          console.error(
            "Error fetching places autocomplete suggestions:",
            error
          );
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchValue]);

  // When the user types, update the input and clear any previous selection.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (selectedValue) {
      setSelectedValue("");
      updateSearchParam("");
    }
    setOpen(true);
  };

  // When an item is selected, update the selected state and URL.
  const onSelectItem = (
    placeId: string,
    text: string,
    lat: number,
    lng: number
  ) => {
    setSelectedValue(placeId);
    setSearchValue(text);
    updateSearchParam(placeId, lat, lng, text);
    setOpen(false);
  };

  // Reset selection.
  const reset = () => {
    setSelectedValue("");
    setSearchValue("");
    updateSearchParam("");
    // Also clear lat/lng and address params
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev as any);
        newParams.delete(`${name}_lat`);
        newParams.delete(`${name}_lng`);
        newParams.delete(`${name}_address`);
        return newParams;
      },
      { replace: true }
    );
    // Reset map state
    if (mapServiceRef.current) {
      mapServiceRef.current.destroy();
      mapServiceRef.current = null;
    }
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
      // We need to fetch the label for the paramValue if it's not in suggestions
      // For now, we'll just set it to the paramValue itself or empty
      const newLabel = labels[paramValue] || "";
      setSearchValue(newLabel);
    }
  }, [searchParams, name, selectedValue, labels]);

  // Initialize Google Map when location is selected or exact location mode changes
  useEffect(() => {
    const initializeMap = async () => {
      if (selectedValue && mapContainerRef.current) {
        try {
          const lat = parseFloat(searchParams.get(`${name}_lat`) || "0");
          const lng = parseFloat(searchParams.get(`${name}_lng`) || "0");
          const address = searchParams.get(`${name}_address`) || "";

          if (lat && lng) {
            // Destroy existing map if any
            if (mapServiceRef.current) {
              mapServiceRef.current.destroy();
            }

            // Create new map with single marker
            mapServiceRef.current = await createLocationMap(
              { lat, lng, address },
              "location-map",
              isExactLocationMode ? handleMapClick : undefined,
              "400px"
            );

            // Add draggable marker for exact location mode
            if (isExactLocationMode && mapServiceRef.current) {
              // Remove any existing instruction
              const existingInstruction = document.getElementById('map-instruction');
              if (existingInstruction) {
                existingInstruction.remove();
              }

              // Add draggable marker
              mapServiceRef.current.addDraggableMarker(
                { lat, lng, address },
                (newLat, newLng) => {
                  // Handle drag end - update location
                  handleMarkerDragEnd(newLat, newLng);
                }
              );

              // Add instruction overlay
              if (mapContainerRef.current && !document.getElementById('map-instruction')) {
                const instructionDiv = document.createElement('div');
                instructionDiv.className = 'absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm z-10 shadow-lg';
                instructionDiv.textContent = t('locations.drag_marker_to_select');
                instructionDiv.id = 'map-instruction';
                mapContainerRef.current.appendChild(instructionDiv);
              }
            } else if (mapServiceRef.current) {
              // Remove draggable marker if exists
              mapServiceRef.current.removeDraggableMarker();
              
              // Remove instruction if exists
              const existingInstruction = document.getElementById('map-instruction');
              if (existingInstruction) {
                existingInstruction.remove();
              }
            }
          }
        } catch (error) {
          console.error("Failed to initialize location map:", error);
        }
      }
    };

    initializeMap();

    return () => {
      if (mapServiceRef.current) {
        mapServiceRef.current.destroy();
        mapServiceRef.current = null;
      }
      // Clean up instruction
      const existingInstruction = document.getElementById('map-instruction');
      if (existingInstruction) {
        existingInstruction.remove();
      }
    };
  }, [selectedValue, name, searchParams, isExactLocationMode]);

  // Handle map click to select location
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    try {
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          const placeId = results[0].place_id || `${lat},${lng}`;
          
          // Update state and URL
          setSelectedValue(placeId);
          setSearchValue(address);
          updateSearchParam(placeId, lat, lng, address);
          
          // Reinitialize map with new coordinates
          if (mapServiceRef.current) {
            mapServiceRef.current.destroy();
          }
        }
      });
    } catch (error) {
      console.error("Failed to handle map click:", error);
    }
  };

  // Handle marker drag end to select exact location
  const handleMarkerDragEnd = async (lat: number, lng: number) => {
    try {
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          const placeId = results[0].place_id || `${lat},${lng}`;
          
          // Update state and URL
          setSelectedValue(placeId);
          setSearchValue(address);
          updateSearchParam(placeId, lat, lng, address);
          
          // Show success feedback
          const successDiv = document.createElement('div');
          successDiv.className = 'absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm z-10 shadow-lg';
          successDiv.textContent = t('locations.location_updated');
          successDiv.id = 'location-success';
          
          if (mapContainerRef.current) {
            mapContainerRef.current.appendChild(successDiv);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
              const existingSuccess = document.getElementById('location-success');
              if (existingSuccess) {
                existingSuccess.remove();
              }
            }, 3000);
          }
        }
      });
    } catch (error) {
      console.error("Failed to handle marker drag end:", error);
    }
  };

  return (
    <div className="relative ">
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
            ) : suggestions.length > 0 ? (
              suggestions.map((option) => (
                <div className="flex flex-col">
                  <div
                    key={option.placeId}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      onSelectItem(
                        option.placeId,
                        option.text,
                        option.lat,
                        option.lng
                      )
                    }
                    className="cursor-pointer px-6 py-5 hover:bg-gray-100 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <p className="text-sm">{option.mainText}</p>
                      <p className="text-xs font-light">
                        {option.secondaryText}
                      </p>
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
                  className={`border-[#EBEBEB] bg-transparent shadow-none rounded-full h-[55px] w-full lg:w-[286px] text-lg font-normal ${
                    isExactLocationMode 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'text-[#3C3F4E]'
                  }`}
                  onClick={() => setIsExactLocationMode(!isExactLocationMode)}
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
          <div className="rounded-2xl decoration-0 overflow-hidden w-full h-full relative">
            <div
              ref={mapContainerRef}
              id="location-map"
              className={`w-full h-full rounded-2xl border border-gray-200 ${
                isExactLocationMode ? 'ring-2 ring-blue-300 ring-opacity-50' : ''
              }`}
              style={{ minHeight: "400px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default LocationSearch;
