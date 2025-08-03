import { useState } from "react";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/time";
import { Input } from "~/components/ui/input";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "~/components/ui/button";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Time" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const [hour, setHour] = useState<number>(7);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const { t } = useTranslation();

  const incrementHour = () => setHour((prev) => (prev === 12 ? 1 : prev + 1));
  const decrementHour = () => setHour((prev) => (prev === 1 ? 12 : prev - 1));

  const incrementMinute = () =>
    setMinute((prev) => (prev === 59 ? 0 : prev + 1));
  const decrementMinute = () =>
    setMinute((prev) => (prev === 0 ? 59 : prev - 1));

  const formattedMinute = minute.toString().padStart(2, "0");

  return (
    <div>
      <Header title={t("time.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center">
          {t("time.header_title")}
        </p>
        <div dir="ltr" className="flex items-center justify-center gap-2">
          <div className="relative group">
            <Input
              value={hour}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 1 && value <= 12) {
                  setHour(value);
                }
              }}
              className="bg-[#F5F5F5] border-transparent !text-5xl lg:!text-[5.313rem] text-[#3C3F4E] text-center w-[100px] lg:w-[145px] h-[75px] lg:h-[121px] !ring-0 border-0 leading-tight"
            />
            <div className="absolute right-2 top-0 bottom-0 group-hover:flex flex-col justify-center space-y-1 hidden">
              <button
                onClick={incrementHour}
                className="text-[#00665A] text-sm font-bold"
                type="button"
              >
                ▲
              </button>
              <button
                onClick={decrementHour}
                className="text-[#00665A] text-sm font-bold"
                type="button"
              >
                ▼
              </button>
            </div>
          </div>

          <p className="text-5xl lg:text-[5.313rem] text-[#3C3F4E] text-center font-beta">
            :
          </p>

          <div className="relative group">
            <Input
              value={formattedMinute}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 0 && value <= 59) {
                  setMinute(value);
                }
              }}
              className="bg-[#F5F5F5] border-transparent !text-5xl lg:!text-[5.313rem] text-[#3C3F4E] text-center w-[100px] lg:w-[145px] h-[75px] lg:h-[121px] !ring-0 border-0 leading-tight"
            />
            <div className="absolute right-2 top-0 bottom-0 group-hover:flex flex-col justify-center space-y-1  hidden">
              <button
                onClick={incrementMinute}
                className="text-[#00665A] text-sm font-bold"
                type="button"
              >
                ▲
              </button>
              <button
                onClick={decrementMinute}
                className="text-[#00665A] text-sm font-bold"
                type="button"
              >
                ▼
              </button>
            </div>
          </div>

          <RadioGroup.Root
            value={period}
            onValueChange={(val) => setPeriod(val as "AM" | "PM")}
            className="grid grid-rows-2 w-[60px] lg:w-[40px] h-[80px] lg:h-[121px] ml-2"
          >
            <RadioGroup.Item
              value="AM"
              className="ring-2 ring-[#00665A] rounded-t py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:text-white data-[state=checked]:font-medium data-[state=checked]:ring-[#00665A] data-[state=checked]:bg-[#00665A] text-[#5F6368] text-lg lg:text-[1.375rem] font-normal h-full cursor-pointer"
            >
              {t("time.am")}
            </RadioGroup.Item>
            <RadioGroup.Item
              value="PM"
              className="ring-2 ring-[#00665A] rounded-b py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:text-white data-[state=checked]:font-medium data-[state=state=checked]:ring-[#00665A] data-[state=checked]:bg-[#00665A] text-[#5F6368] text-lg lg:text-[1.375rem] font-normal h-full cursor-pointer"
            >
              {t("time.pm")}
            </RadioGroup.Item>
          </RadioGroup.Root>
        </div>
        <div className="flex items-center justify-center pt-6 lg:pt-10">
          <Button
            className="bg-[#FF4848] w-[140px] h-[48px] rounded-full"
            asChild
          >
            <Link state={location.state} to={`/passenger-count`}>
              {t("time.apply")}
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
