import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/your-publication";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Your Publication" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div>
      <Header
        title={t("your_publication.title")}
        breadcrumb={[
          { label: t("your_publication.breadcrumb.home"), href: "/" },
          {
            label: t("your_publication.breadcrumb.publish_ride"),
            href: "/publish-ride",
          },
          {
            label: t("your_publication.breadcrumb.your_ride"),
            href: "/your-ride",
          },
          {
            label: t("your_publication.breadcrumb.your_publication"),
            href: "/your-publication",
          },
        ]}
      />
      <div className="max-w-[716px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-4 lg:gap-7">
        <p className="text-2xl lg:text-[1.938rem] text-center mb-8">
          {t("your_publication.header")}
        </p>
        <div className="flex flex-col w-full divide-y divide-[#EBEBEB]">
          <Link
            to={`/itinerary`}
            className="group py-4 flex items-center gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="text-base font-normal">
                {t("your_publication.menu.itinerary")}
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
            to={`/route`}
            className="group py-4 flex items-center gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="text-base font-normal">
                {t("your_publication.menu.route")}
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
            to={`/your-pricing`}
            className="group py-4 flex items-center gap-4 cursor-pointer"
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-base font-normal">
                {t("your_publication.menu.price.title")}
              </span>
              <span className="text-sm text-[#939393] font-normal">
                {t("your_publication.menu.price.subtitle")}
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
            to={`/passenger-options`}
            className="group py-4 flex items-center gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="text-base font-normal">
                {t("your_publication.menu.seats")}
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
            to={`/booking-requests`}
            className="group py-4 flex items-center gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="text-base font-normal">
                {t("your_publication.menu.boost")}
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
          <div className="flex flex-col items-start gap-4 py-4">
            <Link
              to={`/date`}
              className="text-xl text-[#FF0000] font-normal p-0"
            >
              {t("your_publication.actions.duplicate")}
            </Link>
            <Link
              to={`/date`}
              className="text-xl text-[#FF0000] font-normal p-0"
            >
              {t("your_publication.actions.return")}
            </Link>
            <Link to={``} className="text-xl text-[#FF0000] font-normal p-0">
              {t("your_publication.actions.cancel")}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
