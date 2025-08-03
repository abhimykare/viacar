import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/your-ride";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import TimeDirectionLargeIcon from "~/components/icons/time-direction-large-icon";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Publish Ride" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div>
      <Header
        title={t("your_ride.title")}
        breadcrumb={[
          { label: t("your_ride.breadcrumb.home"), href: "/" },
          {
            label: t("your_ride.breadcrumb.publish_ride"),
            href: "/publish-ride",
          },
          { label: t("your_ride.breadcrumb.your_ride"), href: "/your-ride" },
        ]}
      />
      <div className="max-w-[1388px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-4 lg:gap-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-2xl lg:text-[1.938rem]">
            {t("your_ride.ride_plan")}
          </p>
          <Button
            variant="outline"
            className="text-[#FF4848] border-[#EBEBEB] shadow-none rounded-full w-[249px] h-[40px] lg:h-[55px] cursor-pointer text-lg font-normal"
            asChild
          >
            <Link to={`/booking-request`}>
              {t("your_ride.passenger_request")}
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[#EBEBEB] rounded-2xl px-2 lg:px-6 py-4 lg:py-8">
            <div className="flex gap-2 lg:gap-4 h-full">
              <TimeDirectionLargeIcon time="4h 40m" />
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="text-xs lg:text-base text-[#939393] font-light">
                    {t("your_ride.pickup")}
                  </p>
                  <p className="text-base lg:text-lg mb-8">
                    {t("your_ride.locations.pickup")}
                  </p>
                </div>
                <div>
                  <p className="text-xs lg:text-base text-[#939393] font-light">
                    {t("your_ride.drop")}
                  </p>
                  <p className="text-base lg:text-lg">
                    {t("your_ride.locations.drop")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between text-end ml-auto">
                <div>
                  <p className="text-xs lg:text-base text-[#939393] font-light">
                    {t("your_ride.pickup_time")}
                  </p>
                  <p className="text-base lg:text-lg mb-8">13:00</p>
                </div>
                <div>
                  <p className="text-xs lg:text-base text-[#939393] font-light">
                    {t("your_ride.drop_time")}
                  </p>
                  <p className="text-base lg:text-lg">17:40</p>
                </div>
              </div>
              <div className="flex flex-col justify-between text-end ml-auto rtl:ml-0 rtl:mr-auto">
                <Button variant="ghost" size="icon">
                  <ChevronRight
                    className="size-[30px] rtl:rotate-180"
                    strokeWidth={1}
                    color="#666666"
                  />
                </Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight
                    className="size-[30px] rtl:rotate-180"
                    strokeWidth={1}
                    color="#666666"
                  />
                </Button>
              </div>
            </div>
          </div>
          <div className="border border-[#EBEBEB] rounded-2xl px-4 lg:px-6 py-6 lg:py-8 flex flex-col w-full divide-y divide-[#EBEBEB] divide-dashed">
            <Link
              to={`/publish-comment`}
              className="group py-4 flex items-center gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm lg:text-base font-normal">
                  {t("your_ride.verify_id")}
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
              to={`/ride-details`}
              className="group py-4 flex items-center gap-4 cursor-pointer"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm lg:text-base font-normal">
                  {t("your_ride.see_publication.title")}
                </span>
                <span className="text-sm text-[#939393] font-normal">
                  {t("your_ride.see_publication.views")}
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
              to={`/your-publication`}
              className="group py-4 flex items-center gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm lg:text-base font-normal">
                  {t("your_ride.edit_publication")}
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
