import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/booking-request-details";
import TimeDirectionIcon from "~/components/icons/time-direction-icon";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Booking Request Details" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div>
      <Header
        title={t("booking_request_details.title")}
        breadcrumb={[
          { label: t("booking_request_details.breadcrumb.home"), href: "/" },
          { label: t("booking_request_details.breadcrumb.booking_request"), href: "/booking-request" },
          {
            label: t("booking_request_details.breadcrumb.details"),
            href: "/booking-request-details",
          },
        ]}
      />
      <div className="max-w-[1379px] w-full mx-auto px-6 pt-8 lg:pt-[80px] pb-10 lg:pb-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[#EBEBEB] rounded-2xl px-8 py-10 flex flex-col gap-4">
            <p className="text-2xl lg:text-[2.188rem] mb-4">{t("booking_request_details.date")}</p>
            <div className="flex items-center gap-4 mb-5">
              <TimeDirectionIcon className="h-full w-max" time="4h 40m" />
              <div className="flex flex-col">
                <p className="text-sm lg:text-base text-[#939393] font-light">{t("booking_request_details.pickup.label")}</p>
                <p className="text-base lg:text-lg mb-8">
                  {t("booking_request_details.pickup.address")}
                </p>
                <p className="text-sm lg:text-base text-[#939393] font-light">{t("booking_request_details.drop.label")}</p>
                <p className="text-base lg:text-lg">
                  {t("booking_request_details.drop.address")}
                </p>
              </div>
              <div className="flex flex-col text-end ml-auto">
                <p className="text-sm lg:text-base text-[#939393] font-light">
                  {t("booking_request_details.pickup.time")}
                </p>
                <p className="text-base lg:text-lg mb-8">{t("booking_request_details.pickup.time")}</p>
                <p className="text-sm lg:text-base text-[#939393] font-light">{t("booking_request_details.drop.time")}</p>
                <p className="text-base lg:text-lg">{t("booking_request_details.drop.time")}</p>
              </div>
            </div>
            <Separator className=" border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-[30px] lg:size-[36px]">
                  <AvatarImage src="/assets/profile-img2.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-base lg:text-xl">{t("booking_request_details.passenger.name")}</p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link to={``}>
                  <ChevronRight className="size-[25px]" color="#666666" />
                </Link>
              </Button>
            </div>
            <div className="bg-[#F5F5F5] rounded-2xl px-4 py-4">
              <div className="flex gap-4">
                <Avatar className="size-[26px]">
                  <AvatarImage src="/assets/profile-img2.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="rounded-tl-[1px] rounded-[10px] bg-[#D9D9D9] text-black px-4 py-1 text-base font-light mt-3">
                  {t("booking_request_details.chat.message")}
                </div>
                <Button
                  className="w-[93px] h-[35px] text-base text-[#666666] font-light bg-transparent border-[#D9D8D8] rounded-full shadow-none ml-auto"
                  variant="outline"
                >
                  <img src="/assets/reply.svg" alt="" />
                  <span>{t("booking_request_details.chat.reply")}</span>
                </Button>
              </div>
            </div>
            <Separator className=" border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <div className="flex items-center justify-between gap-4">
              <p className="text-base lg:text-lg">{t("booking_request_details.seats")}</p>
              <p className="text-xl text-[#00665A] font-medium">{t("booking_request_details.price")}</p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 max-w-[430px] w-full mx-auto mt-10">
              <Button
                variant="outline"
                className="border-[#EBEBEB] rounded-full w-full lg:w-[208px] h-[55px] cursor-pointer text-xl font-normal shadow-none"
              >
                <span>{t("booking_request_details.actions.decline")}</span>
              </Button>
              <Button
                className="bg-[#FF4848] rounded-full w-full lg:w-[208px] h-[55px] cursor-pointer text-xl font-normal"
                asChild
              >
                <Link to={`/return`}>{t("booking_request_details.actions.approve")}</Link>
              </Button>
            </div>
          </div>
          <img
            className="object-cover size-full rounded-2xl"
            src="/assets/map-select.png"
            alt="Map"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
