import { XIcon } from "lucide-react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";

interface DocumentsAddedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onOk: () => void;
}

export function DocumentsAddedModal({
  isOpen,
  onClose,
  onEdit,
  onOk,
}: DocumentsAddedModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] h-[420px] p-8 rounded-2xl flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center space-y-8">
          <p className="text-[18px] leading-relaxed text-gray-700 font-medium px-4">
            {t("documents_added_modal.message")}
          </p>

          <div className="flex gap-6 w-full justify-center">
            <Button
              className="hover:bg-[#FF4848]/10 text-lg bg-white text-black font-semibold rounded-full px-8 py-4 cursor-pointer border border-[#EBEBEB] shadow-sm transition-all duration-300"
              onClick={onEdit}
            >
              {t("documents_added_modal.edit_button")}
            </Button>
            <Button
              className="text-lg text-white bg-[#FF4848] hover:bg-[#E04040] font-semibold rounded-full px-8 py-4 cursor-pointer shadow-md transition-all duration-300"
              onClick={onOk}
            >
              {t("documents_added_modal.ok_button")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
