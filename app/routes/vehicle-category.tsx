import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import * as RadioGroup from "@radix-ui/react-radio-group";
import type { Route } from "./+types/vehicle-category";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Select Category" },
    { name: "description", content: "ViaCar" },
  ];
}

const CheckIcon = () => (
  <img
    src="/assets/check-green.svg"
    alt="Check Icon"
    className="absolute inset-0 m-auto size-[33px] hidden group-data-[state=checked]:block"
  />
);

const routesData = [
  {
    id: "1",
    title: "Sedan",
    img: "/assets/sedan.png",
  },
  {
    id: "2",
    title: "Luxury",
    img: "/assets/luxury.png",
  },
  {
    id: "3",
    title: "SUV",
    img: "/assets/suv-category.png",
  },
];

export default function Page() {
  const { t } = useTranslation();

  return (
    <div>
      <Header title={t("vehicle_category.title")} />
      <div className="max-w-[1383px] w-full mx-auto px-6 py-12 lg:py-[100px] min-h-[800px]">
        <p className="text-2xl lg:text-[2.188rem] text-[#0A2033] text-center font-medium mx-auto leading-tight mb-6">
          {t("vehicle_category.select_category")}
        </p>
        <RadioGroup.Root
          defaultValue="1"
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {routesData.map(({ id, title, img }) => (
            <RadioGroup.Item key={id} value={id} id={id} asChild>
              <div className="group border border-[#EBEBEB] h-[316px] px-8 py-4 rounded-2xl bg-white flex flex-col items-center justify-between data-[state=checked]:border-[#69D2A5] data-[state=checked]:bg-[#F1FFF9] cursor-pointer">
                <img
                  className="m-auto h-[100px] object-contain"
                  src={img}
                  alt=""
                />
                <Label
                  htmlFor={id}
                  className="flex items-center justify-between gap-4 w-full"
                >
                  <span className="text-[1.563rem] font-medium">
                    {t(`vehicle_category.categories.${title.toLowerCase()}`)}
                  </span>
                  <div className="size-[33px] relative border border-gray-300 rounded-full flex items-center justify-center group-data-[state=checked]:border-transparent">
                    <CheckIcon />
                  </div>
                </Label>
              </div>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
        <div className="flex items-center justify-center pt-16">
          <Button
            className="bg-[#FF4848] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal"
            asChild
          >
            <Link to={`/vehicle-model`}>{t("vehicle_category.continue")}</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
