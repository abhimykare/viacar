import { useState, useEffect, useCallback } from "react";
import { AutoComplete } from "./auto-complete";
import { Search } from "lucide-react";
import { api } from "~/lib/api";
import { useRideSearchStore } from "~/lib/store/rideSearchStore";

interface PlacePrediction {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
  lat: number;
  lng: number;
}

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  initialLocation?: string | null;
}

function LocationSelect({
  label,
  name,
  placeholder = "Search location...",
  initialLocation,
}: Props) {
  // Get store actions and state
  const { setLeavingFrom, setGoingTo, leavingFrom, goingTo } = useRideSearchStore();
  
  // Get current location data from store based on name prop
  const currentLocation = name === "from" ? leavingFrom : goingTo;
  const currentText = currentLocation?.text || "";
  
  // Initialize both states based on the store.
  const [selectedValue, setSelectedValue] = useState<string>(currentText);
  const [searchValue, setSearchValue] = useState<string>(currentText);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);

  useEffect(() => {
    if (initialLocation && !currentText) {
      setSelectedValue(initialLocation);
      setSearchValue(initialLocation);
    }
  }, [initialLocation]);

  // Sync both states if the store changes externally.
  useEffect(() => {
    if (currentText !== selectedValue || currentText !== searchValue) {
      setSelectedValue(currentText);
      setSearchValue(currentText);
    }
  }, [currentText]);

  // When the search input is cleared, remove the selection from store.
  useEffect(() => {
    if (searchValue === "" && selectedValue !== "") {
      setSelectedValue("");
      if (name === "from") {
        setLeavingFrom(null);
      } else {
        setGoingTo(null);
      }
    }
  }, [searchValue, selectedValue, name, setLeavingFrom, setGoingTo]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchValue.length > 0) {
        try {
          const response = await api.placesAutocomplete({
            input: searchValue,
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching autocomplete suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    const handler = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  // Handler when a value is selected from the autocomplete.
  const handleSelectedValueChange = useCallback(
    (value: string) => {
      const selectedItem = suggestions.find((item) => item.placeId === value);
      const textToSet = selectedItem ? selectedItem.text : value;
      setSelectedValue(textToSet);
      setSearchValue(textToSet);
      
      if (value === "") {
        // Clear selection
        if (name === "from") {
          setLeavingFrom(null);
        } else {
          setGoingTo(null);
        }
      } else if (selectedItem) {
        // Store full location data in store
        const locationData = {
          placeId: selectedItem.placeId,
          text: selectedItem.text,
          mainText: selectedItem.mainText,
          secondaryText: selectedItem.secondaryText,
          lat: selectedItem.lat,
          lng: selectedItem.lng,
        };
        
        if (name === "from") {
          setLeavingFrom(locationData);
        } else {
          setGoingTo(locationData);
        }
      }
    },
    [suggestions, name, setLeavingFrom, setGoingTo]
  );

  return (
    <div className="max-lg:w-full">
      <span className="text-[17px] text-[#939393] font-light max-lg:hidden">
        {label}
      </span>
      <div className="relative">
        <Search
          className="absolute top-0 bottom-0 left-5 my-auto size-[20px] lg:hidden"
          color="#4E4E58"
          strokeWidth={1}
        />
        <AutoComplete
          inputClassName="!text-base lg:!text-[17px] font-light lg:font-normal !ring-0 lg:border-0 pl-12 pr-6 lg:px-0 lg:max-w-[140px] max-lg:h-[50px] rounded-full lg:rounded-none w-full max-lg:mx-auto shadow-none placeholder:text-[#757478] max-lg:bg-[#F1F1F5] max-lg:border-0"
          selectedValue={selectedValue}
          onSelectedValueChange={handleSelectedValueChange}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          items={suggestions.map((item: any) => ({
            value: item.placeId,
            label: item.text,
            desc: item.secondaryText,
          }))}
          emptyMessage="No items found."
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default LocationSelect;
