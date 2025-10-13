import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/pickup";
import LocationSearch from "~/components/common/location-search";
import { useTranslation } from "react-i18next";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Drop-off" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const setDropoff = useRideCreationStore((state) => state.setDropoff);
  
  // Debug: Check current store state
  const currentDropoff = useRideCreationStore((state) => state.rideData.dropoff);
  console.log("Current dropoff in store:", currentDropoff);

  return (
    <div>
      <Header title={t("dropoff.title")} />
      <div className="max-w-[1379px] w-full mx-auto px-6 py-12 lg:py-[100px] min-h-[800px]">
        <p className="text-2xl lg:text-[2.188rem] text-[#0A2033] text-center font-medium max-w-[478px] mx-auto leading-tight mb-[33px]">
          {t("dropoff.title")}{" "}
          <span className="font-extralight"> {t("dropoff.subtitle")}</span>
        </p>
        <LocationSearch
          name="dropoff"
          path="/route"
          sectionName={t("dropoff.section_name")}
          sectionTitle={t("dropoff.section_title")}
          onLocationSelect={(location) => {
            console.log("Location selected in dropoff:", location);
            setDropoff(location);
            console.log("Dropoff set in store");
          }}
        />
      </div>
      <Footer />
    </div>
  );
}
