import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/your-ride";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Itinerary" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div>
      <Header
        title={t("itinerary.title")}
        breadcrumb={[
          { label: t("itinerary.breadcrumb.home"), href: "/" },
          {
            label: t("itinerary.breadcrumb.publish_ride"),
            href: "/publish-ride",
          },
          { label: t("itinerary.breadcrumb.your_ride"), href: "/your-ride" },
          {
            label: t("itinerary.breadcrumb.your_publication"),
            href: "/your-publication",
          },
          { label: t("itinerary.breadcrumb.itinerary"), href: "/itinerary" },
        ]}
      />
      <div className="max-w-[1388px] w-full mx-auto px-6 pt-8 lg:pt-[80px] pb-10 lg:pb-[100px] flex flex-col gap-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-3xl lg:text-[1.938rem]">
            {t("itinerary.ride_plan")}
          </p>
          <Button
            variant="outline"
            className="text-[#FF4848] border-[#EBEBEB] shadow-none rounded-full w-[200px] lg;w-[249px] h-[40px] lg:h-[55px] cursor-pointer text-base lg:text-lg font-normal"
            asChild
          >
            <Link to={`/booking-request`}>
              {t("itinerary.passenger_request")}
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[#EBEBEB] rounded-2xl px-6 py-8">
            <div className="flex gap-4 h-full">
              <img src="/assets/direction3.svg" alt="" />
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="text-base text-[#939393] font-light">
                    {t("itinerary.pickup.label")}
                  </p>
                  <p className="text-lg mb-8">
                    {t("itinerary.pickup.address")}
                  </p>
                </div>
                <div>
                  <p className="text-base text-[#939393] font-light">
                    {t("itinerary.stopover.label")}
                  </p>
                  <p className="text-lg mb-8">
                    {t("itinerary.stopover.address")}
                  </p>
                </div>
                <div>
                  <p className="text-base text-[#939393] font-light">
                    {t("itinerary.drop.label")}
                  </p>
                  <p className="text-lg">{t("itinerary.drop.address")}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between text-end ml-auto rtl:ml-0 rtl:mr-auto">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/pickup`}>
                    <ChevronRight
                      className="size-[30px] rtl:rotate-180"
                      strokeWidth={1}
                      color="#666666"
                    />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/stopovers-preview`}>
                    <ChevronRight
                      className="size-[30px] rtl:rotate-180"
                      strokeWidth={1}
                      color="#666666"
                    />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/dropoff`}>
                    <ChevronRight
                      className="size-[30px] rtl:rotate-180"
                      strokeWidth={1}
                      color="#666666"
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="border border-[#EBEBEB] rounded-2xl px-6 py-8 flex flex-col w-full divide-y divide-[#EBEBEB] divide-dashed">
            <Link
              to={`/date`}
              className="group py-4 flex items-center gap-4 cursor-pointer"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-base font-normal">
                  {t("itinerary.date.label")}
                </span>
                <span className="text-sm text-[#939393] font-normal">
                  {t("itinerary.date.value")}
                </span>
              </div>
              <div className="size-[30px] flex items-center justify-center ml-auto rtl:ml-0 rtl:mr-auto">
                <ChevronRight
                  className="size-[25px] rtl:rotate-180"
                  strokeWidth={1}
                  color="#666666"
                />
              </div>
            </Link>
            <Link
              to={`/time`}
              className="group py-4 flex items-center gap-4 cursor-pointer"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-base font-normal">
                  {t("itinerary.time.label")}
                </span>
                <span className="text-sm text-[#939393] font-normal">
                  {t("itinerary.time.value")}
                </span>
              </div>
              <div className="size-[30px] flex items-center justify-center ml-auto rtl:ml-0 rtl:mr-auto">
                <ChevronRight
                  className="size-[25px] rtl:rotate-180"
                  strokeWidth={1}
                  color="#666666"
                />
              </div>
            </Link>
            <Link
              to={`/stopovers`}
              className="group py-4 flex items-center gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl text-[#FF0000] font-normal">
                  {t("itinerary.manage_stopovers")}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
