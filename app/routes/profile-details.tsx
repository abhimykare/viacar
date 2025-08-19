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

import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
// import { t } from "i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Login" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function ProfileDetails() {
  const { t } = useTranslation();

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
            {t("profile_details.title")}
          </h1>

          <div className="mb-5">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("profile_details.form.fname")}
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                placeholder="Enter first name"
                className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("profile_details.form.lname")}
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                placeholder="Enter last name"
                className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="date-of-birth"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("profile_details.form.date_of_birth")}
            </label>
            <div className="mt-2">
              <Input
                type="date"
                name="date-of-birth"
                id="date-of-birth"
                placeholder="Select date of birth"
                className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="gender"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("profile_details.form.gender")}
            </label>
            <div className="mt-2">
              <Select>
                <SelectTrigger className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <SelectValue
                    placeholder={t(
                      "profile_details.form.select_gender_placeholder"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    {t("profile_details.form.gender_male")}
                  </SelectItem>
                  <SelectItem value="female">
                    {t("profile_details.form.gender_female")}
                  </SelectItem>
                  <SelectItem value="other">
                    {t("profile_details.form.gender_other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="text-white hover:bg-[#FF4848] text-xl bg-[#FF4848] font-normal rounded-full w-full h-[54px] lg:h-14 cursor-pointer mb-5"
            variant="outline"
            asChild
          >
            <Link to={`/payment`}>{t("profile_details.form.button_text")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
