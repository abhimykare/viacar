import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import LeftArrow from "../icons/left-arrow";
import RightArrow from "../icons/right-arrow";

const datePricing = [
  { day: 2, price: "SR 460.00" },
  { day: 4, price: "SR 460.00" },
  { day: 6, price: "SR 460.00" },
  { day: 9, price: "SR 460.00" },
  { day: 11, price: "SR 460.00" },
  { day: 17, price: "SR 460.00" },
  { day: 19, price: "SR 460.00" },
  { day: 22, price: "SR 460.00" },
  { day: 25, price: "SR 460.00" },
  { day: 30, price: "SR 460.00" },
];

function Calendar({
  className,
  classNames,
  selected,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("px-6 py-4", className)}
      formatters={{
        formatWeekdayName: (date, options) =>
          date.toLocaleDateString("en-US", { weekday: "short" }),
        formatDay: (date, options) => {
          const currentDatePricing = datePricing.find(
            (item) => item.day == date.getDate()
          );
          return (
            <div className="relative">
              <div
                className={cn(
                  "size-8 text-sm flex items-center justify-center",
                  selected && (selected as Date)?.getDate() == date.getDate()
                    ? "bg-[#2DA771] text-white rounded-full"
                    : ""
                )}
              >
                {date.getDate()}
              </div>
              {currentDatePricing && (
                <p
                  className={cn(
                    "absolute -bottom-4 left-0 right-0 text-[8px] text-center flex items-center justify-center",
                    selected && (selected as Date)?.getDate() == date.getDate()
                      ? "text-[#00665A] text-[10px]"
                      : "text-[#999999]"
                  )}
                >
                  {currentDatePricing.price}
                </p>
              )}
            </div>
          );
        },
      }}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-2 text-[#4A5660]",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-normal text-[#4A5660] text-base",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "w-[12px] h-max bg-transparent !p-0 opacity-50 hover:opacity-100 text-[#B5BEC6]"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex gap-3",
        head_cell:
          "text-[#B5BEC6] uppercase rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-3 gap-3",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:text-white [&:has([aria-selected])]:bg-[#2DA771] [&:has([aria-selected].day-range-end)]:rounded-r-full size-9 flex items-center justify-center",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
            : "[&:has([aria-selected])]:rounded-full"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 rounded-full"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-[#2DA771] aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-[#2DA771] aria-selected:text-white",
        day_selected:
          "bg-[#2DA771] text-white hover:bg-[#2DA771] hover:text-white focus:bg-[#2DA771] focus:text-white",
        day_today: "",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <LeftArrow className={cn("!size-5", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <RightArrow className={cn("!size-5", className)} {...props} />
        ),
        ...props.components,
      }}
      {...props}
    />
  );
}

export { Calendar };
