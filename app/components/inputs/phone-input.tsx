import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import isoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

isoCountries.registerLocale(enLocale);

// Helper: Convert a country code (e.g., "US") into its flag emoji.
function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

type Country = {
  code: string; // Calling code (e.g. "+1")
  name: string; // Full country name (e.g. "United States")
  // flag: string; // Flag emoji (e.g. 🇺🇸)
  iso: CountryCode; // ISO code (e.g. "US")
};

const countries: Country[] = getCountries().map((country) => ({
  code: `+${getCountryCallingCode(country)}`,
  name: isoCountries.getName(country, "en") || country,
  flag: getFlagEmoji(country),
  iso: country,
}));

interface PhoneInputProps {
  value?: string;
  defaultCountryCode?: CountryCode;
  onChange?: (phone: string, countryCode: CountryCode) => void;
  label?: string;
  className?: string;
  placeholder?: string;
}

export function PhoneInput({
  value = "",
  defaultCountryCode = "SA",
  onChange,
  label = "Phone Number",
  className = "",
  placeholder = "00 00 00 00 00",
}: PhoneInputProps) {
  const [phone, setPhone] = useState(value);
  const [countryCode, setCountryCode] =
    useState<CountryCode>(defaultCountryCode);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (onChange) {
      onChange(phone, countryCode);
    }
  }, [phone, countryCode, onChange]);

  const formatPhoneNumber = (value: string) => {
    const parsedNumber = parsePhoneNumberFromString(value, countryCode);
    return parsedNumber
      ? parsedNumber.formatNational()
      : value.replace(/[^0-9]/g, "");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setPhone(formattedValue);
  };

  // Filter the list of countries by full country name.
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountry = countries.find((c) => c.iso === countryCode);

  return (
    <div className={`text-base font-light ${className}`}>
      {label && <Label className="text-base lg:text-lg font-normal mb-2">{label}</Label>}
      <div dir="ltr" className="flex border border-[#F5F5F5] rounded-full overflow-hidden">
        <DropdownMenu>
          <DropdownMenuTrigger disabled asChild>
            <button className="py-1 lg:py-2 px-2 lg:px-4 h-12 flex items-center justify-center gap-2.5 border-0 rounded-full bg-[#F5F5F5] cursor-pointer focus:ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 !outline-0 max-lg:aspect-square">
              {selectedCountry ? (
                <span className="flex items-center justify-center size-7 rounded-full overflow-hidden">
                  <ReactCountryFlag
                    className="scale-[250%]"
                    countryCode={selectedCountry.iso}
                    svg
                  />
                </span>
              ) : (
                "Code"
              )}
              <ChevronDown className="min-w-5 w-3 hidden" color="#666666" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="pt-0">
            <div className="flex flex-col">
              {/* Sticky search input that stops propagation of mouse down and click events */}
              {/* <div
                className="sticky top-0 z-10 bg-white p-2"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div> */}
              {/* Scrollable country list */}
              <ScrollArea className="max-h-[200px]">
                {filteredCountries.map((country) => (
                  <DropdownMenuItem
                    key={country.iso} // Use the unique ISO code as the key
                    onClick={() => {
                      setCountryCode(country.iso);
                      setSearchTerm("");
                    }}
                  >
                    <span className="flex items-center space-x-2">
                      <ReactCountryFlag
                        className="scale-125"
                        countryCode={country.iso}
                        svg
                      />
                      <span>{country.name}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Div showing the calling code (e.g., "+1") */}
        <div className="h-12 px-3 flex items-center bg-white">
          {selectedCountry ? selectedCountry.code : ""}
        </div>
        <Input
          type="tel"
          placeholder={placeholder}
          value={phone}
          onChange={handlePhoneChange}
          className="flex-1 shadow-none border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 font-light !text-base"
        />
      </div>
    </div>
  );
}

export default PhoneInput;
