import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/inbox";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { HiArrowSmallRight } from "react-icons/hi2";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Inbox" },
    { name: "description", content: "ViaCar" },
  ];
}

const requests = [
  {
    from: "Al Khobar, Saudi Arabia",
    to: "Ar Riyadh, Saudi Arabia",
    date: "Thu, 06 February",
    time: "08 : 00 pm",
  },
  {
    from: "Al Khobar, Saudi Arabia",
    to: "Ar Riyadh, Saudi Arabia",
    date: "Thu, 06 February",
    time: "08 : 00 pm",
  },
  {
    from: "Al Khobar, Saudi Arabia",
    to: "Ar Riyadh, Saudi Arabia",
    date: "Thu, 06 February",
    time: "08 : 00 pm",
  },
  {
    from: "Al Khobar, Saudi Arabia",
    to: "Ar Riyadh, Saudi Arabia",
    date: "Thu, 06 February",
    time: "08 : 00 pm",
  },
];

export default function Page() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="bg-[#F8FAFB]">
      <Header title={t("inbox.title")} />
      <div className="max-w-[745px] w-full mx-auto px-6 pt-8 lg:pt-[80px] pb-10 lg:pb-[100px] flex flex-col gap-2">
        <p className="text-3xl lg:text-[2.188rem] text-center mb-8">
          {t("inbox.title")}
        </p>
        {requests.map((request, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl shadow-md border border-[#E4E4E7]/30"
          >
            <Avatar className="size-[60px]">
              <AvatarImage src="/assets/profile-img2.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-base text-[#222222] mb-2">
                {t("inbox.request.passenger_name")}
              </p>
              <div
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-2 mb-1",
                  isRTL && "flex-row-reverse"
                )}
              >
                <p className="text-sm font-light">{t("inbox.request.from")}</p>
                <HiArrowSmallRight
                  className={cn(
                    "rotate-90 lg:rotate-0",
                    isRTL && "lg:rotate-180"
                  )}
                  color="#FF4848"
                />
                <p className="text-sm font-light">{t("inbox.request.to")}</p>
              </div>
              <p className="text-xs font-light inline-flex gap-4">
                <span>{t("inbox.request.date")}</span>
                <span>{t("inbox.request.time")}</span>
              </p>
            </div>
            <Button
              className={cn("ml-auto", isRTL && "ml-0 mr-auto")}
              variant="ghost"
              size="icon"
              asChild
            >
              <Link to={`/booking-request-details`}>
                <ChevronRight
                  className={cn("size-[25px]", isRTL && "rotate-180")}
                  color="#666666"
                />
              </Link>
            </Button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
