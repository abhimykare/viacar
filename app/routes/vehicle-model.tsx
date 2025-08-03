import VehicleSearch from "~/components/common/vehicle-search";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/add-vehicles";
import ModelSearch from "~/components/common/model-search";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Add Vehicles" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div>
      <Header title={t("add_vehicles.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 py-12 lg:py-[100px] min-h-[800px]">
        <p className="text-3xl lg:text-[2.188rem] text-[#0A2033] text-center font-medium max-w-[478px] mx-auto leading-tight mb-6">
          {t("add_vehicles.model.subtitle")}
        </p>
        <ModelSearch
          name="pickup"
          path="/dropoff"
          sectionName={t("add_vehicles.model.pickup.section_name")}
          sectionTitle={t("add_vehicles.model.pickup.section_title")}
        />
      </div>
      <Footer />
    </div>
  );
}
