import type { Route } from "./+types/login";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { CameraIcon } from "lucide-react";
import { cn } from "~/lib/utils";

import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { api } from "~/lib/api";
import { DocumentsAddedModal } from "~/components/modals/documents-added-modal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Login" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function AddDocuments() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState("");
  const [carPlateNum, setCarPlateNum] = useState("");
  const [sequenceNumber, setSequenceNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [vehicleRegFile, setVehicleRegFile] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.verifyId({
        national_id_number: nationalId,
        sequence_number: sequenceNumber,
        car_plate_number: carPlateNum,
        national_id: nationalIdFile || undefined,
        vehicle_registration: vehicleRegFile || undefined,
        driving_license: driverLicenseFile || undefined,
      });
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilePreview = (file: File | null) => {
    if (!file) return null;
    return URL.createObjectURL(file);
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
            {t("add_documents.title")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-5">
              <label
                htmlFor="national-id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t("add_documents.table.national_id")}
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="national-id"
                  id="national-id"
                  autoComplete="national-id"
                  placeholder="Enter national ID"
                  className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Upload national ID */}
            <div className="mb-5">
              <label
                htmlFor="upload-national-id"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                {t("add_documents.table.upload_national_id")}
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="upload-national-id"
                  id="upload-national-id"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setNationalIdFile)}
                  required
                />
                <label
                  htmlFor="upload-national-id"
                  className={cn(
                    "flex items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-colors",
                    nationalIdFile
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  )}
                >
                  {nationalIdFile ? (
                    <img
                      src={getFilePreview(nationalIdFile)!}
                      alt="National ID preview"
                      className="w-full h-full object-contain rounded-2xl p-2"
                    />
                  ) : (
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  )}
                </label>
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="car-plate-num"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t("add_documents.table.car_plate_num")}
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="car-plate-num"
                  id="car-plate-num"
                  autoComplete="car-plate-num"
                  placeholder="Enter car plate number"
                  className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={carPlateNum}
                  onChange={(e) => setCarPlateNum(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="sequence-number"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t("add_documents.table.sequence_number")}
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="sequence-number"
                  id="sequence-number"
                  autoComplete="sequence-number"
                  placeholder="Enter sequence number"
                  className="block w-full rounded-full border-0 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={sequenceNumber}
                  onChange={(e) => setSequenceNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Upload driver license */}
            <div className="mb-5">
              <label
                htmlFor="upload-driver-license"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                {t("add_documents.table.upload_driver_license")}
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="upload-driver-license"
                  id="upload-driver-license"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setDriverLicenseFile)}
                  required
                />
                <label
                  htmlFor="upload-driver-license"
                  className={cn(
                    "flex items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-colors",
                    driverLicenseFile
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  )}
                >
                  {driverLicenseFile ? (
                    <img
                      src={getFilePreview(driverLicenseFile)!}
                      alt="Driver license preview"
                      className="w-full h-full object-contain rounded-2xl p-2"
                    />
                  ) : (
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  )}
                </label>
              </div>
            </div>

            {/* Upload vehicle registration */}
            <div className="mb-5">
              <label
                htmlFor="upload-vehicle-registration"
                className="block text-sm font-medium leading-6 text-gray-900 mb-2"
              >
                {t("add_documents.table.upload_vehicle_registration")}
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="upload-vehicle-registration"
                  id="upload-vehicle-registration"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setVehicleRegFile)}
                  required
                />
                <label
                  htmlFor="upload-vehicle-registration"
                  className={cn(
                    "flex items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-colors",
                    vehicleRegFile
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  )}
                >
                  {vehicleRegFile ? (
                    <img
                      src={getFilePreview(vehicleRegFile)!}
                      alt="Vehicle registration preview"
                      className="w-full h-full object-contain rounded-2xl p-2"
                    />
                  ) : (
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  )}
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button
              className="text-white hover:bg-[#FF4848] text-xl bg-[#FF4848] font-normal rounded-full w-full h-[54px] lg:h-14 cursor-pointer mb-5"
              // onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading
                ? "Verifying..."
                : t("profile_details.form.button_text")}
            </Button>
          </form>

          <DocumentsAddedModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onEdit={() => setIsModalOpen(false)}
            onOk={() => {
              setIsModalOpen(false);
              navigate("/add-vehicles");
            }}
          />
        </div>
      </div>
    </div>
  );
}
