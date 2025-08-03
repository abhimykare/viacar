import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/route";
import { Label } from "~/components/ui/label";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "~/components/ui/button";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

const routesData = [
  {
    id: "1",
    duration: 4,
    minutes: 15,
    distance: 346,
    road: "Hosur Rd and NH 4/NH 44/NH 48",
  },
  {
    id: "2",
    duration: 4,
    minutes: 40,
    distance: 346,
    road: "Hosur Rd and NH 4/NH 44/NH 48",
  },
  {
    id: "3",
    duration: 5,
    minutes: 10,
    distance: 346,
    road: "Hosur Rd and NH 4/NH 44/NH 48",
  },
];

const CheckIcon = () => (
  <img
    src="/assets/check-green.svg"
    alt="Check Icon"
    className="absolute inset-0 m-auto size-[33px] hidden group-data-[state=checked]:block"
  />
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Select Route" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div>
      <Header title={t("route.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-7 pt-[80px] pb-[100px]">
        <div className="border border-[#EBEBEB] rounded-2xl px-8 py-6 flex flex-col gap-7">
          <p className="text-2xl lg:text-[2.188rem]">
            {t("route.header_title")}
          </p>
          <RadioGroup.Root defaultValue="1" className="flex flex-col gap-4">
            {routesData.map(({ id, duration, minutes, distance, road }) => (
              <RadioGroup.Item key={id} value={id} id={id} asChild>
                <div className="group border border-[#EBEBEB] px-6 py-4 rounded-2xl bg-white flex items-center justify-between data-[state=checked]:border-[#69D2A5] data-[state=checked]:bg-[#F1FFF9] cursor-pointer">
                  <Label
                    htmlFor={id}
                    className="flex flex-col items-start gap-1"
                  >
                    <span className="text-base font-normal">
                      {t("route.routes.duration", { duration, minutes })}
                    </span>
                    <span className="text-sm font-normal text-[#999999]">
                      {t("route.routes.distance", { distance, road })}
                    </span>
                  </Label>
                  <div className="ml-2 size-[25px] lg:size-[33px] aspect-square relative border border-gray-300 rounded-full flex items-center justify-center group-data-[state=checked]:border-transparent">
                    <CheckIcon />
                  </div>
                </div>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <div className="flex items-center justify-center pt-5">
            <Button
              className="bg-[#FF4848] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal"
              asChild
            >
              <Link state={location.state} to={`/stopovers`}>
                {t("route.continue")}
              </Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl decoration-0 overflow-hidden w-full h-full">
          <img src="/assets/map-select.png" alt="Map" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
