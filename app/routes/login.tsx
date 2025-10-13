import PhoneInput from "~/components/inputs/phone-input";
import type { Route } from "./+types/login";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import OtpAnimation from "~/components/animated/otp-animation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useUserStatus } from "~/hooks/use-user-status";
import { toast } from "sonner";
import React, { useState } from "react";
import { api } from "~/lib/api";
import { useUserStore } from "~/lib/store/userStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Login" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<any>("SA");
  const [otpId, setOtpId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const { setToken } = useUserStore();

  const searchParams = new URLSearchParams(window.location.search);
  const from = searchParams.get("from");
  const {
    userStatus,
    loading,
    error: userStatusError,
    refetch,
  } = useUserStatus();
  console.log(from, "from");

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove all non-numeric characters

      if (!cleanedPhoneNumber) {
        setError("Mobile number cannot be empty.");
        setIsLoading(false);
        return;
      }

      const response = await api.sendAuthOtp({
        country_code: countryCode,
        mobile_number: cleanedPhoneNumber,
      });
      if (response.data && response.data.otpId) {
        setOtpId(response.data.otpId);
        setIsOtpModalOpen(true);
      } else {
        setError(response.message || "Failed to send OTP.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.verifyAuthOtp({
        otp_id: otpId,
        otp: otp,
        device_type: "1",
        fcm_token: "some_fcm_token",
      });
      console.log(response?.data?.type, "response yoyouoy sdyfosdyfosy");

      if (response?.data?.token) {
        setToken(response.data.token);
      }
      console.log(response?.data?.type, "response type");
      if (response?.data?.type === "register") {
        navigate(`/profile-details?otpId=${otpId}&userFrom=publishRide`);
        setIsOtpModalOpen(false);
      }
      if (response?.data?.type === "login") {
        navigate("/");
      } else if (response?.data?.type === "register") {
        if (loading) {
          toast.info("Loading user status...");
          return;
        }

        if (userStatusError) {
          toast.error("Error fetching user status. Please try again.");
          return;
        }

        if (userStatus) {
          if (!userStatus.id_verification.completed) {
            toast.info("Please complete your ID verification.");
            navigate("/add-documents");
            return;
          }
          if (!userStatus.bank_details.has_bank_details) {
            toast.info("Please add your bank details.");
            navigate("/add-bank-details");
            return;
          }
          if (!userStatus.vehicles.has_vehicles) {
            toast.info("Please add your vehicle details.");
            navigate("/add-vehicles");
            return;
          }
          if (!userStatus.account.is_ride_publishable) {
            toast.error("You are not authorized to publish rides.");
            return;
          }
          navigate("/publish-ride");
        } else {
          toast.error("Unable to retrieve user status.");
        }
      }
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred during OTP verification."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <img
        className="object-cover h-screen w-full max-lg:h-[400px]"
        src="/assets/login.png"
        alt=""
      />
      <div className="flex flex-col items-center justify-start p-5 lg:h-screen w-full overflow-y-auto max-lg:rounded-t-2xl max-lg:-mt-[60px] bg-white">
        <div className="max-w-[420px] pt-4 lg:pt-20 pb-10">
          <img
            className="mb-8 lg:mb-12 h-20 lg:h-[7.5rem] mx-auto hidden lg:block"
            src="/assets/logo-red.png"
            alt="ViaCar"
          />
          <h1 className="text-2xl lg:text-4xl max-lg:font-medium text-start lg:text-center font-normal leading-tight tracking-tight mb-6 lg:mb-10">
            {t("login.title")}
          </h1>
          <PhoneInput
            label={t("login.phone_label")}
            defaultCountryCode="SA"
            className="mb-7"
            value={phoneNumber}
            onChange={(value, code) => {
              setPhoneNumber(value);
              setCountryCode(code);
            }}
          />
          <div className="flex space-x-2 mb-7">
            <Checkbox
              className="mt-0.5 size-[1.125rem] border-[#EBEBEB] rounded-xs cursor-pointer"
              id="terms"
            />
            <label
              htmlFor="terms"
              className="text-sm lg:text-base text-[#666666] font-light cursor-pointer leading-tight lg:leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("login.terms")}
            </label>
          </div>
          <p className="text-xs lg:text-sm text-[#666666] font-light mb-8 lg:mb-12">
            {t("login.promo")}
          </p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#FF4848] text-xl font-normal rounded-full w-full h-[54px] lg:h-14 cursor-pointer mb-5"
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                {isLoading ? "Sending OTP..." : t("login.btn_main")}
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-full lg:!max-w-[917px] w-full max-h-screen">
              <div className="flex flex-col items-center">
                <OtpAnimation />
                <h2 className="text-2xl lg:text-4xl mb-4 lg:mb-7">
                  {t("login.modal_title")}
                </h2>
                <p className="text-sm lg:text-base text-[#666666] font-light mb-7">
                  {t("login.modal_subtitle")}
                  <span className="text-[#FF4848]">
                    {phoneNumber.slice(-3) || "***"}
                  </span>
                </p>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPGroup key={index}>
                      <InputOTPSlot
                        className="size-10 lg:size-14 !rounded-xl !border-[#D9D8D8] text-xl font-normal"
                        index={index}
                      />
                    </InputOTPGroup>
                  ))}
                </InputOTP>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                <Button
                  onClick={handleVerify}
                  className="bg-[#FF4848] text-lg lg:text-xl font-normal rounded-full w-full max-w-[410px] h-12 lg:h-14 cursor-pointer mb-5 mt-10"
                >
                  {isLoading ? "Verifying OTP..." : t("login.btn_main")}
                </Button>
                <div className="text-sm lg:text-base text-[#666666] font-light mb-28">
                  {t("login.modal_footer")}
                  <button className="text-[#FF4848] font-normal ml-1">
                    {" "}
                    {t("login.modal_footer_action")}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            className="border-[#EBEBEB] text-xl max-lg:text-[#FF4848] font-normal rounded-full w-full h-[54px] lg:h-14 cursor-pointer mb-5"
            variant="outline"
            asChild
          >
            <Link to={`/`}>{t("login.skip_button")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
