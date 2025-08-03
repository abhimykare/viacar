import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { AutoComplete } from "./auto-complete";
import { locations } from "~/constants/locations";
import { Search } from "lucide-react";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
}

function LocationSelect({
  label,
  name,
  placeholder = "Search location...",
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get(name) || "";

  // Initialize both states based on the URL.
  const [selectedValue, setSelectedValue] = useState<string>(paramValue);
  const [searchValue, setSearchValue] = useState<string>(paramValue);

  // Sync both states if the URL param changes externally.
  useEffect(() => {
    const newParamValue = searchParams.get(name) || "";
    if (newParamValue !== selectedValue || newParamValue !== searchValue) {
      setSelectedValue(newParamValue);
      setSearchValue(newParamValue);
    }
  }, [searchParams, name]);

  // When the search input is cleared, remove the selection and URL param.
  useEffect(() => {
    if (searchValue === "" && selectedValue !== "") {
      setSelectedValue("");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(name);
      setSearchParams(newParams, { replace: true });
    }
  }, [searchValue, selectedValue, name, searchParams, setSearchParams]);

  // Handler when a value is selected from the autocomplete.
  const handleSelectedValueChange = useCallback(
    (value: string) => {
      setSelectedValue(value);
      setSearchValue(value);
      const newParams = new URLSearchParams(searchParams);
      if (value === "") {
        newParams.delete(name);
      } else {
        newParams.set(name, value);
      }
      setSearchParams(newParams, { replace: true });
    },
    [name, searchParams, setSearchParams]
  );

  return (
    <div className="max-lg:w-full">
      <span className="text-[17px] text-[#939393] font-light max-lg:hidden">
        {label}
      </span>
      <div className="relative">
        <Search className="absolute top-0 bottom-0 left-5 my-auto size-[20px] lg:hidden" color="#4E4E58" strokeWidth={1} />
        <AutoComplete
          inputClassName="!text-base lg:!text-[17px] font-light lg:font-normal !ring-0 lg:border-0 pl-12 pr-6 lg:px-0 lg:max-w-[140px] max-lg:h-[50px] rounded-full lg:rounded-none w-full max-lg:mx-auto shadow-none placeholder:text-[#757478] max-lg:bg-[#F1F1F5] max-lg:border-0"
          selectedValue={selectedValue}
          onSelectedValueChange={handleSelectedValueChange}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          items={locations}
          emptyMessage="No items found."
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default LocationSelect;
