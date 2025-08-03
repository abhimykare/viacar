import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/your-rides";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import RideStatusItem from "~/components/common/ride-status-item";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Your Rides" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#F8FAFB]">
      <Header title={t("your_rides.title")} />
      <div className="max-w-[1382px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-4 lg:gap-7">
        <Tabs className="max-lg:flex-col" defaultValue="completed">
          <TabsList className="max-w-[543px] w-full h-[40px] lg:h-[50px] rounded-full mx-auto mb-10 p-0 bg-white">
            <TabsTrigger
              className="rounded-full h-[40px] lg:h-[50px] !min-w-[145px] lg:!min-w-[216px] shadow-none bg-white border-[#EBEBEB] data-[state=active]:bg-[#FF4848] data-[state=active]:text-white text-[#666666] data-[state=active]:z-[2] text-xs lg:text-xl font-normal !ring-0 cursor-pointer"
              value="pending"
            >
              {t("your_rides.tabs.pending")}
            </TabsTrigger>
            <TabsTrigger
              className="rounded-full h-[40px] lg:h-[50px] !min-w-[145px] lg:!min-w-[216px] shadow-none bg-white border-[#EBEBEB] data-[state=active]:bg-[#FF4848] data-[state=active]:text-white text-[#666666] data-[state=active]:z-[2] text-xs lg:text-xl font-normal !ring-0 cursor-pointer -ml-10 lg:-ml-10 z-1"
              value="cancelled"
            >
              {t("your_rides.tabs.cancelled")}
            </TabsTrigger>
            <TabsTrigger
              className="rounded-full h-[40px] lg:h-[50px] !min-w-[145px] lg:!min-w-[216px] shadow-none bg-white border-[#EBEBEB] data-[state=active]:bg-[#FF4848] data-[state=active]:text-white text-[#666666] data-[state=active]:z-[2] text-xs lg:text-xl font-normal !ring-0 cursor-pointer -ml-10 lg:-ml-10"
              value="completed"
            >
              {t("your_rides.tabs.completed")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 justify-between">
              {Array.from({ length: 3 }).map((_, index) => (
                <RideStatusItem />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="cancelled">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 justify-between">
              {Array.from({ length: 3 }).map((_, index) => (
                <RideStatusItem />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 justify-between">
              {Array.from({ length: 3 }).map((_, index) => (
                <RideStatusItem />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
