import { XIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import BankImage from "../../../public/assets/addbankModalIMg.png";

interface BankDetailsForm {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  branch: string;
}

export function AddBankAccountModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BankDetailsForm>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
    branch: "",
  });

  const handleSave = () => {
    console.log("🔥 [AddBankAccountModal] Saving bank details:", formData);
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof BankDetailsForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 !max-w-5xl w-full grid grid-cols-2 rounded-lg overflow-hidden min-h-[400px] sm:!max-w-5xl">
        {/* Left Section: Bank Image */}
        <div className="relative  flex items-end p-8 rounded-l-lg overflow-hidden">
          <img
            src={BankImage}
            alt="Bank"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
          />
        </div>

        {/* Right Section: Bank Details Form */}
        <div className="relative p-8 bg-white flex flex-col justify-between rounded-r-lg min-h-[500px]">
          <div className="flex flex-col items-center gap-6 mt-8 flex-grow justify-center">
            <h2 className="text-2xl font-semibold text-[#222222] mb-6">
              {t("bank_details.add_bank_account")}
            </h2>

            {/* Two-column form layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.account_holder_name")}
                </label>
                <Input
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    handleInputChange("accountHolderName", e.target.value)
                  }
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter account holder name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.bank_name")}
                </label>
                <Input
                  value={formData.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.account_number")}
                </label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.iban")}
                </label>
                <Input
                  value={formData.iban}
                  onChange={(e) => handleInputChange("iban", e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter IBAN"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.swift_code")}
                </label>
                <Input
                  value={formData.swiftCode}
                  onChange={(e) =>
                    handleInputChange("swiftCode", e.target.value)
                  }
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter SWIFT code"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.bank_address")}
                </label>
                <Input
                  value={formData.branch}
                  onChange={(e) => handleInputChange("branch", e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter branch address"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              onClick={handleSave}
              className="w-[170px] bg-red-500 hover:bg-red-600 text-white py-3 h-12 text-lg rounded-full"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
