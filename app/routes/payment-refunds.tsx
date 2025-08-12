import React from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Header from "~/components/layouts/header";
import ImageSampleMan from "../../public/assets/imagesampleman.png";
import Footer from "~/components/layouts/footer";
import type { PaymentRefund } from "~/lib/types";

const paymentRefunds: PaymentRefund[] = [
  {
    id: "1",
    user: { id: "u1", name: "Novák Balázs", avatar: "/avatars/avatar-1.png" },
    date: "13 / 05 / 2025",
    from: "Riyadh",
    to: "Jeddah",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "2",
    user: { id: "u2", name: "Serenity", avatar: "/avatars/avatar-2.png" },
    date: "13 / 05 / 2025",
    from: "Dammam",
    to: "Riyadh",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "3",
    user: { id: "u3", name: "Balogh Imre", avatar: "/avatars/avatar-3.png" },
    date: "13 / 05 / 2025",
    from: "Jeddah",
    to: "Makkah",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "4",
    user: { id: "u4", name: "Fekete Csanád", avatar: "/avatars/avatar-4.png" },
    date: "13 / 05 / 2025",
    from: "Abha",
    to: "Jazan",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "5",
    user: { id: "u5", name: "Irma", avatar: "/avatars/avatar-5.png" },
    date: "13 / 05 / 2025",
    from: "AlUla",
    to: "Tabuk",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "6",
    user: { id: "u6", name: "Somogyi Adrián", avatar: "/avatars/avatar-6.png" },
    date: "13 / 05 / 2025",
    from: "Riyadh",
    to: "Al Qassim",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "7",
    user: {
      id: "u7",
      name: "Orosz Boldizsár",
      avatar: "/avatars/avatar-7.png",
    },
    date: "13 / 05 / 2025",
    from: "Khobar",
    to: "Hofuf",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "8",
    user: { id: "u8", name: "Hegedüs Donát", avatar: "/avatars/avatar-8.png" },
    date: "13 / 05 / 2025",
    from: "Al Qassim",
    to: "Tabuk",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
  {
    id: "9",
    user: { id: "u9", name: "Kovács Lajos", avatar: "/avatars/avatar-9.png" },
    date: "13 / 05 / 2025",
    from: "Abha",
    to: "Makkah",
    status: "Completed",
    amount: "SAR 1200",
    image: ImageSampleMan,
  },
];
export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#F8FAFB]">
      <Header title={t("payment_refunds.title")} />
      <div className="p-6 md:p-10 lg:p-12 bg-white rounded-lg shadow-sm max-w-[1410px] mx-auto mb-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl text-[#222222]">
            {t("payment_refunds.title")}
          </h1>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-base text-[#666666] border-[#EBEBEB] shadow-none rounded-full h-10 px-4"
          >
            <span>{t("transactions.filterText")}</span>
            <Filter className="size-4" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFB] text-left text-sm font-medium text-[#666666] border-b border-[#EBEBEB]">
                <th className="py-4 px-4 rounded-tl-lg">
                  {t("transactions.table.user")}
                </th>
                <th className="py-4 px-4">{t("transactions.table.date")}</th>
                <th className="py-4 px-4">{t("transactions.table.from")}</th>
                <th className="py-4 px-4">{t("transactions.table.to")}</th>
                <th className="py-4 px-4">{t("transactions.table.status")}</th>
                <th className="py-4 px-4 rounded-tr-lg">
                  {t("transactions.table.amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentRefunds.map((paymentRefund, index) => (
                <tr
                  key={paymentRefund.id}
                  className={`border-b border-[#EBEBEB] ${
                    index % 2 === 0 ? "bg-white" : "bg-white"
                  } hover:bg-[#F8FAFB] min-h-[60px]`} // Added min-h-[60px] for row height
                >
                  <td className="py-4 px-4 sm:py-5 sm:px-6">
                    {" "}
                    {/* Increased padding */}
                    <div className="flex items-center gap-3">
                      <img
                        src={paymentRefund.image}
                        alt={paymentRefund.user.name}
                        className="size-8 rounded-[10px]"
                      />
                      <span className="text-sm font-medium text-[#222222]">
                        {paymentRefund.user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm text-[#666666]">
                    {paymentRefund.date}
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm text-[#666666]">
                    {paymentRefund.from}
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm text-[#666666]">
                    {paymentRefund.to}
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm">
                    <span
                      className={
                        paymentRefund.status === "Completed"
                          ? "text-[#00F076]"
                          : "text-[#666666]"
                      }
                    >
                      {t(
                        `payment_refunds.status_${paymentRefund.status.toLowerCase()}`
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:py-5 sm:px-6 text-sm font-medium text-[#222222]">
                    {paymentRefund.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
