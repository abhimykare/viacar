import PhoneInput from "~/components/inputs/phone-input";
import type { Route } from "./+types/login";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
// import { t } from "i18next";
import React, { useState } from "react";
import { api } from "~/lib/api";
import { useUserStore } from "~/lib/store/userStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Login" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function ProfileDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [branch, setBranch] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    console.log("registing ")
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.addBankDetails({
        account_holder_name: accountHolderName,
        bank_name: bankName,
        bank_branch: branch,
        account_number: accountNumber,
        iban: iban,
        swift_code: swiftCode,
      });

      if (
        (response.status === 200 && response.data?.message === "Success") ||
        (response.status === 201 && response.data?.message === "Success")
      ) {
        console.log("API Response Data:", response.data);

        console.log("Bank details added successfully!");
        navigate("/add-documents");
      } else {
        const errorMessage = response.data?.message || "Failed to add bank details.";
        setError(errorMessage);
        console.log("Error message set:", errorMessage);
      }
    } catch (err: any) {
      console.error("API Error:", err);
      if (err.response) {
        console.error("API Error Response Data:", err.response.data);
        console.error("API Error Response Status:", err.response.status);
        console.error("API Error Response Headers:", err.response.headers);
      }
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      console.log("Error message set from catch:", errorMessage);
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
            {t("add_bank_details.title")}
          </h1>

          <div className="mb-5">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("add_bank_details.table.account_holder_name")}
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="account-holder-name"
                id="account-holder-name"
                autoComplete="account-holder-name"
                placeholder="Enter account holder name"
                className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("add_bank_details.table.bank_name")}
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="bank-name"
                id="bank-name"
                autoComplete="bank-name"
                placeholder="Enter bank name"
                className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="account-number"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("add_bank_details.table.account_number")}
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="account-number"
                id="account-number"
                autoComplete="account-number"
                placeholder="Enter account number"
                className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* IBAN */}
          <div className="mb-5">
            <label
              htmlFor="iban"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("add_bank_details.table.iban")}
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="iban"
                id="iban"
                autoComplete="iban"
                placeholder="Enter IBAN"
                className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="swift-code"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("add_bank_details.table.swift_code")}
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="swift-code"
                id="swift-code"
                autoComplete="swift-code"
                placeholder="Enter SWIFT code"
                className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="branch"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("add_bank_details.table.branch")}
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="branch"
                id="branch"
                autoComplete="branch"
                placeholder="Enter branch"
                className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button
            className="text-white hover:bg-[#FF4848] text-xl bg-[#FF4848] font-normal rounded-full w-full h-[54px] lg:h-14 cursor-pointer mb-5"
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading
              ? "Registering..."
              : t("profile_details.form.button_text")}
          </Button>
        </div>
      </div>
    </div>
  );
}
