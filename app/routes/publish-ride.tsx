import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/publish-ride";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import ApprovedAnimation from "~/components/animated/approved-animation";
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
      <Header title={t("publish_ride.title")} />
      <div className="flex flex-col items-center justify-center bg-[#EEFFFD] p-8 lg:p-[60px]">
        <ApprovedAnimation />
        <p className="text-2xl lg:text-[1.938rem] font-medium text-center max-w-[530px] leading-tight mt-6">
          {t("publish_ride.success")}
        </p>
      </div>
      <div className="max-w-[716px] w-full mx-auto px-6 pt-[80px] pb-[100px] flex flex-col gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center leading-tight">
          {t("publish_ride.verify")}
        </p>
        <div className="flex flex-col max-w-[716px] w-full mx-auto divide-y divide-[#EBEBEB]">
          <Link
            to={`/publish-comment`}
            className="group py-6 flex items-center gap-4 cursor-pointer border-b border-[#EBEBEB]"
          >
            <div className="flex items-center gap-4">
              <img
                className="size-[26px]"
                src="/assets/check-green.svg"
                alt=""
              />
              <span className="text-base font-normal">
                {t("publish_ride.publish_return")}
              </span>
            </div>
            <div className="size-[30px] flex items-center justify-center ml-auto rtl:ml-0 rtl:mr-auto">
              <ChevronRight
                className="size-[30px] rtl:rotate-180"
                strokeWidth={1}
              />
            </div>
          </Link>
          <Link
            to={``}
            className="group py-6 flex items-center gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                className="size-[26px]"
                src="/assets/check-green.svg"
                alt=""
              />
              <span className="text-base font-normal">
                {t("publish_ride.publish_later")}
              </span>
            </div>
            <div className="size-[30px] flex items-center justify-center ml-auto rtl:ml-0 rtl:mr-auto">
              <ChevronRight
                className="size-[30px] rtl:rotate-180"
                strokeWidth={1}
              />
            </div>
          </Link>
        </div>
        <Button
          variant="outline"
          className="text-[#FF4848] border-[#EBEBEB] shadow-none rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal mx-auto mt-6"
          asChild
        >
          <Link to={`/your-ride`}>{t("publish_ride.see_ride")}</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}
