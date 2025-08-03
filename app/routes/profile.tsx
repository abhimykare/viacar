import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/profile";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import ChatIcon from "~/components/icons/chat-icon";
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
        title={t("profile.title")}
        breadcrumb={[
          { label: t("common.home"), href: "/" },
          { label: t("profile.breadcrumb.select_ride"), href: "/ride" },
          {
            label: t("profile.breadcrumb.ride_details"),
            href: "/ride-details",
          },
          { label: t("profile.breadcrumb.profile"), href: "/profile" },
        ]}
      />
      <div className="max-w-[1410px] w-full mx-auto px-6 pt-8 lg:pt-[60px] pb-10 lg:pb-[80px] flex flex-col lg:flex-row gap-10 lg:gap-[80px]">
        <div className="flex flex-col items-center justify-center gap-[40px]">
          <img src="/assets/profile-img.png" alt="" />
          <Button
            className="bg-[#FF4848] rounded-full h-[40px] lg:h-[55px] w-[183px] px-8 cursor-pointer text-base lg:text-xl"
            asChild
          >
            <Link to={`/chat`}>
              <ChatIcon className="!stroke-white size-[20px] lg:size-[30px]" />
              <span>{t("profile.chat")}</span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap gap-4 lg:gap-14 mb-8">
            <p className="text-[2.188rem]">{t("profile.user_name")}</p>
            <a
              className="flex items-center gap-1 text-lg text-[#666666]"
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CiLocationOn color="black" />
              <span>{t("profile.location")}</span>
            </a>
            <Button
              variant="outline"
              className="text-[#00A1FF] border-[#EBEBEB] shadow-none text-base font-light rounded-full h-[42px] !px-6 lg:ml-auto"
            >
              <LuInfo />
              <span>{t("profile.report_number")}</span>
            </Button>
          </div>
          <Link to={`/reviews`}>
            <p className="text-xl text-[#666666] font-light mb-1">
              {t("profile.rating")}
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
                {t("profile.verified.email")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckSquare color="#00F076" className="size-[22px]" />
              <p className="text-lg text-[#666666] font-light">
                {t("profile.verified.phone")}
              </p>
            </div>
            <p className="text-lg text-[#666666] font-light">
              <span className="text-[#00F076] mr-2">53</span>
              {t("profile.rides_published")}
            </p>
          </div>
          <p className="text-2xl mb-3">{t("profile.about")}</p>
          <p className="bg-[#F5F5F5] rounded-2xl p-4 lg:p-8 text-base font-light leading-[30px]">
            {t("profile.bio")}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
