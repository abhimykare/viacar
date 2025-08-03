import { useState, useEffect } from "react";
import { format, isBefore, isToday, isTomorrow, startOfDay } from "date-fns";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CalendarIcon from "../icons/calendar-icon";
import { Calendar } from "../ui/calendar-pricing";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

function DatePicker() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultDate = new Date();
  const dateParam = searchParams.get("date");
  const initialDate = dateParam ? new Date(dateParam) : defaultDate;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  );
  const [tempDate, setTempDate] = useState<Date | undefined>(initialDate);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const param = searchParams.get("date");
    if (param) {
      const newDate = new Date(param);
      if (
        !selectedDate ||
        format(newDate, "yyyy-MM-dd") !== format(selectedDate, "yyyy-MM-dd")
      ) {
        setSelectedDate(newDate);
        setTempDate(newDate);
      }
    }
  }, [searchParams, selectedDate]);

  const getDisplayDate = (date: Date | undefined) => {
    if (!date) return t("search.ride.date.placeholder");
    if (isToday(date)) return t("search.ride.date.today");
    if (isTomorrow(date)) return t("search.ride.date.tomorrow");
    return format(date, "PPP");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "text-left text-sm lg:text-base text-[#424242] font-normal border-0 rounded-full w-full max-lg:h-[50px] !bg-transparent shadow-none max-lg:mx-auto max-lg:justify-between max-lg:!bg-[#F1F1F5] pl-6 pr-2",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <span className="text-[17px] text-[#282525] font-normal block lg:hidden">
            {t("search.ride.date.label")}
          </span>
          <span className="flex items-center gap-2 max-lg:bg-white max-lg:rounded-full h-[40px] px-6 max-lg:min-w-[115px]">
            <CalendarIcon className="size-5 lg:size-6" />
            {getDisplayDate(selectedDate)}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={tempDate}
          onSelect={setTempDate}
          disabled={(date) => isBefore(date, startOfDay(new Date()))}
          initialFocus
          components={{
            Footer: () => (
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center justify-center pt-10">
                      <Button
                        className="bg-[#FF4848] w-[140px] h-[48px] rounded-full"
                        onClick={() => {
                          setSelectedDate(tempDate);
                          setIsOpen(false);
                          setSearchParams(
                            (prev) => {
                              const newParams = new URLSearchParams(prev);
                              if (tempDate) {
                                const formattedDate = format(
                                  tempDate,
                                  "yyyy-MM-dd"
                                );
                                newParams.set("date", formattedDate);
                              } else {
                                newParams.delete("date");
                              }
                              return newParams;
                            },
                            { replace: true }
                          );
                        }}
                      >
                        {t("search.ride.date.apply")}
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            ),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
