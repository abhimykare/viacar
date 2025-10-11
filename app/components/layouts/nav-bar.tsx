import { ChevronDown, CirclePlus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useUserStatus } from "~/hooks/use-user-status";
import { toast } from "sonner";
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
import { useUserStore } from "~/lib/store/userStore";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

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
  const token = useUserStore((state) => state.token);
  const clearUserData = useUserStore((state) => state.clearUserData);
  const clearRideData = useRideCreationStore((state) => state.clearRideData);
  const navigate = useNavigate();
  const { userStatus, loading, error, refetch } = useUserStatus();
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

  const handlePublishRide = () => {
    if (!token) {
      navigate("/login?from=publishRide");
      return;
    }

    if (loading) {
      toast.info("Loading user status...");
      return;
    }

    if (error) {
      toast.error("Error fetching user status. Please try again.");
      return;
    }

    if (userStatus) {
      if (
        !userStatus.id_verification.completed &&
        !userStatus.id_verification.submitted_at
      ) {
        toast.info("Please complete your ID verification.");
        navigate("/add-documents");
        return;
      }
      if (!userStatus.bank_details.has_bank_details) {
        toast.info("Please add your bank details.");
        navigate("/add-bank-details");
        return;
      }
      if (!userStatus.vehicles.has_vehicles) {
        toast.info("Please add your vehicle details.");
        navigate("/add-vehicle");
        return;
      }
      if (!userStatus.account.is_ride_publishable) {
        toast.error("You are not authorized to publish rides.");
        return;
      }
      clearRideData();
      navigate("/pickup");
    } else {
      toast.error("Unable to retrieve user status.");
    }
  };

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
          <button
            onClick={handlePublishRide}
            className="font-alt text-base lg:text-xl font-normal lg:font-semibold rounded-full flex items-center border border-white px-3 lf:px-6 h-10 lg:h-12 gap-2 text-white cursor-pointer"
          >
            <CirclePlus className="h-[18px] lg:h-[26px]" color="white" />
            <span>{t("layout.header.publish_ride")}</span>
          </button>
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
                <Link to={token ? `/your-rides` : `/login?from=curUser`}>
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
                <Link to={token ? `/booking-request` : `/login?from=curUser`}>
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
                <Link to={token ? `/inbox` : `/login?from=curUser`}>
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
                <Link to={token ? `/user-profile` : `/login?from=curUser`}>
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
              <DropdownMenuItem
                className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent"
                asChild
              >
                <Link to={token ? `/transactions` : `/login?from=curUser`}>
                  <img
                    className="size-[20px]"
                    src="/assets/transfer.png"
                    alt="Booking request"
                  />
                  <p className="text-base font-normal">
                    {t("layout.navbar.transactions")}
                  </p>
                  <div className="ml-auto flex items-center gap-4">
                    <RightArrowRounded className="size-[20px]" />
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent"
              >
                <Link to={token ? `/payment-refunds` : `/login?from=curUser`}>
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
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent"
              >
                <Link to={token ? `/bank-details` : `/login?from=curUser`}>
                  <img
                    className="size-[20px]"
                    src="/assets/bank-account.png"
                    alt="Booking request"
                  />
                  <p className="text-base font-normal">
                    {t("layout.navbar.bank_details")}
                  </p>
                  <div className="ml-auto flex items-center gap-4">
                    <RightArrowRounded className="size-[20px]" />
                  </div>
                </Link>
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
              <DropdownMenuItem
                asChild
                className="flex items-center gap-4 w-full rounded-none px-0 py-2.5 my-2 cursor-pointer focus:bg-transparent"
              >
                <Link to={`/login`} onClick={clearUserData}>
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
                </Link>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
