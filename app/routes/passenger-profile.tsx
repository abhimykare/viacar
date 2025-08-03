import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/profile";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { CiLocationOn } from "react-icons/ci";
import { LuInfo } from "react-icons/lu";
import { MdOutlineStar, MdOutlineStarHalf } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Profile" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#F8FAFB]">
      <Header
        title={t("passenger_profile.title")}
        breadcrumb={[
          { label: t("common.home"), href: "/" },
          {
            label: t("passenger_profile.breadcrumb.booking_request"),
            href: "/booking-request",
          },
          {
            label: t("passenger_profile.breadcrumb.booking_request_details"),
            href: "/booking-request-details",
          },
          {
            label: t("passenger_profile.breadcrumb.profile"),
            href: "/profile",
          },
        ]}
      />
      <div className="max-w-[1410px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col lg:flex-row items-start gap-6 lg:gap-[80px]">
        <div className="flex flex-col items-center justify-center gap-[40px] max-lg:w-full">
          <img src="/assets/profile-img2.png" alt="" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-14 mb-8">
            <p className="text-2xl lg:text-[2.188rem]">
              {t("passenger_profile.user_name")}
            </p>
            <a
              className="flex items-center gap-1 text-base lg:text-lg text-[#666666]"
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CiLocationOn color="black" />
              <span>{t("passenger_profile.location")}</span>
            </a>
            <Button
              variant="outline"
              className="text-[#00A1FF] border-[#EBEBEB] shadow-none text-base font-light rounded-full h-[42px] !px-6 lg:ml-auto"
            >
              <LuInfo />
              <span>{t("passenger_profile.report_number")}</span>
            </Button>
          </div>
          <Link to={`/reviews`}>
            <p className="text-base lg:text-xl text-[#666666] font-light mb-1">
              {t("passenger_profile.rating")}
            </p>
            <div className="flex items-center mb-8">
              <p className="text-[1.563rem] mr-4">4.5</p>
              <MdOutlineStar color="#FF9C00" className="size-[22px]" />
              <MdOutlineStar color="#FF9C00" className="size-[22px]" />
              <MdOutlineStar color="#FF9C00" className="size-[22px]" />
              <MdOutlineStar color="#FF9C00" className="size-[22px]" />
              <MdOutlineStarHalf color="#FF9C00" className="size-[22px]" />
            </div>
          </Link>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-[80px] mb-[40px]">
            <div className="flex items-center gap-3">
              <FiCheckSquare color="#00F076" className="size-[22px]" />
              <p className="text-lg text-[#666666] font-light">
                {t("passenger_profile.verified.email")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckSquare color="#00F076" className="size-[22px]" />
              <p className="text-lg text-[#666666] font-light">
                {t("passenger_profile.verified.phone")}
              </p>
            </div>
            <p className="text-lg text-[#666666] font-light">
              <span className="text-[#00F076] mr-2">53</span>
              {t("passenger_profile.rides_published")}
            </p>
          </div>
          <p className="text-2xl mb-3 border-b border-[#EBEBEB] pb-2">
            {t("passenger_profile.about")}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 w-max gap-x-4 gap-y-2 mb-5">
            <p className="text-lg text-[#666666] font-light">
              {t("passenger_profile.phone_number")}
            </p>
            <p className="text-lg font-light">9484738312</p>
            <p className="text-lg text-[#666666] font-light">
              {t("passenger_profile.email")}
            </p>
            <p className="text-lg font-light">abhimanyu123@gmail.com</p>
            <p className="text-lg text-[#666666] font-light">
              {t("passenger_profile.experience")}
            </p>
            <p className="text-lg font-light">
              {t("passenger_profile.experience_level")}
            </p>
          </div>
          <p className="bg-[#F5F5F5] rounded-2xl p-8 text-base font-light leading-[30px]">
            {t("passenger_profile.bio")}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
