import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/your-pricing";
import TimeDirectionIcon from "~/components/icons/time-direction-icon";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Separator } from "~/components/ui/separator";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Your Pricing" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const [amountOne, setAmountOne] = useState(640.0);
  const [amountTwo, setAmountTwo] = useState(120.0);
  const [amountThree, setAmountThree] = useState(420.0);

  function adjustAmountOne(adjustment: number) {
    setAmountOne(Math.max(1000, Math.min(4000, amountOne + adjustment)));
  }

  function adjustAmountTwo(adjustment: number) {
    setAmountTwo(Math.max(1000, Math.min(4000, amountTwo + adjustment)));
  }

  function adjustAmountThree(adjustment: number) {
    setAmountThree(Math.max(1000, Math.min(4000, amountThree + adjustment)));
  }

  return (
    <div>
      <Header
        title={t("your_pricing.title")}
        breadcrumb={[
          { label: t("your_pricing.breadcrumb.home"), href: "/" },
          { label: t("your_pricing.breadcrumb.publish_ride"), href: "/publish-ride" },
          { label: t("your_pricing.breadcrumb.your_ride"), href: "/your-ride" },
          { label: t("your_pricing.breadcrumb.your_publication"), href: "/your-publication" },
          { label: t("your_pricing.breadcrumb.your_pricing"), href: "/itinerary" },
        ]}
      />
      <div className="max-w-[888px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-4 lg:gap-7">
        <p className="text-2xl lg:text-[1.938rem] text-center">{t("your_pricing.header")}</p>
        <div className="border border-[#EBEBEB] rounded-2xl p-4 lg:px-8 lg:py-8 flex flex-col w-full">
          <div className="flex flex-col">
            <div className="grid grid-cols-[60px_1fr] md:flex items-center gap-4 mb-5 min-h-[167px]">
              <TimeDirectionIcon time="4h 40m" className="h-[167px] w-[60px]" />
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="text-base text-[#939393] font-light">{t("your_pricing.pickup.label")}</p>
                  <p className="text-lg">{t("your_pricing.pickup.address")}</p>
                </div>
                <div>
                  <p className="text-base text-[#939393] font-light">{t("your_pricing.drop.label")}</p>
                  <p className="text-lg">{t("your_pricing.drop.address")}</p>
                </div>
              </div>
              <div className="flex flex-col text-end lg:ml-auto max-lg:col-span-2">
                <div className="flex items-center justify-center space-x-8 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-[50px] shrink-0 rounded-full cursor-pointer"
                    onClick={() => adjustAmountOne(-500)}
                    disabled={amountOne === 500}
                  >
                    <img
                      className="size-[40px]"
                      src="/assets/minus-red.svg"
                      alt=""
                    />
                    <span className="sr-only">{t("your_pricing.buttons.decrease")}</span>
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-[2.188rem] font-semibold font-alpha">
                      {t("your_pricing.currency")}{" "}
                      {amountOne.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-[50px] shrink-0 rounded-full cursor-pointer"
                    onClick={() => adjustAmountOne(500)}
                    disabled={amountOne >= 4000}
                  >
                    <img
                      className="size-[40px]"
                      src="/assets/plus-green.svg"
                      alt=""
                    />
                    <span className="sr-only">{t("your_pricing.buttons.increase")}</span>
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="my-4 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <div className="grid grid-cols-[26px_1fr] md:flex items-center gap-4 mb-6 min-h-[139px]">
              <img src="/assets/direction2.svg" />
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="text-base text-[#939393] font-light">{t("your_pricing.pickup.label")}</p>
                  <p className="text-lg">{t("your_pricing.pickup.address")}</p>
                </div>
                <div>
                  <p className="text-base text-[#939393] font-light">{t("your_pricing.drop.label")}</p>
                  <p className="text-lg">
                    {t("your_pricing.stopover.address")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col text-end lg:ml-auto max-lg:col-span-2">
                <div className="flex items-center justify-center space-x-8 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-[50px] shrink-0 rounded-full cursor-pointer"
                    onClick={() => adjustAmountTwo(-500)}
                    disabled={amountTwo === 500}
                  >
                    <img
                      className="size-[40px]"
                      src="/assets/minus-red.svg"
                      alt=""
                    />
                    <span className="sr-only">{t("your_pricing.buttons.decrease")}</span>
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-[1.625rem] font-semibold font-alpha">
                      {t("your_pricing.currency")}{" "}
                      {amountTwo.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-[50px] shrink-0 rounded-full cursor-pointer"
                    onClick={() => adjustAmountTwo(500)}
                    disabled={amountTwo >= 4000}
                  >
                    <img
                      className="size-[40px]"
                      src="/assets/plus-green.svg"
                      alt=""
                    />
                    <span className="sr-only">{t("your_pricing.buttons.increase")}</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[26px_1fr] md:flex items-start lg:items-center gap-4 mb-5 min-h-[139px]">
              <img src="/assets/direction2.svg" />
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="text-base text-[#939393] font-light">{t("your_pricing.pickup.label")}</p>
                  <p className="text-lg">{t("your_pricing.pickup.address")}</p>
                </div>
                <div>
                  <p className="text-base text-[#939393] font-light">{t("your_pricing.drop.label")}</p>
                  <p className="text-lg">{t("your_pricing.drop.address")}</p>
                </div>
              </div>
              <div className="flex flex-col text-end lg:ml-auto max-lg:col-span-2">
                <div className="flex items-center justify-center space-x-8 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-[50px] shrink-0 rounded-full cursor-pointer"
                    onClick={() => adjustAmountThree(-500)}
                    disabled={amountThree === 500}
                  >
                    <img
                      className="size-[40px]"
                      src="/assets/minus-red.svg"
                      alt=""
                    />
                    <span className="sr-only">{t("your_pricing.buttons.decrease")}</span>
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-[1.625rem] font-semibold font-alpha">
                      {t("your_pricing.currency")}{" "}
                      {amountThree.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-[50px] shrink-0 rounded-full cursor-pointer"
                    onClick={() => adjustAmountThree(500)}
                    disabled={amountThree >= 4000}
                  >
                    <img
                      className="size-[40px]"
                      src="/assets/plus-green.svg"
                      alt=""
                    />
                    <span className="sr-only">{t("your_pricing.buttons.increase")}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
