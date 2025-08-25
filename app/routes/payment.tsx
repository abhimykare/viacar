import Header from "~/components/layouts/header";
import type { Route } from "./+types/payment";
import Footer from "~/components/layouts/footer";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { HiOutlineUser } from "react-icons/hi2";
import { Separator } from "~/components/ui/separator";
import CardIcon from "~/components/icons/card-icon";
import { useState } from "react";
import { cn } from "~/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import PhoneInput from "~/components/inputs/phone-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Label } from "~/components/ui/label";
import { IoCard } from "react-icons/io5";
import { FaApplePay } from "react-icons/fa6";
import { SiSamsungpay } from "react-icons/si";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import ApprovedAnimation from "~/components/animated/approved-animation";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Payment" },
    { name: "description", content: "ViaCar" },
  ];
}

const tabs = [
  { name: "Credit/Debit Card  ", value: "card", icon: IoCard },
  { name: "Apple PAY", value: "applepay", icon: FaApplePay },
  { name: "Samsung Pay", value: "samsungpay", icon: SiSamsungpay },
];

type Step = "pre-login" | "login" | "otp" | "logged-in";
type Status = "idle" | "waiting" | "approved";

export default function Page() {
  const { t, i18n } = useTranslation("translation", { keyPrefix: "payment" });
  const isRTL = i18n.language === "ar";
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();
  const query = useLocation();
  const searchParams = new URLSearchParams(query.search);
  const registrationSuccess =
    searchParams.get("registrationSuccess") === "true";
  const [step, setStep] = useState<Step>(registrationSuccess ? "logged-in" : "pre-login");
  const [status, setStatus] = useState<Status>("idle");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  const handleChangeCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value);
  };

  const handleChangeExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(e.target.value);
  };

  const handleChangeCVC = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value);
  };
  return (
    <div className="bg-[#F5F5F5]">
      <Header title={t("title")} />
      <div className="max-w-[1370px] w-full mx-auto max-lg:pl-4 px-6 pt-[80px] pb-[100px] grid grid-cols-[25px_10px_1fr] lg:grid-cols-[30px_15px_1fr_502px] grid-rows-[30px_auto_30px_auto_auto] lg:grid-rows-[30px_auto_30px_auto]">
        <Button
          variant="default"
          size="icon"
          className="col-start-1 col-end-3 row-start-2 row-end-3 size-[35px] lg:size-[45px] bg-[#FF4848] drop-shadow-lg !fill-none"
        >
          <HiOutlineUser className="size-[18px] lg:size-[24px]" />
        </Button>
        <Separator
          orientation="vertical"
          className="col-start-1 col-end-3 row-start-2 row-end-4 mx-auto border-r !border-dashed !border-[#CDCDCD] bg-transparent !h- my-auto"
        />
        <Button
          variant="default"
          size="icon"
          className={cn(
            "col-start-1 col-end-3 row-start-4 row-end-5 size-[35px] lg:size-[45px] drop-shadow-lg !fill-none text-[#3C3F4E] bg-white hover:text-white",
            step === "logged-in" && "bg-[#FF4848] text-white"
          )}
        >
          <CardIcon className="size-[18px] lg:size-[24px]" />
        </Button>
        <Card className="col-start-2 col-end-4 row-start-1 row-end-3 shadow-none border-[#EBEBEB] rounded-2xl px-8 lg:px-10 py-6 lg:py-8 flex flex-col w-full mb-[40px] min-h-[140px]">
          {step !== "logged-in" && !registrationSuccess && (
            <>
              <div>
                <p className="text-xl lg:text-2xl text-[#3C3F4E] font-medium">
                  {t("account.title")}
                </p>
                <p className="text-base text-[#898989] font-light">
                  {t("account.description")}
                </p>
              </div>
              <Dialog
                open={step === "login"}
                onOpenChange={(open) => !open && setStep("pre-login")}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-col h-[50px] rounded-none border-[#3C3F4E] gap-0 w-[165px] mb-4"
                    onClick={() => setStep("login")}
                  >
                    <span className="text-[0.75rem] text-[#3C3F4E] font-light leading-tight">
                      {t("account.have_account")}
                    </span>
                    <span className="text-sm text-[#3C3F4E] leading-tight">
                      {t("account.login")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[516px] w-full">
                  <DialogHeader>
                    <DialogTitle className="text-2xl lg:text-4xl font-medium">
                      {t("login.title")}
                    </DialogTitle>
                  </DialogHeader>
                  <PhoneInput
                    label={t("login.phone_label")}
                    defaultCountryCode="SA"
                    className="mb-2"
                  />
                  <Button
                    className="bg-[#FF4848] text-xl font-normal rounded-full w-full h-14 cursor-pointer mb-5"
                    onClick={() => setStep("otp")}
                  >
                    {t("login.button")}
                  </Button>
                </DialogContent>
              </Dialog>
              <Dialog
                open={step === "otp"}
                onOpenChange={(open) => !open && setStep("login")}
              >
                <DialogContent className="max-w-[516px] w-full p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl lg:text-4xl font-medium mb-2">
                      {t("otp.title")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col">
                    <Label className="text-lg font-normal mb-2">
                      {t("otp.enter_label")}
                    </Label>
                    <InputOTP
                      containerClassName="justify-between"
                      maxLength={6}
                    >
                      {[...Array(6)].map((_, i) => (
                        <InputOTPGroup className="" key={i}>
                          <InputOTPSlot
                            className="size-10 lg:size-14 !rounded-xl !border-[#D9D8D8] text-xl font-normal"
                            index={i}
                          />
                        </InputOTPGroup>
                      ))}
                    </InputOTP>
                    <div className="text-sm lg:text-base text-[#666666] text-center font-light max-w-[350px] mx-auto mt-6">
                      {t("otp.no_code_received")}
                      <button className="text-[#FF4848] font-normal ml-1">
                        {t("otp.request_new_code")}
                      </button>
                    </div>
                    <Button
                      className="bg-[#FF4848] text-xl font-normal rounded-full w-full h-14 cursor-pointer mt-10"
                      onClick={() => setStep("logged-in")}
                    >
                      {t("otp.verify")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          {(step === "logged-in" || registrationSuccess) && (
            <div className="flex flex-col gap-1">
              <div className="text-xl lg:text-2xl text-[#3C3F4E] font-medium flex items-center gap-2">
                <span>{t("account.logged_in")}</span>
                <img src="/assets/check-squaricle.svg" alt="" />
              </div>
              <p className="text-base text-[#3C3F4E] font-light">
                {t("account.phone_number")}
              </p>
            </div>
          )}
        </Card>
        <Card className="col-start-2 col-end-4 row-start-3 row-end-6 shadow-none border-[#EBEBEB] rounded-2xl px-8 lg:px-10 py-8 flex flex-col w-full mb-[40px] min-h-[110px]">
          <p
            className={cn(
              "text-xl lg:text-2xl font-medium",
              step === "logged-in" ? "text-[#3C3F4E]" : "text-[#93959F]"
            )}
          >
            {t("payment.title")}
          </p>
          {(step === "logged-in" || registrationSuccess) && (
            <Tabs
              orientation="vertical"
              defaultValue={tabs[0].value}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] w-full gap-[40px]">
                <TabsList className="shrink-0 grid grid-cols-1 h-auto w-full bg-[#EDF2FF] p-[16px] lg:p-[20px] lg:pr-0 rounded-none">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="[data-state=active]:bg-white h-[40px] lg:h-[50px] w-full rounded-none !shadow-none justify-start px-5 text-sm text-[#3C3F4E] font-medium uppercase cursor-pointer"
                    >
                      <tab.icon className="size-[18px] lg:size-[22px] mr-2" />
                      {t(`payment.methods.${tab.value}`)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="">
                  {tabs.map((tab) => (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col gap-5"
                    >
                      <Input
                        {...getCardNumberProps({
                          onChange: handleChangeCardNumber,
                        })}
                        value={cardNumber}
                        className="h-[48px] border-[#DFDCDC] rounded-none text-sm font-light placeholder:text-[#898989] shadow-none"
                        placeholder={t("payment.card_number")}
                      />
                      <Input
                        placeholder={t("payment.name_on_card")}
                        className="h-[48px] border-[#DFDCDC] rounded-none text-sm font-light placeholder:text-[#898989] shadow-none"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-5">
                        <Input
                          {...getExpiryDateProps({
                            onChange: handleChangeExpiryDate,
                          })}
                          value={expiryDate}
                          placeholder={t("payment.valid_thru")}
                          className="h-[48px] border-[#DFDCDC] rounded-none text-sm font-light placeholder:text-[#898989] shadow-none"
                        />
                        <Input
                          {...getCVCProps({ onChange: handleChangeCVC })}
                          value={cvc}
                          placeholder={t("payment.cvv")}
                          className="h-[48px] border-[#DFDCDC] rounded-none text-sm font-light placeholder:text-[#898989] shadow-none"
                        />
                      </div>
                      {meta.isTouched && meta.error && (
                        <span className="text-sm text-red-400">
                          {t("payment.error")}: {meta.error}
                        </span>
                      )}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          defaultChecked
                          className="rounded-none shadow-none data-[state=checked]:bg-[#06E775] data-[state=checked]:border-[#06E775]"
                          id="terms"
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("payment.save_card")}
                        </label>
                      </div>
                      <Button
                        className="bg-[#FF4848] text-lg lg:text-xl font-normal rounded-none w-full h-[48px] cursor-pointer"
                        onClick={() => setStatus("waiting")}
                      >
                        {t("payment.pay_now")}
                      </Button>
                      <Dialog
                        open={status === "waiting"}
                        onOpenChange={() => setStatus("idle")}
                      >
                        <DialogContent className="!max-w-[724px] w-full px-12 lg:px-24 pt-12 lg:pt-24">
                          <DialogHeader>
                            <img
                              className="size-[60px] lg:size-[231px] mx-auto object-contain"
                              src="/assets/hour-glass.gif"
                              alt=""
                            />
                            <DialogTitle className="text-2xl lg:text-3xl font-normal text-center">
                              {t("payment.waiting.title")}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center justify-center">
                            <Button
                              className="bg-[#FF4848] text-xl font-normal rounded-full w-[141px] h-[45px] lg:h-[55px] cursor-pointer my-6"
                              onClick={() => setStatus("approved")}
                            >
                              {t("payment.waiting.ok")}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog
                        open={status === "approved"}
                        onOpenChange={() => setStatus("idle")}
                      >
                        <DialogContent className="!max-w-[724px] w-full px-12 lg:px-24 pt-12 lg:pt-24">
                          <DialogHeader>
                            <ApprovedAnimation />
                            <DialogTitle className="text-2xl lg:text-3xl font-normal text-center lg:mt-6">
                              {t("payment.approved.title")}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center justify-center">
                            <Button
                              className="bg-[#FF4848] text-xl font-normal rounded-full w-[141px] h-[45px] lg:h-[55px] cursor-pointer mt-6 mb-12"
                              asChild
                            >
                              <Link to={`/book`}>
                                {t("payment.approved.ok")}
                              </Link>
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>
          )}
        </Card>
        <div
          className={cn(
            "lg:col-start-4 lg:col-end-5 col-span-4 lg:row-span-6 w-full",
            isRTL ? "pr-[30px]" : "pl-[30px]"
          )}
        >
          <Card className="shadow-none border-[#EBEBEB] rounded-2xl px-8 py-10 flex flex-col w-full h-max">
            <p className="text-xl lg:text-[1.563rem] font-medium">
              {t("summary.title")}
            </p>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-0 lg:gap-4">
              <p className="text-lg lg:text-[1.563rem] font-light">
                {t("summary.passenger_count")}
              </p>
              <p className="text-lg lg:text-[1.563rem]">
                {t("summary.passenger_price")}
              </p>
            </div>
            <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
            <div className="grid grid-cols-[1fr_10px] lg:grid-cols-[1fr_10px_auto] gap-2 lg:gap-4 items-center">
              <p className="text-lg lg:text-xl text-[#666666] font-light">
                {t("summary.driver_amount")}
              </p>
              <p className="text-lg lg:text-[1.563rem]">:</p>
              <p className="text-lg lg:text-xl lg:text-end max-lg:col-span-2">
                {t("summary.driver_amount_value")}
              </p>
              <p className="text-lg lg:text-xl text-[#666666] font-light">
                {t("summary.service_fee")}
              </p>
              <p className="text-lg lg:text-[1.563rem]">:</p>
              <p className="text-lg lg:text-xl lg:text-end max-lg:col-span-2">
                {t("summary.service_fee_value")}
              </p>
              <p className="text-[1.375rem] text-[#666666] font-light">
                {t("summary.total")}
              </p>
              <p className="text-lg lg:text-[1.563rem] mt-2">:</p>
              <p className="text-[1.75rem] text-[#00665A] font-medium lg:text-end mt-2 max-lg:col-span-2">
                {t("summary.total_value")}
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
