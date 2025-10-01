import { useState } from "react";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { Label } from "~/components/ui/label";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Button } from "~/components/ui/button";
import { Link, useLocation } from "react-router";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import CitySearch from "~/components/common/city-search";
import type { Route } from "./+types/stopovers";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

const initialRoutes = [
  {
    id: "1",
    title: "stopovers.cities.dammam",
    defaultChecked: true,
  },
  {
    id: "2",
    title: "stopovers.cities.sedra_resort",
  },
  {
    id: "3",
    title: "stopovers.cities.judah",
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Stopovers" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const [cities, setCities] = useState(initialRoutes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const handleAddCity = (city: string) => {
    // Only add if the city is not already in the list (optional)
    const exists = cities.some((c) => c.title === city);
    if (!exists) {
      const newCity = {
        id: (cities.length + 1).toString(),
        title: city,
      };
      setCities((prev) => [...prev, newCity]);
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <Header title={t("stopovers.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 pt-8 lg:pt-[80px] pb-10 lg:pb-[100px] flex flex-col gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center">
          {t("stopovers.header_title")}
        </p>
        <div className="flex flex-col max-w-[430px] w-full mx-auto divide-y divide-[#EBEBEB]">
          {cities.map(({ id, title, defaultChecked }) => (
            <Checkbox.Root
              key={id}
              id={id}
              className="group py-4 flex items-center gap-4 cursor-pointer"
              defaultChecked={defaultChecked}
            >
              <img
                className="size-[25px] lg:size-[30px]"
                src="/assets/building.svg"
                alt="Building Icon"
              />
              <Label htmlFor={id} className="flex items-center gap-1 flex-1">
                <span className="text-base font-normal">{t(title)}</span>
              </Label>
              <div className="size-[33px] relative border border-gray-300 group-data-[state=checked]:border-transparent rounded-full flex items-center justify-center">
                <Checkbox.Indicator>
                  <img
                    src="/assets/check-green.svg"
                    alt="Check Icon"
                    className="absolute inset-0 m-auto size-[33px]"
                  />
                </Checkbox.Indicator>
              </div>
            </Checkbox.Root>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 max-w-[430px] w-full mx-auto">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[#EBEBEB] rounded-full w-full md:w-[208px] h-[55px] cursor-pointer text-xl font-normal shadow-none"
              >
                <Plus />
                <span>{t("stopovers.add_city")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-[896px] min-h-[464px] w-full">
              {/* Pass the onSelect callback to CitySearch */}
              <CitySearch name="pickup" onSelect={handleAddCity} />
            </DialogContent>
          </Dialog>
          <Button
            className="bg-[#FF4848] rounded-full w-full md:w-[208px] h-[55px] cursor-pointer text-xl font-normal"
            asChild
          >
            <Link state={location.state} to={`/stopovers-preview?${searchParams.toString()}`}>
              {t("stopovers.continue")}
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
