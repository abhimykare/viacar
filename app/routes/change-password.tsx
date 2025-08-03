import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/change-password";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Change Password" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError(t("change_password.errors.fill_all_fields"));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError(t("change_password.errors.passwords_dont_match"));
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(t("change_password.errors.password_requirements"));
      return;
    }

    console.log("Updating password...", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    setSuccess(t("change_password.success"));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div>
      <Header
        title={t("change_password.title")}
        breadcrumb={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.profile"), href: "/user-profile" },
          { label: t("change_password.title"), href: "/change-password" },
        ]}
      />
      <div className="max-w-[716px] w-full mx-auto px-6 pt-8 lg:pt-[80px] pb-10 lg:pb-[100px] flex flex-col gap-6">
        <p className="text-[1.938rem] text-center leading-tight">
          {t("change_password.title")}
        </p>
        <p className="text-lg text-[#939393] font-light text-center">
          {t("change_password.requirements")}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-6 max-w-[500px] w-full mx-auto"
        >
          <div className="relative flex items-center rounded-full border border-[#EBEBEB] px-5 w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("change_password.current_password")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none h-[50px] text-base font-light placeholder:text-[#666666] w-full"
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 opacity-40" color="#666666" />
              ) : (
                <EyeIcon className="h-5 w-5 opacity-40" color="#666666" />
              )}
            </button>
          </div>
          <div className="relative flex items-center rounded-full border border-[#EBEBEB] px-5 w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("change_password.new_password")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none h-[50px] text-base font-light placeholder:text-[#666666] w-full"
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 opacity-40" color="#666666" />
              ) : (
                <EyeIcon className="h-5 w-5 opacity-40" color="#666666" />
              )}
            </button>
          </div>
          <div className="relative flex items-center rounded-full border border-[#EBEBEB] px-5 w-full">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("change_password.confirm_password")}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none h-[50px] text-base font-light placeholder:text-[#666666] w-full"
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 opacity-40" color="#666666" />
              ) : (
                <EyeIcon className="h-5 w-5 opacity-40" color="#666666" />
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <Button
            type="submit"
            className="bg-[#FF4848] shadow-none rounded-full w-[241px] h-[55px] cursor-pointer text-xl font-normal mx-auto mt-6"
          >
            {t("change_password.save_button")}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
