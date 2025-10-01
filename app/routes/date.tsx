import Header from "~/components/layouts/header";
import type { Route } from "./+types/date";
import Footer from "~/components/layouts/footer";
import { CalendarBasic } from "~/components/ui/calendar-basic";
import { useState, type SetStateAction } from "react";
import { isBefore, startOfDay } from "date-fns";
import { Button } from "~/components/ui/button";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Date" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const location = useLocation();
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
      <Header title={t("date.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center">
          {t("date.header_title")}
        </p>
        <div className="flex items-center justify-center">
          <CalendarBasic
            className="shadow-2xl rounded-2xl max-w-[394px]"
            mode="single"
            disabled={(date) => isBefore(date, startOfDay(new Date()))}
            selected={selected}
            onSelect={(value: SetStateAction<Date | undefined>) => {
              setSelected(value);
              if (value) {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('departure_date', value.toISOString().split('T')[0]);
                setSearchParams(newParams);
              }
            }}
            components={{
              Footer: () => (
                <tbody>
                  <tr>
                    <td>
                      <div className="flex items-center justify-center pt-10">
                        <Button
                          className="bg-[#FF4848] w-[140px] h-[48px] rounded-full"
                          asChild
                        >
                          <Link state={location.state} to={`/time?${searchParams.toString()}`}>
                            {t("date.apply")}
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ),
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
