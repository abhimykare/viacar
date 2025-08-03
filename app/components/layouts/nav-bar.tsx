import { ChevronDown, CirclePlus } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import { useState } from "react";
import isoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import ReactCountryFlag from "react-country-flag";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import SearchGlobal from "~/components/common/search-global";
import RightArrowRounded from "~/components/icons/right-arrow-rounded";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

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

interface Props {
  variant?: "publisher";
  className?: string;
}

export default function NavBar({ variant, className = "" }: Props) {
  const { i18n, t } = useTranslation();
  const [countryCode, setCountryCode] = useState<CountryCode>("SA");
  const selectedCountry = countries.find((c) => c.iso === countryCode);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  return (
    <div
      className={cn(
        "flex items-center justify-between pt-4 lg:pt-10",
        className
      )}
    >
      <Link to="/">
        <img
          className="w-[60px] lg:w-[114px] h-[50px] lg:h-[84px] object-contain"
          src="/assets/logo-white.png"
          alt=""
        />
      </Link>
      <div className="flex items-center gap-5 lg:gap-7">
        <SearchGlobal />
        {variant !== "publisher" && (
          <Link
            to={`/publish`}
            className="font-alt text-base lg:text-xl font-normal lg:font-semibold rounded-full flex items-center border border-white px-3 lf:px-6 h-10 lg:h-12 gap-2 text-white cursor-pointer"
          >
            <CirclePlus className="h-[18px] lg:h-[26px]" color="white" />
            <span>{t("layout.header.publish_ride")}</span>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden sm:flex items-center justify-center gap-2.5 border border-white rounded-full h-10 lg:h-12 px-3 lg:px-6 cursor-pointer focus:ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 !outline-0">
              <span className="text-white text-base lg:text-xl font-alt">
                {languages.find((lang) => lang.code === i18n.language)?.flag}{" "}
                {i18n.language.toUpperCase()}
              </span>
              <ChevronDown className="h-[18px] lg:h-[26px] text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl py-2">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 cursor-pointer",
                  i18n.language === lang.code && "bg-gray-100"
                )}
                onClick={() => i18n.changeLanguage(lang.code)}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-base">{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative cursor-pointer outline-0">
              <Avatar className="size-[40px] lg:size-[50px]">
                <AvatarImage src="/assets/avatar-dummy.png" alt="avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="size-5 rounded-full absolute top-0 right-0 bg-[#EB2F36] flex items-center justify-center text-xs text-white">
                3
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl py-0">
            <div className="w-[320px] h-max px-4 py-0 divide-y divide-dashed">
              <DropdownMenuItem
                className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent"
                asChild
              >
                <Link to={`/your-rides`}>
                  <img
                    className="size-[20px]"
                    src="/assets/your-rides.png"
                    alt="your rides"
                  />
                  <p className="text-base font-normal">
                    {t("layout.navbar.your_rides")}
                  </p>
                  <div className="ml-auto flex items-center gap-4">
                    <RightArrowRounded className="size-[20px]" />
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent"
                asChild
              >
                <Link to={`/booking-request`}>
                  <img
                    className="size-[20px]"
                    src="/assets/message.svg"
                    alt="Booking request"
                  />
                  <p className="text-base font-normal">
                    {t("layout.navbar.message_request")}
                  </p>
                  <div className="ml-auto flex items-center gap-4">
                    <div className="size-[21px] rounded-full flex items-center justify-center text-xs text-white bg-[#EB2F36]">
                      3
                    </div>
                    <RightArrowRounded className="size-[20px]" />
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent"
                asChild
              >
                <Link to={`/inbox`}>
                  <img
                    className="size-[20px]"
                    src="/assets/message.svg"
                    alt="Booking request"
                  />
                  <p className="text-base font-normal">
                    {t("layout.navbar.inbox")}
                  </p>
                  <div className="ml-auto flex items-center gap-4">
                    <RightArrowRounded className="size-[20px]" />
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent"
                asChild
              >
                <Link to={`/user-profile`}>
                  <img
                    className="size-[20px]"
                    src="/assets/profile.svg"
                    alt="Booking request"
                  />
                  <p className="text-base font-normal">
                    {t("layout.navbar.profile")}
                  </p>
                  <div className="ml-auto flex items-center gap-4">
                    <RightArrowRounded className="size-[20px]" />
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent">
                <img
                  className="size-[20px]"
                  src="/assets/transfer.png"
                  alt="Booking request"
                />
                <p className="text-base font-normal">
                  {t("layout.navbar.transfers")}
                </p>
                <div className="ml-auto flex items-center gap-4">
                  <RightArrowRounded className="size-[20px]" />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent">
                <img
                  className="size-[20px]"
                  src="/assets/payment.png"
                  alt="Booking request"
                />
                <p className="text-base font-normal">
                  {t("layout.navbar.payment_refunds")}
                </p>
                <div className="ml-auto flex items-center gap-4">
                  <RightArrowRounded className="size-[20px]" />
                </div>
              </DropdownMenuItem>
              <div className="sm:hidden py-2">
                <p className="text-sm text-gray-500 mb-2 px-2">Language</p>
                <div className="flex flex-col gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={cn(
                        "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100",
                        i18n.language === lang.code && "bg-gray-100"
                      )}
                      onClick={() => i18n.changeLanguage(lang.code)}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-base">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <DropdownMenuItem className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent">
                <img
                  className="size-[20px]"
                  src="/assets/logout.svg"
                  alt="Booking request"
                />
                <p className="text-base font-normal">
                  {t("layout.navbar.logout")}
                </p>
                <div className="ml-auto flex items-center gap-4">
                  <RightArrowRounded className="size-[20px]" />
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
