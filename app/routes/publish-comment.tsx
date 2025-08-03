import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import type { Route } from "./+types/publish-comment";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Ride Details" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();

  return (
    <div>
      <Header title={t("publish_comment.title")} />
      <div className="max-w-[894px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col gap-4 lg:gap-7">
        <p className="text-2xl lg:text-[2.188rem] text-center leading-tight max-w-[664px] mx-auto mb-6">
          {t("publish_comment.header_title")}
        </p>
        <div className="border border-[#EBEBEB] rounded-2xl p-6">
          <p className="text-base lg:text-xl text-center mb-6">
            {t("publish_comment.section_title")}
          </p>
          <Textarea
            className="text-sm font-light placeholder:text-[#999999] bg-[#F5F5F5] rounded-2xl !border-0 !ring-0 min-h-[228px] p-6"
            placeholder={t("publish_comment.placeholder")}
          />
        </div>
        <Button
          className="bg-[#FF4848] rounded-full w-[241px] h-[55px] cursor-pointer text-xl font-normal mx-auto mt-6"
          asChild
        >
          <Link to={`/publish-ride`}>{t("publish_comment.publish_ride")}</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}
