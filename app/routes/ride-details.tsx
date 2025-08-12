import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/ride-details";
import { Card } from "~/components/ui/card";
import TimeDirectionIcon from "~/components/icons/time-direction-icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FaAngleRight, FaStar } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Separator } from "~/components/ui/separator";
import { IoArrowForward } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsFillLightningFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import GoogleMap from "~/components/common/google-map";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Ride Details" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "ride_details",
  });
  const isRTL = i18n.language === "ar";

  return (
    <div className="bg-[#F5F5F5]">
      <Header title={t("title")} />
      <div className="max-w-[1410px] w-full mx-auto px-6">
        <p className="flex items-center justify-center gap-2 text-2xl lg:text-[2.188rem] font-medium text-center pt-[60px] pb-[30px]">
          <img
            className="size-[20px] lg:size-[36px]"
            src="/assets/calendar.svg"
            alt=""
          />
          <span>{t("date")}</span>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-[60px]">
          <Card className="shadow-none p-5">
            <div className="flex items-center gap-4 mb-5">
              <TimeDirectionIcon
                time={t("duration")}
                className="max-sm:hidden"
              />
              <div className="flex flex-col">
                <p className="text-sm lg:text-base text-[#939393] font-light">
                  {t("pickup")}
                </p>
                <p className="text-base lg:text-lg mb-8">
                  {t("pickup_location")}
                </p>
                <p className="text-sm lg:text-base text-[#939393] font-light">
                  {t("drop")}
                </p>
                <p className="text-base lg:text-lg">{t("drop_location")}</p>
              </div>
              <div className="flex flex-col text-end ml-auto">
                <p className="text-sm lg:text-base text-[#939393] font-light">
                  {t("pickup_time")}
                </p>
                <p className="text-base lg:text-lg mb-8">
                  {t("pickup_time_value")}
                </p>
                <p className="text-sm lg:text-base text-[#939393] font-light">
                  {t("drop_time")}
                </p>
                <p className="text-base lg:text-lg">{t("drop_time_value")}</p>
              </div>
            </div>
            <GoogleMap
              startLocation={{
                lat: 10.0159,
                lng: 76.3419,
                address: "Kakkanad, Kerala",
              }}
              endLocation={{
                lat: 10.0672,
                lng: 76.3202,
                address: "Kalamassery, Kerala",
              }}
              height="300px"
              width="100%"
            />

            <div className="flex flex-col">
              <p className="text-xl lg:text-2xl mb-4">{t("details.title")}</p>
              <div className="flex flex-wrap gap-4 pb-4 lg:pb-10">
                <div className="flex items-center justify-center rounded-full border border-[#E1DFDF] px-4 h-[30px] lg:h-[36px] text-sm lg:text-[1.06rem] font-light w-max">
                  {t("details.rarely_cancels")}
                </div>
                <div className="flex items-center justify-center rounded-full border border-[#E1DFDF] px-4 h-[30px] lg:h-[36px] text-sm lg:text-[1.06rem] font-light w-max">
                  {t("details.instant_confirmation")}
                </div>
                <div className="flex items-center justify-center rounded-full border border-[#E1DFDF] px-4 h-[30px] lg:h-[36px] text-sm lg:text-[1.06rem] font-light w-max">
                  {t("details.smoking_ok")}
                </div>
                <div className="flex items-center justify-center rounded-full border border-[#E1DFDF] px-4 h-[30px] lg:h-[36px] text-sm lg:text-[1.06rem] font-light w-max">
                  {t("details.smoking_ok")}
                </div>
              </div>
            </div>
          </Card>
          <Card className="shadow-none py-6 px-8 gap-4">
            <div className="flex items-center justify-between">
              <Link to={`/profile`} className="flex items-start gap-4">
                <Avatar className="size-[50px] lg:size-[65px]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-lg lg:text-2xl mb-1">
                      {t("driver.name")}
                    </p>
                    <img
                      className="size-[20px] lg:size-[24px]"
                      src="/assets/verified.svg"
                      alt=""
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="fill-[#FF9C00]" />
                    <p className="text-lg lg:text-2xl">{t("driver.rating")}</p>
                    <p className="text-sm lg:text-base text-[#939393] font-light">
                      {t("driver.ratings_text")}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/chat`}>
                    <img
                      className="size-[30px] lg:size-[40px]"
                      src="/assets/chat.svg"
                      alt=""
                    />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/profile`}>
                    <FaAngleRight
                      color="#BEBEBE"
                      height={14}
                      className={cn(isRTL && "scale-x-[-1]")}
                    />
                  </Link>
                </Button>
              </div>
            </div>
            <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <p className="text-xl lg:text-[1.563rem]">
              {t("passengers.title")}
            </p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-[40px] lg:size-[56px]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-base lg:text-xl mb-1">
                    {t("passengers.passenger1.name")}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm lg:text-base text-[#666666] font-light">
                      {t("passengers.passenger1.from")}
                    </p>
                    <IoArrowForward
                      color="#A5A5A5"
                      className={cn(isRTL && "scale-x-[-1]")}
                    />
                    <p className="text-sm lg:text-base text-[#666666] font-light">
                      {t("passengers.passenger1.to")}
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/profile`}>
                  <MdKeyboardArrowRight
                    color="#A69A9A"
                    className={cn(
                      "size-[25px] lg:size-[28px]",
                      isRTL && "scale-x-[-1]"
                    )}
                  />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-[40px] lg:size-[56px]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-base lg:text-xl mb-1">
                    {t("passengers.passenger2.name")}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm lg:text-base text-[#666666] font-light">
                      {t("passengers.passenger2.from")}
                    </p>
                    <IoArrowForward
                      color="#A5A5A5"
                      className={cn(isRTL && "scale-x-[-1]")}
                    />
                    <p className="text-sm lg:text-base text-[#666666] font-light">
                      {t("passengers.passenger2.to")}
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/profile`}>
                  <MdKeyboardArrowRight
                    color="#A69A9A"
                    className={cn(
                      "size-[25px] lg:size-[28px]",
                      isRTL && "scale-x-[-1]"
                    )}
                  />
                </Link>
              </Button>
            </div>
            <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <div className="flex items-center justify-between">
              <p className="text-lg lg:text-[1.563rem]">
                {t("passenger_count")}
              </p>
              <p className="text-lg lg:text-[1.563rem] text-[#00665A]">
                <span className="font-semibold">{t("currency")}</span>
                <span className="font-medium ml-2">{t("passenger_price")}</span>
              </p>
            </div>
            <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-xl lg:text-2xl mb-1">{t("car.title")}</p>
                <p className="text-base text-[#666666] font-light">
                  {t("car.type")}
                </p>
              </div>
              <img src="/assets/car-preview.png" alt="" />
            </div>
            <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <p className="text-lg lg:text-[1.563rem]">
              {t("price_summary.title")}
            </p>
            <div className="grid grid-cols-[1fr_10px_auto] gap-4 items-center">
              <p className="text-base lg:text-xl text-[#666666] font-light">
                {t("price_summary.driver_amount")}
              </p>
              <p className="text-lg lg:text-[1.563rem]">:</p>
              <p className="text-lg lg:text-xl text-end">
                {t("price_summary.driver_amount_value")}
              </p>
              <p className="text-base lg:text-xl text-[#666666] font-light">
                {t("price_summary.service_fee")}
              </p>
              <p className="text-lg lg:text-[1.563rem]">:</p>
              <p className="text-lg lg:text-xl text-end">
                {t("price_summary.service_fee_value")}
              </p>
              <p className="text-xl lg:text-[1.375rem] text-[#666666] font-light">
                {t("price_summary.total")}
              </p>
              <p className="text-lg lg:text-[1.563rem]">:</p>
              <p className="text-xl text-[1.75rem] text-[#00665A] font-medium text-end">
                {t("price_summary.total_value")}
              </p>
            </div>
            <div className="flex items-center justify-center p-4">
              <Button
                className="bg-[#FF4848] rounded-full h-[55px] w-[241px] px-8 cursor-pointer text-xl"
                asChild
              >
                <Link to={`/payment`}>
                  <BsFillLightningFill className="size-[18px]" />
                  <span>{t("book_now")}</span>
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
