import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/return";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Return Ride" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const setIsReturn = useRideCreationStore((state) => state.setIsReturn);

  return (
    <div>
      <Header title={t("return.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-4 lg:gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center leading-tight">
          {t("return.header_title")}
          <br />
          {t("return.subtitle")}
        </p>
        <div className="flex flex-col max-w-[716px] w-full mx-auto divide-y divide-[#EBEBEB]">
          <Link
            to="/route"
            state={{ isReturn: true }}
            className="group py-6 flex items-center gap-4 cursor-pointer border-b border-[#EBEBEB]"
            onClick={() => setIsReturn(true)}
          >
            <div className="flex items-center gap-1">
              <span className="text-base font-normal">
                {t("return.publish_return")}
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
            to="/publish-comment"
            className="group py-6 flex items-center gap-4 cursor-pointer border-b border-[#EBEBEB]"
            onClick={() => setIsReturn(false)}
          >
            <div className="flex items-center gap-1">
              <span className="text-base font-normal">
                {t("return.publish_later")}
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
      </div>
      <Footer />
    </div>
  );
}
