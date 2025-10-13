import { XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import BankImage from "../../../public/assets/addbankModalIMg.png";

interface BankAccount {
  id?: string;
  user_id?: number;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  iban: string;
  swift_code: string;
  bank_branch: string;
  created_at?: string;
  updated_at?: string;
}

interface AddBankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    bankDetails: Omit<BankAccount, "user_id" | "created_at" | "updated_at">
  ) => Promise<void>;
  initialData?: BankAccount | null;
}

export const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData = null,
}) => {
  const { t } = useTranslation();
  const [accountHolderName, setAccountHolderName] = useState(
    initialData?.account_holder_name || ""
  );
  const [bankName, setBankName] = useState(initialData?.bank_name || "");
  const [branch, setBranch] = useState(initialData?.bank_branch || "");
  const [accountNumber, setAccountNumber] = useState(
    initialData?.account_number || ""
  );
  const [iban, setIban] = useState(initialData?.iban || "");
  const [swiftCode, setSwiftCode] = useState(initialData?.swift_code || "");

  useEffect(() => {
    if (initialData) {
      setAccountHolderName(initialData.account_holder_name);
      setBankName(initialData.bank_name);
      setBranch(initialData.bank_branch);
      setAccountNumber(initialData.account_number);
      setIban(initialData.iban);
      setSwiftCode(initialData.swift_code);
    } else {
      setAccountHolderName("");
      setBankName("");
      setBranch("");
      setAccountNumber("");
      setIban("");
      setSwiftCode("");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    const bankDetails: Omit<
      BankAccount,
      "user_id" | "created_at" | "updated_at"
    > = {
      account_holder_name: accountHolderName,
      bank_name: bankName,
      bank_branch: branch,
      account_number: accountNumber,
      iban: iban,
      swift_code: swiftCode,
    };
    if (initialData?.id) {
      bankDetails.id = initialData.id;
    }
    try {
      await onSave(bankDetails);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving bank details:", error);
    }
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
              {initialData
                ? t("bank_details.edit_bank_account")
                : t("bank_details.add_bank_account")}
            </h2>

            {/* Two-column form layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.account_holder_name")}
                </label>
                <Input
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter account holder name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.bank_name")}
                </label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.account_number")}
                </label>
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.iban")}
                </label>
                <Input
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter IBAN"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("bank_details.table.swift_code")}
                </label>
                <Input
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter SWIFT code"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#666666] mb-1 block">
                  {t("add_bank_details.table.bank_address")}
                </label>
                <Input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  placeholder="Enter branch address"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-[170px] bg-red-500 hover:bg-red-600 text-white py-3 h-12 text-lg rounded-full"
            >
              {initialData
                ? t("bank_details.table.button_text")
                : t("bank_details.table.buttonText")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
