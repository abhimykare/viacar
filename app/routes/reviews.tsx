import Header from "~/components/layouts/header";
import type { Route } from "./+types/reviews";
import Footer from "~/components/layouts/footer";
import { Card } from "~/components/ui/card";
import { MdOutlineStar, MdOutlineStarHalf } from "react-icons/md";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Fragment } from "react/jsx-runtime";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Reviews" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#F5F5F5]">
      <Header
        title={t("reviews.title")}
        breadcrumb={[
          { label: t("reviews.breadcrumb.home"), href: "/" },
          { label: t("reviews.breadcrumb.select_ride"), href: "/ride" },
          {
            label: t("reviews.breadcrumb.ride_details"),
            href: "/ride-details",
          },
          { label: t("reviews.breadcrumb.profile"), href: "/profile" },
          { label: t("reviews.breadcrumb.reviews"), href: "/reviews" },
        ]}
      />
      <div className="max-w-[1384px] w-full mx-auto px-6 pt-8 lg:pt-[60px] pb-10 lg:pb-[80px] flex flex-col gap-10 lg:gap-[80px]">
        <Card className="shadow-none border-[#EBEBEB] rounded-2xl px-10 py-8 flex flex-col w-full">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex flex-col items-center justify-center">
              <p className="text-[8.125rem] leading-[100%]">4.5</p>
              <div className="flex items-center">
                <MdOutlineStar color="#FF9C00" className="size-[22px]" />
                <MdOutlineStar color="#FF9C00" className="size-[22px]" />
                <MdOutlineStar color="#FF9C00" className="size-[22px]" />
                <MdOutlineStar color="#FF9C00" className="size-[22px]" />
                <MdOutlineStarHalf color="#FF9C00" className="size-[22px]" />
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr] w-full items-center justify-center gap-x-4">
              <p>5</p>
              <Progress
                value={50}
                className="w-full [&>div]:rounded-r-full [&>div]:bg-[#2DA771] bg-[#D9D9D9] h-[12px]"
              />
              <p>4</p>
              <Progress
                value={38}
                className="w-full [&>div]:rounded-r-full [&>div]:bg-[#2DA771] bg-[#D9D9D9] h-[12px]"
              />
              <p>3</p>
              <Progress
                value={30}
                className="w-full [&>div]:rounded-r-full [&>div]:bg-[#2DA771] bg-[#D9D9D9] h-[12px]"
              />
              <p>2</p>
              <Progress
                value={20}
                className="w-full [&>div]:rounded-r-full [&>div]:bg-[#2DA771] bg-[#D9D9D9] h-[12px]"
              />
              <p>1</p>
              <Progress
                value={35}
                className="w-full [&>div]:rounded-r-full [&>div]:bg-[#2DA771] bg-[#D9D9D9] h-[12px]"
              />
            </div>
          </div>
        </Card>
        <Card className="shadow-none border-[#EBEBEB] rounded-2xl px-6 lg:px-16 py-4 lg:py-6 flex flex-col w-full gap-6">
          {Array.from({ length: 4 }, (_, index) => (
            <Fragment key={index + "review"}>
              <div className="flex items-center gap-4 pt-6">
                <Avatar className="size-[50px] lg:size-[65px]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-lg lg:text-2xl">
                  {t("reviews.reviewer_name")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:gap-6">
                <div className="flex items-center">
                  <MdOutlineStar color="#FF9C00" className="size-[22px]" />
                  <MdOutlineStar color="#FF9C00" className="size-[22px]" />
                  <MdOutlineStar color="#FF9C00" className="size-[22px]" />
                  <MdOutlineStar color="#FF9C00" className="size-[22px]" />
                  <MdOutlineStarHalf color="#FF9C00" className="size-[22px]" />
                </div>
                <p className="text-lg">{t("reviews.review_date")}</p>
              </div>
              <p className={cn("text-base font-light", index === 3 && "mb-8")}>
                {t("reviews.review_text")}
              </p>
              {index < 3 && (
                <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
              )}
            </Fragment>
          ))}
        </Card>
      </div>
      <Footer />
    </div>
  );
}
