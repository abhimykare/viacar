import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import * as RadioGroup from "@radix-ui/react-radio-group";
import type { Route } from "./+types/vehicle-category";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Link, useSearchParams } from "react-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/lib/api";
import { useRideCreationStore } from "~/lib/store/rideCreationStore";

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

interface VehicleCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string;
  is_active: boolean;
  sort_order: number;
}

export default function Page() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const selectedVehicleId = searchParams.get("selectedVehicleId");
  const selectedVehicleName = searchParams.get("selectedVehicleName");
  const returnTo = searchParams.get("returnTo");
  const setVehicleCategoryId = useRideCreationStore(
    (state) => state.setVehicleCategoryId
  );

  const [categories, setCategories] = React.useState<VehicleCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.getVehicleCategories();
        if (response.success && response.data) {
          setCategories(response.data);
          // Set default selection to first category if available
          if (response.data.length > 0) {
            setSelectedCategory(response.data[0].id.toString());
            setVehicleCategoryId(response.data[0].id);
          }
        } else {
          setError("Failed to load vehicle categories");
        }
      } catch (err) {
        console.error("Error fetching vehicle categories:", err);
        setError("Failed to load vehicle categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [setVehicleCategoryId]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const categoryId = parseInt(value);
    setVehicleCategoryId(categoryId);
  };

  if (loading) {
    return (
      <div>
        <Header title={t("vehicle_category.title")} />
        <div className="max-w-[1383px] w-full mx-auto px-6 py-12 lg:py-[100px] min-h-[800px]">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4848] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading vehicle categories...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title={t("vehicle_category.title")} />
        <div className="max-w-[1383px] w-full mx-auto px-6 py-12 lg:py-[100px] min-h-[800px]">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">Error</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#FF4848] rounded-full px-6 py-2 text-white"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header title={t("vehicle_category.title")} />
      <div className="max-w-[1383px] w-full mx-auto px-6 py-12 lg:py-[100px] min-h-[800px]">
        <p className="text-2xl lg:text-[2.188rem] text-[#0A2033] text-center font-medium mx-auto leading-tight mb-6">
          {t("vehicle_category.select_category")}
        </p>
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No vehicle categories available.</p>
          </div>
        ) : (
          <RadioGroup.Root
            value={selectedCategory}
            onValueChange={handleCategoryChange}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {categories.map((category) => (
              <RadioGroup.Item
                key={category.id}
                value={category.id.toString()}
                id={category.id.toString()}
                asChild
              >
                <div className="group border border-[#EBEBEB] h-[316px] px-8 py-4 rounded-2xl bg-white flex flex-col items-center justify-between data-[state=checked]:border-[#69D2A5] data-[state=checked]:bg-[#F1FFF9] cursor-pointer">
                  <img
                    className="m-auto h-[100px] object-contain"
                    src={category.image || `/assets/${category.slug}.png`}
                    alt={category.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `/assets/${category.slug}.png`;
                    }}
                  />
                  <Label
                    htmlFor={category.id.toString()}
                    className="flex items-center justify-between gap-4 w-full"
                  >
                    <span className="text-[1.563rem] font-medium">
                      {t(
                        `vehicle_category.categories.${category.slug.toLowerCase()}`
                      ) || category.name}
                    </span>
                    <div className="size-[33px] relative border border-gray-300 rounded-full flex items-center justify-center group-data-[state=checked]:border-transparent">
                      <CheckIcon />
                    </div>
                  </Label>
                </div>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        )}
        <div className="flex items-center justify-center pt-16">
          <Button
            className="bg-[#FF4848] rounded-full w-[208px] h-[55px] cursor-pointer text-xl font-normal"
            asChild
            disabled={!selectedCategory}
          >
            <Link
              to={`/vehicle-model?selectedVehicleId=${selectedVehicleId}&selectedVehicleName=${selectedVehicleName}&selectedCategoryId=${selectedCategory}${
                returnTo ? `&returnTo=${returnTo}` : ""
              }`}
            >
              {t("vehicle_category.continue")}
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
