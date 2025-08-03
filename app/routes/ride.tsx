import { Check, ListFilter, X } from "lucide-react";
import SearchRide from "~/components/common/search-ride";
import Header from "~/components/layouts/header";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Route } from "./+types/ride";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { SwitchGreen } from "~/components/ui/switch-green";
import CheckboxCard from "~/components/ui/checkbox-card";
import RideItem from "~/components/common/ride-item";
import { Link } from "react-router";
import Footer from "~/components/layouts/footer";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import RideFilters from "~/components/common/ride-filter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import TimeDirectionIcon from "~/components/icons/time-direction-icon";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Select ride" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation("translation", { keyPrefix: "ride" });
  const [notify, setNotify] = useState(false);
  return (
    <ScrollArea className="h-screen">
      <Header title={t("title")} />
      <div className="grid grid-cols-1 lg:grid-cols-[400px_3fr]">
        <RideFilters className="max-lg:hidden h-screen" />
        <ScrollArea className="lg:h-screen">
          <div className="flex flex-col gap-12 bg-[#F5F5F5] px-6 lg:px-10 w-full">
            <div className="px-0 lg:px-4 pt-6 lg:pt-12 max-lg:max-w-[500px] max-lg:mx-auto w-full">
              <SearchRide className="!max-w-full" />
            </div>
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <Button
                  className="w-max shadow-none lg:hidden"
                  variant="outline"
                >
                  <ListFilter />
                  <span>{t("filters")}</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <RideFilters />
              </DrawerContent>
            </Drawer>
            <div className="grid grid-cols-1 xl:grid-cols-2 p-0 lg:p-5 !pt-0 !pb-0 gap-5">
              {Array.from({ length: 14 }, (_, index) => (
                <RideItem key={index + "rideitem"} />
              ))}
            </div>
            <div className="flex items-center justify-center p-5 pt-0 mb-5">
              {!notify ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#FF4848] rounded-full w-[233px] h-[55px] px-8 cursor-pointer text-xl font-normal">
                      {t("create_alert")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="!max-w-[917px] pt-20 pb-16">
                    <DialogHeader>
                      <DialogTitle className="text-4xl text-center font-normal mb-6">
                        {t("alert_dialog.title")}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center gap-4 mb-5">
                      <TimeDirectionIcon time="4h 40m" />
                      <div className="flex flex-col">
                        <p className="text-sm lg:text-base text-[#939393] font-light">
                          {t("alert_dialog.pickup")}
                        </p>
                        <p className="text-base lg:text-lg mb-8">
                          King Fahd Street , Al Khobar 34429 , Saudi Arabia
                        </p>
                        <p className="text-sm lg:text-base text-[#939393] font-light">
                          {t("alert_dialog.drop")}
                        </p>
                        <p className="text-base lg:text-lg">
                          Makhzoumi Street , Riyadh 13243 , Saudi Arabia
                        </p>
                      </div>
                    </div>
                    <Separator className="my-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
                    <p className="text-base text-[#666666] font-light text-center my-2">
                      {t("alert_dialog.description")}
                    </p>
                    <Input
                      className="border-[#EBEBEB] rounded-full h-[60px] max-w-[623px] w-full !ring-0 mx-auto text-lg font-light placeholder:text-[#666666] px-8"
                      type="email"
                      placeholder={t("alert_dialog.email_placeholder")}
                    />
                    <Button
                      onClick={() => setNotify(true)}
                      className="bg-[#FF4848] rounded-full w-[300px] h-[54px] px-8 cursor-pointer mx-auto text-xl font-normal mt-5"
                    >
                      {t("create_alert")}
                    </Button>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button className="bg-[#2DA771] rounded-full w-[233px] h-[55px] px-8 cursor-pointer text-xl font-normal">
                  {t("alert_created")}
                  <Check className="size-[20px]" />
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
      <Footer />
    </ScrollArea>
  );
}
