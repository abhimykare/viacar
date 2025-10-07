import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/passenger-count";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Label } from "~/components/ui/label";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Passenger Count" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const [passengers, setPassengers] = useState(3);
  const [max2InBack, setMax2InBack] = useState(false);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  function adjustPassengers(adjustment: number) {
    setPassengers(Math.max(1, Math.min(3, passengers + adjustment)));
  }

  return (
    <div className="bg-[#F5F5F5]">
      <Header title={t("passenger_count.title")} />
      <div className="max-w-[686px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px]">
        <div className="bg-white rounded-2xl w-full px-4 lg:px-12 py-6 lg:py-10">
          <p className="text-2xl lg:text-[2.188rem] text-[#3C3F4E] text-center font-medium leading-tight">
            {t("passenger_count.header_title")}
          </p>
          <div className="flex items-center justify-center space-x-2 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="size-[40px] lg:size-[50px] shrink-0 rounded-full cursor-pointer"
              onClick={() => {
                const newPassengers = Math.max(1, passengers - 1);
                setPassengers(newPassengers);
                const newParams = new URLSearchParams(searchParams);
                newParams.set('available_seats', newPassengers.toString());
                setSearchParams(newParams);
              }}
              disabled={passengers === 1}
            >
              <img
                className="size-[40px] lg:size-[50px]"
                src="/assets/minus-large.svg"
                alt=""
              />
              <span className="sr-only">{t("passenger_count.decrease")}</span>
            </Button>
            <div className="flex-1 text-center py-4">
              <div className="text-6xl lg:text-[5.25rem] text-[#00665A] font-semibold">
                0{passengers}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-[40px] lg:size-[50px] shrink-0 rounded-full cursor-pointer"
              onClick={() => {
                const newPassengers = Math.min(3, passengers + 1);
                setPassengers(newPassengers);
                const newParams = new URLSearchParams(searchParams);
                newParams.set('available_seats', newPassengers.toString());
                setSearchParams(newParams);
              }}
              disabled={passengers >= 3}
            >
              <img
                className="size-[40px] lg:size-[50px]"
                src="/assets/plus-large.svg"
                alt=""
              />
              <span className="sr-only">{t("passenger_count.increase")}</span>
            </Button>
          </div>
          <p className="text-xl lg:text-[1.688rem] text-center mb-4">
            {t("passenger_count.passenger_options")}
          </p>
          <Checkbox.Root 
            className="group px-6 py-4 flex items-center gap-4 w-full cursor-pointer border -border-[#EBEBEB] rounded-2xl"
            checked={max2InBack}
            onCheckedChange={(checked) => setMax2InBack(checked as boolean)}
          >
            <img
              className="size-[20px] lg:size-[30px]"
              src="/assets/people.svg"
              alt="Building Icon"
            />
            <Label
              htmlFor="max"
              className="flex flex-col items-start text-start gap-1 flex-1"
            >
              <span className="text-sm lg:text-base font-normal">
                {t("passenger_count.max_back")}
              </span>
              <span className="text-xs lg:text-[0.938rem] text-[#666666] font-light">
                {t("passenger_count.comfort_note")}
              </span>
            </Label>
            <div className="size-[25px] lg:size-[33px] relative border border-gray-300 group-data-[state=checked]:border-transparent rounded-full flex items-center justify-center">
              <Checkbox.Indicator>
                <img
                  src="/assets/check-green.svg"
                  alt="Check Icon"
                  className="absolute inset-0 m-auto size-[25px] lg:size-[33px]"
                />
              </Checkbox.Indicator>
            </div>
          </Checkbox.Root>
          <div className="flex items-center justify-center pt-10">
            <Button
              className="bg-[#FF4848] w-[208px] h-[55px] rounded-full text-xl font-normal"
              asChild
            >
              <Link 
                state={location.state} 
                to={`/pricing?${searchParams.toString()}&max_2_in_back=${max2InBack}`}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('max_2_in_back', max2InBack.toString());
                  setSearchParams(newParams);
                }}
              >
                {t("passenger_count.continue")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
