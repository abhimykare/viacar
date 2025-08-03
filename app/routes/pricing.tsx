import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/pricing";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Link, useLocation } from "react-router";
import TimeDirectionIcon from "~/components/icons/time-direction-icon";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Pricing" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const [amount, setAmount] = useState(3000);
  const [amountOne, setAmountOne] = useState(640.0);
  const [amountTwo, setAmountTwo] = useState(120.0);
  const [amountThree, setAmountThree] = useState(420.0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();

  function adjustAmount(adjustment: number) {
    setAmount(Math.max(1000, Math.min(4000, amount + adjustment)));
  }

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
    <div className="bg-[#F5F5F5]">
      <Header title={t("pricing.title")} />
      <div className="max-w-[686px] w-full mx-auto px-6 pt-10 lgpt-[80px] pb-12 lg:pb-[100px]">
        <div className="bg-white rounded-2xl w-full px-4 lg:px-12 py-6 lg:py-10">
          <p className="text-2xl lg:text-[2.188rem] text-[#3C3F4E] text-center font-medium leading-tight">
            {t("pricing.header_title")}
          </p>
          <div className="flex items-center justify-center space-x-2 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="size-[50px] shrink-0 rounded-full cursor-pointer"
              onClick={() => adjustAmount(-500)}
              disabled={amount === 1000}
            >
              <img
                className="size-[50px]"
                src="/assets/minus-large.svg"
                alt=""
              />
              <span className="sr-only">{t("pricing.decrease")}</span>
            </Button>
            <div className="flex-1 text-center">
              <div className="text-4xl lg:text-[5.25rem] text-[#00665A] font-semibold">
                SR {amount.toLocaleString()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-[50px] shrink-0 rounded-full cursor-pointer"
              onClick={() => adjustAmount(500)}
              disabled={amount >= 4000}
            >
              <img
                className="size-[50px]"
                src="/assets/plus-large.svg"
                alt=""
              />
              <span className="sr-only">{t("pricing.increase")}</span>
            </Button>
          </div>
          <Separator className="my-6 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
          <div className="h-auto sm:h-[35px] text-base lg:text-lg text-white bg-[#14B968] rounded-full text-center w-full sm:w-max px-6 py-1 flex items-center justify-center mx-auto mb-4">
            {t("pricing.recommended_price")}
          </div>
          <p className="text-[0.938rem] text-[#666666] font-light text-center">
            {t("pricing.perfect_price")}
          </p>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 max-w-[430px] w-full mx-auto mt-12">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-[#EBEBEB] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal shadow-none"
                >
                  <span>{t("pricing.show_prices")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[950px] min-h-[464px] w-full">
                <ScrollArea className="max-lg:h-screen p-4">
                  <div className="flex flex-col">
                    <div className="grid grid-cols-[60px_1fr] md:flex items-center gap-4 mb-5 min-h-[167px]">
                      <TimeDirectionIcon
                        time="4h 40m"
                        className="h-[167px] w-[60px]"
                      />
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <p className="text-base text-[#939393] font-light">
                            {t("pricing.pickup")}
                          </p>
                          <p className="text-lg">
                            {t("locations.al_khobar.name")}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-[#939393] font-light">
                            {t("pricing.drop")}
                          </p>
                          <p className="text-lg">
                            {t("locations.riyadh.name")}
                          </p>
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
                            <span className="sr-only">
                              {t("pricing.decrease")}
                            </span>
                          </Button>
                          <div className="flex-1 text-center">
                            <div className="text-[2.188rem] font-semibold font-alpha">
                              SR{" "}
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
                            <span className="sr-only">
                              {t("pricing.increase")}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
                    <div className="grid grid-cols-[26px_1fr] md:flex items-center gap-4 mb-6 min-h-[139px]">
                      <img src="/assets/direction2.svg" />
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <p className="text-base text-[#939393] font-light">
                            {t("pricing.pickup")}
                          </p>
                          <p className="text-lg">
                            {t("locations.al_khobar.name")}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-[#939393] font-light">
                            {t("pricing.drop")}
                          </p>
                          <p className="text-lg">
                            {t("stopovers_preview.stops.heritage_village.name")}
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
                            <span className="sr-only">
                              {t("pricing.decrease")}
                            </span>
                          </Button>
                          <div className="flex-1 text-center">
                            <div className="text-[1.625rem] font-semibold font-alpha">
                              SR{" "}
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
                            <span className="sr-only">
                              {t("pricing.increase")}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-[26px_1fr] md:flex items-start lg:items-center gap-4 mb-5 min-h-[139px]">
                      <img src="/assets/direction2.svg" />
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <p className="text-base text-[#939393] font-light">
                            {t("pricing.pickup")}
                          </p>
                          <p className="text-lg">
                            {t("locations.al_khobar.name")}
                          </p>
                        </div>
                        <div>
                          <p className="text-base text-[#939393] font-light">
                            {t("pricing.drop")}
                          </p>
                          <p className="text-lg">
                            {t("locations.riyadh.name")}
                          </p>
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
                            <span className="sr-only">
                              {t("pricing.decrease")}
                            </span>
                          </Button>
                          <div className="flex-1 text-center">
                            <div className="text-[1.625rem] font-semibold font-alpha">
                              SR{" "}
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
                            <span className="sr-only">
                              {t("pricing.increase")}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Button
              className="bg-[#FF4848] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal"
              asChild
            >
              <Link
                to={location.state?.isReturn ? `/publish-comment` : `/return`}
              >
                {t("pricing.continue")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
