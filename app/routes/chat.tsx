import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import type { Route } from "./+types/chat";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PiDotsThreeOutlineLight, PiWarningLight } from "react-icons/pi";
import { Separator } from "~/components/ui/separator";
import { GoChevronRight } from "react-icons/go";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { BsSend } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Chat" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div>
      <Header title={t("chat.title")} />
      <div className="max-w-[1000px] w-full mx-auto px-6 pt-[60px] pb-[80px] flex gap-[80px]">
        <Card className="shadow-none w-full p-8 gap-x-6 gap-y-2">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="size-[26px] rtl:rotate-180" />
            </Button>
            <Link className="flex items-center gap-6" to={`/profile`}>
              <Avatar className="size-[40px] lg:size-[55px]">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-xl lg:text-[1.75rem]">{t("chat.user_name")}</p>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto" variant="ghost" size="icon">
                  <PiDotsThreeOutlineLight
                    className="size-[25px] lg:size-[33px]"
                    color="#FF4848"
                  />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full !max-w-[888px] p-8">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-normal text-center mt-8 mb-8">
                    {t("chat.guidelines.title")}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-[#666666] font-light">
                    {t("chat.guidelines.no_contact_info")}
                  </p>
                  <div className="text-sm text-[#666666] font-light">
                    {t("chat.guidelines.message_filtering")}
                    <Link to={``} className="text-[#FF4848] ml-2">
                      {t("chat.guidelines.terms_conditions")}
                    </Link>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {t("chat.guidelines.save_changes")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <p className="text-lg">{t("chat.ride_details.pickup")}</p>
                <ArrowRight
                  color="#FF4848"
                  className="size-[23px] rotate-90 lg:rotate-0 rtl:rotate-180"
                />
                <p className="text-lg">{t("chat.ride_details.dropoff")}</p>
              </div>
              <p className="text-sm">{t("chat.ride_details.date_time")}</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/ride-details`}>
                <GoChevronRight color="#666666" className="size-[28px] rtl:rotate-180" />
              </Link>
            </Button>
          </div>
          <Separator className="mb-8 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
          <ScrollArea className="bg-[#F5F5F5] rounded-xl h-[784px] relative p-4">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-sm font-light mb-4">
                <span className="text-[#939393]">
                  {t("chat.messages.moderate_info")}
                </span>
                <Link to={``} className="text-[#FF4848] ml-2">
                  {t("chat.messages.guidelines_link")}
                </Link>
              </div>
              <div className="text-sm font-light flex items-center gap-2">
                <PiWarningLight color="#FF0000" className="size-[18px]" />
                <span className="text-[#FF0000]">
                  {t("chat.messages.scam_warning")}
                  <Link to={``}>{t("chat.messages.learn_more")}</Link>
                </span>
              </div>
            </div>
            <div className="relative my-4 flex items-center justify-center overflow-hidden">
              <Separator className="h-0 border-t border-dashed bg-transparent" />
              <div className="text-center bg-[#F5F5F5] text-lg font-light">
                {t("chat.messages.new")}
              </div>
              <Separator className="h-0 border-t border-dashed bg-transparent" />
            </div>
            <div className="mb-[100px]">
              <div className="flex gap-4">
                <Avatar className="size-[30px]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="rounded-tl-[1px] rounded-[10px] bg-[#D9D9D9] text-black px-4 py-2 text-base font-light mt-3">
                  {t("chat.messages.hello")}
                </div>
              </div>
              <div className="flex flex-row-reverse gap-4">
                <Avatar className="size-[30px]">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="rounded-tr-[1px] rounded-[10px] bg-[#FF4848] text-white px-4 py-2 text-base font-light mt-3">
                  {t("chat.messages.hello")}
                </div>
              </div>
            </div>
            <Label
              className="absolute inset-x-4 lg:inset-x-16"
              htmlFor="message"
            >
              <Input
                name="message"
                className="rounded-full bg-white border border-[#EBEBEB] shadow-none text-sm font-light pl-6 pr-24 placeholder:text-[#666666] min-h-[50px] placeholder:align-middle focus-visible:ring-0"
                placeholder={t("chat.input.placeholder")}
              />
              <Button
                variant="default"
                className="bg-[#2DA771] w-[55px] h-[35px] rounded-full absolute right-4"
              >
                <BsSend className="size-[20px]" />
              </Button>
            </Label>
          </ScrollArea>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
