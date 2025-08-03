import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import type { Route } from "./+types/passenger-options";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Seat and Options" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const [passengers, setPassengers] = useState(3);

  function adjustPassengers(adjustment: number) {
    setPassengers(Math.max(1, Math.min(3, passengers + adjustment)));
  }

  return (
    <div>
      <Header
        title={t("passenger_options.title")}
        breadcrumb={[
          { label: t("passenger_options.breadcrumb.home"), href: "/" },
          {
            label: t("passenger_options.breadcrumb.publish_ride"),
            href: "/publish-ride",
          },
          {
            label: t("passenger_options.breadcrumb.your_ride"),
            href: "/your-ride",
          },
          {
            label: t("passenger_options.breadcrumb.your_publication"),
            href: "/your-publication",
          },
          {
            label: t("passenger_options.breadcrumb.seat_options"),
            href: "/passenger-options",
          },
        ]}
      />
      <div className="max-w-[1388px] w-full mx-auto px-6 pt-8 lg:pt-[80px] pb-10 lg:pb-[100px] flex flex-col gap-7">
        <p className="text-[1.938rem] text-center">
          {t("passenger_options.header")}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="border border-[#EBEBEB] rounded-2xl px-4 lg:px-6 py-6 lg:py-8 flex flex-col w-full divide-y divide-[#EBEBEB] divide-dashed">
            <div className="bg-white rounded-2xl w-full px-4 lg:px-12 py-6 lg:py-10">
              <p className="text-lg lg:text-2xl text-[#3C3F4E] text-center font-normal leading-tight">
                {t("passenger_options.passengers.title")}
              </p>
              <div className="flex items-center justify-center space-x-2 px-6 m-8">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-[30px] shrink-0 rounded-full cursor-pointer"
                  onClick={() => adjustPassengers(-1)}
                  disabled={passengers === 1}
                >
                  <img
                    className="size-[30px]"
                    src="/assets/minus-large.svg"
                    alt=""
                  />
                  <span className="sr-only">
                    {t("passenger_options.buttons.decrease")}
                  </span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-[2.625rem] text-[#00665A] font-semibold">
                    0{passengers}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-[30px] shrink-0 rounded-full cursor-pointer"
                  onClick={() => adjustPassengers(1)}
                  disabled={passengers >= 3}
                >
                  <img
                    className="size-[30px]"
                    src="/assets/plus-large.svg"
                    alt=""
                  />
                  <span className="sr-only">
                    {t("passenger_options.buttons.increase")}
                  </span>
                </Button>
              </div>
              <p className="text-2xl text-center mb-4">
                {t("passenger_options.passengers.options")}
              </p>
              <Checkbox.Root className="group px-6 py-4 flex items-center gap-4 w-full cursor-pointer border -border-[#EBEBEB] rounded-2xl">
                <img
                  className="size-[30px]"
                  src="/assets/people.svg"
                  alt="Building Icon"
                />
                <Label
                  htmlFor="max"
                  className="flex flex-col items-start gap-1"
                >
                  <span className="text-base font-normal">
                    {t("passenger_options.passengers.max_back.label")}
                  </span>
                  <span className="text-[0.938rem] text-[#666666] font-light">
                    {t("passenger_options.passengers.max_back.description")}
                  </span>
                </Label>
                <div className="size-[33px] relative border border-gray-300 group-data-[state=checked]:border-transparent rounded-full flex items-center justify-center ml-auto">
                  <Checkbox.Indicator>
                    <img
                      src="/assets/check-green.svg"
                      alt="Check Icon"
                      className="absolute inset-0 m-auto size-[33px]"
                    />
                  </Checkbox.Indicator>
                </div>
              </Checkbox.Root>
            </div>
          </div>
          <div className="border border-[#EBEBEB] rounded-2xl px-6 py-8">
            <p className="text-2xl mb-6">
              {t("passenger_options.vehicles.title")}
            </p>
            <p className="text-lg">{t("passenger_options.vehicles.model")}</p>
            <p className="text-base text-[#666666] font-light">
              {t("passenger_options.vehicles.color")}
            </p>
            <Separator className="my-6 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <p className="text-2xl mb-6">
              {t("passenger_options.additional_details.title")}
            </p>
            <Textarea
              className="text-sm font-light placeholder:text-[#999999] bg-[#F5F5F5] rounded-2xl !border-0 !ring-0 min-h-[176px] p-6"
              placeholder={t(
                "passenger_options.additional_details.placeholder"
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-center pt-10">
          <Button
            className="bg-[#FF4848] w-[160px] h-[55px] rounded-full text-xl font-normal"
            asChild
          >
            <Link to={`/pricing`}>{t("passenger_options.buttons.save")}</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
