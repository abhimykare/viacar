import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "~/lib/utils";
import AccordionPlusIcon from "../icons/accordion-plus-icon";
import AccordionMinusIcon from "../icons/accordion-minus-icon";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>.plus]:hidden [&[data-state=open]>.minus]:block relative",
          isRTL && "text-right",
          className
        )}
        {...props}
      >
        {children}

        <AccordionPlusIcon
          className={cn(
            "size-[80px] lg:size-[93px] plus absolute transition-transform duration-200 data-[state=open]:hidden",
            isRTL
              ? "-top-3 lg:-top-5 -left-7 lg:-left-10 scale-x-[-1]"
              : "-top-3 lg:-top-5 -right-7 lg:-right-10"
          )}
        />
        <AccordionMinusIcon
          className={cn(
            "size-[80px] lg:size-[93px] minus absolute transition-transform duration-200 hidden data-[state=open]:block",
            isRTL
              ? "-top-3 lg:-top-5 -left-7 lg:-left-10 scale-x-[-1]"
              : "-top-3 lg:-top-5 -right-7 lg:-right-10"
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm",
        isRTL && "text-right"
      )}
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
