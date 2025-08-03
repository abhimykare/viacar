import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/user-profile";
import { FaStar } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { HiPencil } from "react-icons/hi2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Link } from "react-router";
import { ChevronRight, CirclePlus, Trash2 } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { EditProfileModal } from "~/components/modals/edit-profile-modal";
import { BiSolidPencil } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Profile" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div>
      <Header title={t("user_profile.title")} />
      <div className="bg-[#F5F5F5]">
        <div className="max-w-[1384px] w-full mx-auto px-6 pt-10 lg:pt-[80px] pb-12 lg:pb-[100px] flex flex-col lg:flex-row gap-12 lg:gap-[100px]">
          <img
            className="w-[265px] h-[230px] rounded-2xl object-cover max-lg:mx-auto"
            src="/assets/profile-img2.png"
            alt=""
          />
          <div className="flex flex-col w-full gap-12">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <p className="text-3xl lg:text-[3.438rem]">
                  {t("user_profile.name")}
                </p>
                <div className="flex items-center gap-2">
                  <FaStar className="fill-[#FF9C00]" />
                  <p className="text-2xl text-[#666666]">
                    {t("user_profile.rating")}
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="text-base font-light border-[#EBEBEB] bg-transparent rounded-full w-[102px] h-[42px]"
                    variant="outline"
                  >
                    <HiPencil color="#FF4848" />
                    <span>{t("user_profile.edit")}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <EditProfileModal />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col lg:flex-row items-center max-lg:justify-center gap-4 lg:gap-0">
              <div className="flex flex-col items-center justify-center px-8 py-4">
                <p className="text-lg text-[#666666] font-light">
                  {t("user_profile.personal_info.mail")}
                </p>
                <p className="text-lg">
                  {t("user_profile.personal_info.mail_value")}
                </p>
              </div>
              <div
                className={cn(
                  "flex flex-col items-center justify-center px-8 py-4",
                  "lg:border-l border-[#DCDCDC]",
                  isRTL && "lg:border-l-0 lg:border-r"
                )}
              >
                <p className="text-lg text-[#666666] font-light">
                  {t("user_profile.personal_info.number")}
                </p>
                <p className="text-lg">
                  {t("user_profile.personal_info.number_value")}
                </p>
              </div>
              <div
                className={cn(
                  "flex flex-col items-center justify-center px-8 py-4",
                  "lg:border-l border-[#DCDCDC]",
                  isRTL && "lg:border-l-0 lg:border-r"
                )}
              >
                <p className="text-lg text-[#666666] font-light">
                  {t("user_profile.personal_info.age")}
                </p>
                <p className="text-lg">
                  {t("user_profile.personal_info.age_value")}
                </p>
              </div>
              <div
                className={cn(
                  "flex flex-col items-center justify-center px-8 py-4",
                  "lg:border-l border-[#DCDCDC]",
                  isRTL && "lg:border-l-0 lg:border-r"
                )}
              >
                <p className="text-lg text-[#666666] font-light">
                  {t("user_profile.personal_info.gender")}
                </p>
                <p className="text-lg">
                  {t("user_profile.personal_info.gender_value")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1384px] w-full mx-auto px-6 pt-[80px] pb-[80px]">
        <Tabs defaultValue="about">
          <TabsList className="max-w-[329px] w-full h-[50px] rounded-full mx-auto mb-10 p-0 bg-white">
            <TabsTrigger
              className="rounded-full h-[50px] w-[175px] shadow-none bg-white border-[#EBEBEB] data-[state=active]:bg-[#FF4848] data-[state=active]:text-white text-[#666666] data-[state=active]:z-[2] text-xl font-normal !ring-0 cursor-pointer"
              value="about"
            >
              {t("user_profile.tabs.about")}
            </TabsTrigger>
            <TabsTrigger
              className="rounded-full h-[50px] w-[175px] shadow-none bg-white border-[#EBEBEB] data-[state=active]:bg-[#FF4848] data-[state=active]:text-white text-[#666666] data-[state=active]:z-[2] text-xl font-normal !ring-0 cursor-pointer -ml-10 z-1"
              value="account"
            >
              {t("user_profile.tabs.account")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] lg:grid-rows-2 gap-12">
              <div className="border border-[#EBEBEB] rounded-2xl px-6 py-8">
                <p className="text-2xl">
                  {t("user_profile.verify_profile.title")}
                </p>
                <div className="flex flex-col max-w-[716px] w-full mx-auto divide-y divide-[#EBEBEB] divide-dashed">
                  <Link
                    to={`/publish-comment`}
                    className="group py-5 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="size-[26px]"
                        src="/assets/check-green.svg"
                        alt=""
                      />
                      <span className="text-base font-normal">
                        {t("user_profile.verify_profile.id_verified")}
                      </span>
                    </div>
                  </Link>
                  <Link
                    to={`/publish-comment`}
                    className="group py-5 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="size-[26px]"
                        src="/assets/verify.svg"
                        alt=""
                      />
                      <span className="text-base font-normal">
                        {t("user_profile.verify_profile.confirm_email")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight className="size-[30px]" strokeWidth={1} />
                    </div>
                  </Link>
                  <Link
                    to={`/publish-comment`}
                    className="group py-5 flex items-center gap-4 cursor-pointer border-b border-[#EBEBEB] border-dashed"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="size-[26px]"
                        src="/assets/check-green.svg"
                        alt=""
                      />
                      <span className="text-base font-normal">
                        {t("user_profile.verify_profile.phone")}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="lg:row-span-2 border border-[#EBEBEB] rounded-2xl flex flex-col px-6 py-8">
                <div className="flex items-center justify-between gap-10 mb-6">
                  <p className="text-2xl">
                    {t("user_profile.about_you.title")}
                  </p>
                  <Button
                    className="text-base font-light border-[#EBEBEB] bg-transparent rounded-full w-[102px] h-[42px]"
                    variant="outline"
                  >
                    <HiPencil color="#FF4848" />
                    <span>{t("user_profile.edit")}</span>
                  </Button>
                </div>
                <div className="bg-[#F5F5F5] rounded-2xl px-8 py-8 text-base font-light">
                  {t("user_profile.about_you.description")}
                </div>
                <Separator className="my-6 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
                <div className="flex flex-wrap items-center gap-4">
                  <div className="border border-[#EBEBEB] min-h-[50px] py-2 rounded-full px-4 flex items-center justify-center gap-4">
                    <img
                      className="size-[28px] object-contain"
                      src="/assets/chat.svg"
                      alt=""
                    />
                    <p className="text-lg">
                      {t("user_profile.about_you.preferences.chatty")}
                    </p>
                  </div>
                  <div className="border border-[#EBEBEB] min-h-[50px] py-2 rounded-full px-4 flex items-center justify-center gap-4">
                    <img
                      className="size-[28px] object-contain"
                      src="/assets/cigarette-light.svg"
                      alt=""
                    />
                    <p className="text-lg">
                      {t("user_profile.about_you.preferences.smoking")}
                    </p>
                  </div>
                  <div className="border border-[#EBEBEB] min-h-[50px] py-2 rounded-full px-4 flex items-center justify-center gap-4">
                    <img
                      className="size-[28px] object-contain"
                      src="/assets/music.svg"
                      alt=""
                    />
                    <p className="text-lg">
                      {t("user_profile.about_you.preferences.music")}
                    </p>
                  </div>
                  <div className="border border-[#EBEBEB] min-h-[50px] py-2 rounded-full px-4 flex items-center justify-center gap-4">
                    <img
                      className="size-[28px] object-contain"
                      src="/assets/paw.svg"
                      alt=""
                    />
                    <p className="text-lg">
                      {t("user_profile.about_you.preferences.pets")}
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-[#FF4848] shadow-none rounded-full w-[315px] h-[55px] cursor-pointer text-xl font-normal mx-auto mt-12"
                  asChild
                >
                  <Link to={`/your-ride`}>
                    <BiSolidPencil />
                    {t("user_profile.about_you.edit_preferences")}
                  </Link>
                </Button>
              </div>
              <div className="border border-[#EBEBEB] rounded-2xl px-6 py-8 flex flex-col">
                <p className="text-2xl mb-4">
                  {t("user_profile.vehicles.title")}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg">
                      {t("user_profile.vehicles.details.model")}
                    </p>
                    <p className="text-base text-[#666666] font-light">
                      {t("user_profile.vehicles.details.type")}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="size-[22px]" color="#666666" />
                  </Button>
                </div>
                <Separator className="my-6 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
                <Button
                  className="bg-[#FF4848] shadow-none rounded-full w-[220px] h-[55px] cursor-pointer text-xl font-normal mx-auto mt-4"
                  asChild
                >
                  <Link to={`/your-ride`}>
                    <CirclePlus />
                    {t("user_profile.vehicles.add_vehicle")}
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="account">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="border border-[#EBEBEB] rounded-2xl px-6 py-8 flex flex-col">
                <div className="flex flex-col w-full divide-y divide-[#EBEBEB] divide-dashed">
                  <Link
                    to={`/change-password`}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-normal">
                        {t("user_profile.account.password")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight
                        className="size-[25px]"
                        strokeWidth={1}
                        color="#666666"
                      />
                    </div>
                  </Link>
                  <Link
                    to={``}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-normal">
                        {t("user_profile.account.privacy_policy")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight
                        className="size-[25px]"
                        strokeWidth={1}
                        color="#666666"
                      />
                    </div>
                  </Link>
                  <Link
                    to={``}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-normal">
                        {t("user_profile.account.communication_preferences")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight
                        className="size-[25px]"
                        strokeWidth={1}
                        color="#666666"
                      />
                    </div>
                  </Link>
                  <Link
                    to={``}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-normal">
                        {t("user_profile.account.about_us")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight
                        className="size-[25px]"
                        strokeWidth={1}
                        color="#666666"
                      />
                    </div>
                  </Link>
                  <Link
                    to={``}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base text-[#FF0000] font-normal">
                        {t("user_profile.account.close_account")}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="border border-[#EBEBEB] rounded-2xl px-6 py-8 flex flex-col">
                <div className="flex flex-col w-full divide-y divide-[#EBEBEB] divide-dashed">
                  <Link
                    to={`/payment`}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-normal">
                        {t("user_profile.account.payout_methods")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight
                        className="size-[25px]"
                        strokeWidth={1}
                        color="#666666"
                      />
                    </div>
                  </Link>
                  <Link
                    to={``}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-normal">
                        {t("user_profile.account.transfers")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight
                        className="size-[25px]"
                        strokeWidth={1}
                        color="#666666"
                      />
                    </div>
                  </Link>
                  <Link
                    to={`/payment`}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-normal">
                        {t("user_profile.account.payment_methods")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight
                        className="size-[25px]"
                        strokeWidth={1}
                        color="#666666"
                      />
                    </div>
                  </Link>
                  <Link
                    to={`/publish-comment`}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-normal">
                        {t("user_profile.account.payments_refunds")}
                      </span>
                    </div>
                    <div className="size-[30px] flex items-center justify-center ml-auto">
                      <ChevronRight
                        className="size-[25px]"
                        strokeWidth={1}
                        color="#666666"
                      />
                    </div>
                  </Link>
                  <Link
                    to={`/publish-comment`}
                    className="group py-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base text-[#FF0000] font-normal">
                        {t("user_profile.account.logout")}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
