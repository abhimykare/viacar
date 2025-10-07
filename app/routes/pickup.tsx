import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import LocationSearch from "~/components/common/location-search";
import type { Route } from "./+types/pickup";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Pickup" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  return (
    <div>
      <Header title={t("pickup.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 py-12 lg:py-[100px] min-h-[800px]">
        <p className="text-2xl lg:text-[2.188rem] text-[#0A2033] text-center font-medium max-w-[478px] mx-auto leading-tight mb-[33px]">
          {t("pickup.title")}{" "}
          <span className="font-extralight"> {t("pickup.subtitle")}</span>
        </p>
        <LocationSearch
          name="pickup"
          path={`/dropoff?${searchParams.toString()}`}
          sectionName={t("pickup.section_name")}
          sectionTitle={t("pickup.section_title")}
        />
      </div>
      <Footer />
    </div>
  );
}
