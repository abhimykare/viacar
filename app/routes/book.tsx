import type { Route } from "./+types/book";
import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";
import CarAnimation from "~/components/animated/car-animation";
import LocationStepIcon from "~/components/icons/location-step-icon";
import DateStepIcon from "~/components/icons/date-step-icon";
import BookStepIcon from "~/components/icons/book-step-icon";
import { cn } from "~/lib/utils";
import MoneyBagIcon from "~/components/icons/money-bag-icon";
import CarScrollAnimated from "~/components/animated/car-scroll-animated";
import RightPointingArrow from "~/components/icons/right-pointing-arrow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import SearchRide from "~/components/common/search-ride";
import Footer from "~/components/layouts/footer";
import NavBar from "~/components/layouts/nav-bar";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Book a ride" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Book() {
  const { t } = useTranslation("translation", { keyPrefix: "book" });

  const steps = [
    {
      key: 1,
      title: t("steps.0.title"),
      desc: t("steps.0.desc"),
      icon: LocationStepIcon,
      color: "bg-[#F0F9FD]",
    },
    {
      key: 2,
      title: t("steps.1.title"),
      desc: t("steps.1.desc"),
      icon: DateStepIcon,
      color: "bg-[#F5F5F5]",
    },
    {
      key: 3,
      title: t("steps.2.title"),
      desc: t("steps.2.desc"),
      icon: BookStepIcon,
      color: "bg-[#FCF6ED]",
    },
  ];

  const convenience = [
    {
      key: 1,
      title: t("convenience.0.title"),
      desc: t("convenience.0.desc"),
      icon: MoneyBagIcon,
    },
    {
      key: 2,
      title: t("convenience.1.title"),
      desc: t("convenience.1.desc"),
      icon: MoneyBagIcon,
    },
    {
      key: 3,
      title: t("convenience.2.title"),
      desc: t("convenience.2.desc"),
      icon: MoneyBagIcon,
    },
    {
      key: 4,
      title: t("convenience.3.title"),
      desc: t("convenience.3.desc"),
      icon: MoneyBagIcon,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 grid-rows-1 ">
        <img
          className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-0 w-full h-full object-cover"
          src="/assets/hero.png"
          alt=""
        />
        <div className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-10 max-w-[1410px] w-full h-max mx-auto flex flex-col">
          <NavBar className="px-6" />
          <h1 className="max-w-[645px] w-full text-3xl md:text-4xl lg:text-6xl font-medium mx-auto text-white text-center pt-[5rem] mb-0 lg:mb-[52px] px-6">
            {t("hero_title")}{" "}
            <span className="text-[#FFC0C0]">{t("hero_highlight")}</span>{" "}
            {t("hero_subtitle")}
          </h1>
          <div className="flex flex-col-reverse lg:flex-col">
            <div className="px-0 lg:px-6">
              <SearchRide />
            </div>
            <div className="flex justify-center p-0 lg:pt-10 pb-4 lg:pb-28 px-6">
              <CarAnimation />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10 lg:pt-[133px] max-w-[1410px] w-full mx-auto px-6">
        <p className="text-[#7E7E7E] text-base lg:text-lg font-normal text-center">
          {t("steps_subtitle")}
        </p>
        <h2 className="text-3xl lg:text-[3.438rem] text-[#0A2033] text-center font-medium mb-8 lg:mb-[4.2rem]">
          {t("steps_title")}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-14 mb-10 lg:mb-[142px]">
          {steps.map((step) => (
            <div
              key={step.key + "step"}
              className={cn(
                "min-h-[280px] lg:min-h-[384px] w-full rounded-[20px] flex flex-col items-center justify-center text-center",
                step.color
              )}
            >
              <step.icon className="drop-shadow-2xl mb-[20px] size-[80px] lg:size-[102px]" />
              <h3 className="text-2xl lg:text-[30px] mb-[12px]">
                {step.title}
              </h3>
              <p className="text-sm lg:text-base text-[#666666] font-light px-9 max-lg:leading-tight">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#EDF8F8]">
        <div className="pt-12 lg:pt-[133px] max-w-[1410px] w-full mx-auto pb-10 lg:pb-[144px] px-6">
          <h2 className="text-3xl lg:text-[3.438rem] text-[#0A2033] text-center font-medium max-md:mb-10 mb-[4.2rem] max-w-[491px] mx-auto leading-tight">
            {t("convenience_title")}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr_1fr] gap-6">
            {convenience.map((item) => (
              <div
                key={item.key + "convenience"}
                className="bg-white rounded-[20px] min-h-[286px] flex flex-col items-center justify-center p-10 text-center"
              >
                <item.icon className="size-[50px] lg:size-[60px]" />
                <h3 className="mt-[15px] text-xl lg:text-[25px] mb-[14px] max-lg:mt-4 max-lg:leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm lg:text-base text-[#666666] font-light leading-tight lg:leading-loose max-w-[399px]">
                  {item.desc}
                </p>
              </div>
            ))}
            <CarScrollAnimated />
          </div>
        </div>
      </div>
      <div dir="ltr" className="grid grid-cols-1 grid-rows-1">
        <img
          className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-0 w-full h-full object-cover"
          src="/assets/driving.png"
          alt=""
        />
        <img
          className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-[1] w-full h-full object-cover"
          src="/assets/driving-overlay.svg"
        />
        <div className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-[2] pt-14 lg:pt-[133px] max-w-[1410px] w-full mx-auto pb-14 lg:pb-[144px] flex flex-col justify-center px-6">
          <p className="text-3xl lg:text-[65px] font-medium text-white max-w-[453px] leading-[108%] mb-4 lg:mb-6">
            {t("driving_title")}
          </p>
          <p className="text-base lg:text-lg text-[#F0F0F0] font-light mb-[40px] lg:mb-[53px]">
            {t("driving_subtitle")}
          </p>
          <Button className="bg-white rounded-full text-[#212B36] w-[180px] lg:w-[203px] h-[45px] lg:h-[53px] text-base lg:text-lg hover:text-white hover:[&_path]:stroke-white">
            {t("offer_ride")} <RightPointingArrow className="size-[20px]" />
          </Button>
        </div>
      </div>
      <div className="pt-14 lg:pt-[100px] max-w-[1410px] w-full mx-auto pb-10 lg:pb-[144px] px-6">
        <h2 className="text-4xl lg:text-[3.438rem] text-[#0A2033] text-center font-medium mx-auto leading-tight mb-8 lg:mb-12">
          {t("help_center_title")}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-7">
          {/* Left Column - First one open */}
          <div className="flex flex-col gap-4 lg:gap-7">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full"
            >
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[20px] lg:px-[30px] py-[5px] lg:py-[10px]"
                value="item-1"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.0.question")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-tight lg:leading-6 pt-1 lg:pt-3">
                  {t("faq.0.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[20px] lg:px-[30px] py-[5px] lg:py-[10px]"
                value="item-2"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.1.question")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-tight lg:leading-6 pt-1 lg:pt-3">
                  {t("faq.1.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[20px] lg:px-[30px] py-[5px] lg:py-[10px]"
                value="item-3"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.2.question")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-tight lg:leading-6 pt-1 lg:pt-3">
                  {t("faq.2.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right Column - 4 Accordions */}
          <div className="flex flex-col gap-4 lg:gap-7">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[20px] lg:px-[30px] py-[5px] lg:py-[10px]"
                value="item-4"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.3.question")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-tight lg:leading-6 pt-1 lg:pt-3">
                  {t("faq.3.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[20px] lg:px-[30px] py-[5px] lg:py-[10px]"
                value="item-5"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.4.question")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-tight lg:leading-6 pt-1 lg:pt-3">
                  {t("faq.4.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[20px] lg:px-[30px] py-[5px] lg:py-[10px]"
                value="item-6"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.5.question")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-tight lg:leading-6 pt-1 lg:pt-3">
                  {t("faq.5.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[20px] lg:px-[30px] py-[5px] lg:py-[10px]"
                value="item-7"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.6.question")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-tight lg:leading-6 pt-1 lg:pt-3">
                  {t("faq.6.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="bg-[#F5F5F5]">
        <div className="pt-10 lg:pt-[100px] max-w-[1410px] w-full mx-auto px-6">
          <h2 className="text-4xl lg:text-[3.438rem] text-[#0A2033] text-center font-medium mx-auto leading-tight mb-9">
            {t("download_title")}
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3.5 mb-24">
            <NavLink to="/">
              <img src="/assets/google-play.svg" />
            </NavLink>
            <NavLink to="/">
              <img src="/assets/app-store.svg" />
            </NavLink>
          </div>
          <img
            className="max-w-[745px] w-full mx-auto"
            src="/assets/app.png"
            alt=""
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
