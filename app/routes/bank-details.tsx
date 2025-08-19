import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import Header from "~/components/layouts/header";
import Footer from "~/components/layouts/footer";
import { AddBankAccountModal } from "~/components/modals/add-bank-details-modal";

interface BankAccount {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  branch: string;
}

const bankAccounts: BankAccount[] = [
  {
    id: "bank-1",
    accountHolderName: "Faisal A. Al Harbi",
    bankName: "Al Riyadh National Bank",
    accountNumber: "SA44200000001234567891234",
    iban: "SA44200000001234567891234",
    swiftCode: "ARNBSARIXXX",
    branch: "King Fahd Road Branch, Riyadh",
  },
  {
    id: "bank-2",
    accountHolderName: "Faisal A. Al Harbi",
    bankName: "Al Riyadh National Bank",
    accountNumber: "SA44200000001234567891234",
    iban: "SA44200000001234567891234",
    swiftCode: "ARNBSARIXXX",
    branch: "King Fahd Road Branch, Riyadh",
  },
];

const BankDetails: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBank, setSelectedBank] = useState<string>(
    bankAccounts[0]?.id || ""
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="bg-[#F8FAFB]">
      <Header title={t("bank_details.title")} />
      <div className="p-6 md:p-10 lg:p-12  rounded-lg  max-w-[1410px] mx-auto m-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl text-[#222222]">
            {t("bank_details.subtitle")}
          </h1>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-base text-[##FF4848] border-[#EBEBEB] shadow-none rounded-full h-10 px-4"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle className="size-4" />
            <span>{t("bank_details.add_bank_account")}</span>
          </Button>
        </div>

        <RadioGroup
          value={selectedBank}
          onValueChange={setSelectedBank}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {bankAccounts.map((bank, index) => (
            <div
              key={bank.id}
              className={`relative p-6 rounded-lg border-2 shadow-2xl transition-colors duration-200`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value={bank.id}
                    id={`bank-${index + 1}`}
                    className="size-5 border-2 border-[#EBEBEB] data-[state=checked]:border-[#00F076] data-[state=checked]:text-[#00F076]"
                  />
                  <label
                    htmlFor={`bank-${index + 1}`}
                    className="text-lg font-semibold text-[#222222] cursor-pointer"
                  >
                    {t("bank_details.bank_account", { number: index + 1 })}
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-sm text-[#FF4848] border-[#EBEBEB] shadow-none rounded-full px-3 py-1 h-auto"
                  >
                    <Pencil className="size-3" />
                    <span className="text-black">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-sm text-[#FF4848] border-[#EBEBEB] shadow-none rounded-full px-3 py-1 h-auto"
                  >
                    <Trash2 className="size-3" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <p className="text-[#666666]">
                  {t("bank_details.table.account_holder_name")}
                </p>
                <p className="font-medium text-[#222222]">
                  {bank.accountHolderName}
                </p>
                <p className="text-[#666666]">
                  {t("bank_details.table.bank_name")}
                </p>
                <p className="font-medium text-[#222222]">{bank.bankName}</p>
                <p className="text-[#666666]">
                  {t("bank_details.table.account_number")}
                </p>
                <p className="font-medium text-[#222222]">
                  {bank.accountNumber}
                </p>
                <p className="text-[#666666]">{t("bank_details.table.iban")}</p>
                <p className="font-medium text-[#222222]">{bank.iban}</p>
                <p className="text-[#666666]">
                  {t("bank_details.table.swift_code")}
                </p>
                <p className="font-medium text-[#222222]">{bank.swiftCode}</p>
                <p className="text-[#666666]">
                  {t("bank_details.table.bank_address")}
                </p>
                <p className="font-medium text-[#222222]">{bank.branch}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
      <AddBankAccountModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
      <Footer />
    </div>
  );
};

export default BankDetails;
