import Footer from "~/components/layouts/footer";
import type { Route } from "./+types/publish";
import CarAnimation from "~/components/animated/car-animation";
import PublishRide from "~/components/common/publish-ride";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import RightPointingArrow from "~/components/icons/right-pointing-arrow";
import ReviewCarousel from "~/components/common/review-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import NavBar from "~/components/layouts/nav-bar";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Publish a ride" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation("translation", {
    keyPrefix: "publish",
  });

  return (
    <div>
      <div className="grid grid-cols-1 grid-rows-1">
        <img
          className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-0 w-full h-full object-cover"
          src="/assets/hero.png"
          alt=""
        />
        <div className="col-start-1 -col-end-1 row-start-1 -row-end-1 z-10 max-w-[1410px] w-full h-max mx-auto flex flex-col">
          <NavBar className="px-6" variant="publisher" />
          <h1 className="max-w-[928px] w-full text-3xl md:text-4xl lg:text-6xl font-medium mx-auto text-white text-center pt-16 lg:pt-[5rem] mb-0 lg:mb-[52px] px-6">
            {t("hero.title")} <br className="hidden lg:block" />
            {t("hero.subtitle")}
            <span className="text-[#FFC0C0]">{t("hero.highlight")}</span>
            {t("hero.end")}
          </h1>
          <div className="flex flex-col-reverse lg:flex-col">
            <div className="px-0 lg:px-6">
              <PublishRide />
            </div>
            <div className="flex justify-center p-0 lg:pt-10 pb-4 lg:pb-28 px-6">
              <CarAnimation />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1384px] w-full mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] py-12 lg:py-[100px] items-center justify-between gap-8">
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-4xl lg:text-[3.438rem] font-medium max-w-[514px] leading-tight lg:leading-[62px] mb-8">
              {t("publish.title")}
            </h2>
            <p className="text-base text-[#666666] font-light max-w-[498px] leading-[185%]">
              {t("publish.description")}
            </p>
          </div>
          <img className="w-full" src="/assets/people-car.png" alt="" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-center mb-10 lg:mb-[100px] gap-[30px] lg:divide-x divide-[#E9E9E9]">
          <div className="flex justify-center gap-6">
            <img className="h-[30px]" src="/assets/create-account.svg" alt="" />
            <div className="flex flex-col">
              <p className="text-xl lg:text-[1.563rem] leading-tight mb-2">
                {t("steps.create_account.title")}
              </p>
              <p className="text-base text-[#666666] font-light max-w-[334px] leading-tight lg:leading-[185%]">
                {t("steps.create_account.description")}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-6">
            <img className="h-[30px]" src="/assets/publish-ride.svg" alt="" />
            <div className="flex flex-col">
              <p className="text-xl lg:text-[1.563rem] leading-tight mb-2">
                {t("steps.publish_ride.title")}
              </p>
              <p className="text-base text-[#666666] font-light max-w-[334px] leading-tight lg:leading-[185%]">
                {t("steps.publish_ride.description")}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-6">
            <img className="h-[30px]" src="/assets/accept-booking.svg" alt="" />
            <div className="flex flex-col">
              <p className="text-xl lg:text-[1.563rem] leading-tight mb-2">
                {t("steps.accept_booking.title")}
              </p>
              <p className="text-base text-[#666666] font-light max-w-[334px] leading-tight lg:leading-[185%]">
                {t("steps.accept_booking.description")}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] items-center gap-10 lg:gap-[80px] mb-12 lg:mb-[138px]">
          <img src="/assets/carpool1.png" alt="" />
          <div className="flex flex-col">
            <p className="text-2xl lg:text-3xl mb-2">
              {t("benefits.drive.title")}
            </p>
            <p className="text-base text-[#666666] font-light max-w-[684px] mb-6">
              {t("benefits.drive.description")}
            </p>
            <p className="text-2xl lg:text-3xl mb-2">
              {t("benefits.share.title")}
            </p>
            <p className="text-base text-[#666666] font-light max-w-[684px] mb-6">
              {t("benefits.share.description")}
            </p>
            <p className="text-2xl lg:text-3xl mb-2">
              {t("benefits.save.title")}
            </p>
            <p className="text-base text-[#666666] font-light max-w-[684px] mb-6">
              {t("benefits.save.description")}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#002741]">
        <div className="max-w-[1384px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-[428px_auto] py-10 lg:py-[100px] gap-8 lg:gap-[60px]">
          <div className="flex flex-col">
            <p className="text-4xl lg:text-[3.438rem] text-white leading-[108%] mb-8">
              {t("testimonials.title")}
            </p>
            <p className="text-base lg:text-xl text-[#F0F0F0] font-light leading-[25px] mb-10">
              {t("testimonials.description")}
            </p>
            <Button className="bg-white rounded-full text-[#212B36] w-[203px] h-[45px] lg:h-[53px] text-base lg:text-lg hover:text-white hover:[&_path]:stroke-white">
              {t("testimonials.button")}{" "}
              <RightPointingArrow className="size-[20px]" />
            </Button>
          </div>
          <ReviewCarousel />
        </div>
      </div>
      <div className="max-w-[1384px] w-full mx-auto px-6 py-8 lg:py-[100px]">
        <p className="text-4xl lg:text-[3.438rem] max-w-[539px] text-center font-medium mx-auto leading-tight mb-8 lg:mb-12">
          {t("support.title")}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-center gap-8 lg:gap-[60px] mb-5 max-lg:text-center">
          <div className="max-lg:flex flex-col items-center justify-center">
            <img
              className="size-[60px] mb-2"
              src="/assets/service.svg"
              alt=""
            />
            <p className="text-[1.563rem] mb-2">{t("support.service.title")}</p>
            <p className="text-base text-[#424242] font-light">
              {t("support.service.description")}
            </p>
          </div>
          <div className="max-lg:flex flex-col items-center justify-center">
            <img className="size-[60px] mb-2" src="/assets/refund.svg" alt="" />
            <p className="text-[1.563rem] mb-2">{t("support.car.title")}</p>
            <p className="text-base text-[#424242] font-light">
              {t("support.car.description")}
            </p>
          </div>
          <div className="max-lg:flex flex-col items-center justify-center">
            <img className="size-[60px] mb-2" src="/assets/secure.svg" alt="" />
            <p className="text-[1.563rem] mb-2">{t("support.secure.title")}</p>
            <p className="text-base text-[#424242] font-light">
              {t("support.secure.description")}
            </p>
          </div>
        </div>
      </div>
      <Separator className="bg-[#E9E9E9]" />
      <div className="max-w-[1384px] w-full mx-auto pb-12 lg:pb-[144px] px-6">
        <h2 className="pt-6 lg:pt-[100px] text-4xl lg:text-[3.438rem] text-[#0A2033] text-center font-medium mx-auto leading-tight mb-12 max-w-[670px]">
          {t("faq.title")} <br className="max-lg:hidden" /> {t("faq.subtitle")}
          <span className="text-[#FF4848]">{t("faq.highlight")}</span>
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
                className="!border border-[#EBEBEB] rounded-[25px] px-[30px] py-[10px]"
                value="item-1"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.questions.book.title")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-6 pt-3">
                  {t("faq.questions.book.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[30px] py-[10px]"
                value="item-2"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.questions.cost.title")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-6 pt-3">
                  {t("faq.questions.cost.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[30px] py-[10px]"
                value="item-3"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.questions.cancel.title")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-6 pt-3">
                  {t("faq.questions.cancel.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right Column - 4 Accordions */}
          <div className="flex flex-col gap-4 lg:gap-7">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[30px] py-[10px]"
                value="item-4"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.questions.publish.title")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-6 pt-3">
                  {t("faq.questions.publish.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[30px] py-[10px]"
                value="item-5"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.questions.benefits.title")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-6 pt-3">
                  {t("faq.questions.benefits.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[30px] py-[10px]"
                value="item-6"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.questions.start.title")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-6 pt-3">
                  {t("faq.questions.start.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                className="!border border-[#EBEBEB] rounded-[25px] px-[30px] py-[10px]"
                value="item-7"
              >
                <AccordionTrigger className="text-lg lg:text-xl font-normal">
                  <span className="max-w-[calc(100%_-_50px)]">
                    {t("faq.questions.pets.title")}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-[#787E82] font-light leading-6 pt-3">
                  {t("faq.questions.pets.answer")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
