import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { colors } from "~/constants/colors";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";
import { api } from "~/lib/api";
import { Skeleton } from "../ui/skeleton";
import { BiSearch } from "react-icons/bi";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ChevronRight, MapPin } from "lucide-react";
import CloseIcon from "../icons/close-icon";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface Props {
  label?: string;
  name: string;
  path: string;
  sectionName: string;
  sectionTitle: string;
}

function ColorSearch({ label, name, path, sectionName, sectionTitle }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(name) || "";

  // If a URL param exists, initialize the input with the matching label.
  const initialLabel =
    colors.find((loc) => loc.value === initialValue)?.label || "";

  const [searchValue, setSearchValue] = useState<string>(initialLabel);
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const [selectedColorObject, setSelectedColorObject] = useState<{ value: string; label: string; code: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Create a map for quick lookup of labels.
  const labels = useMemo(() => {
    return colors.reduce((acc, item) => {
      acc[item.value] = t(`vehicle_color.colors.${item.value.toLowerCase()}`);
      return acc;
    }, {} as Record<string, string>);
  }, [t]);

  // Update URL search param.
  const updateSearchParam = (value: string) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev as any);
        newParams.set(name, value);
        return newParams;
      },
      { replace: true }
    );
  };

  // When the user types, update the input and clear any previous selection.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (selectedValue) {
      setSelectedValue("");
      updateSearchParam("");
    }
  };

  // Filter colors based on the search value.
  const filteredLocations = colors.filter(
    (option) =>
      t(`vehicle_color.colors.${option.value.toLowerCase()}`)
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      option.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  // When an item is selected, update the selected state and URL.
  const onSelectItem = (value: string) => {
    const selected = colors.find((color) => color.value === value);
    if (selected) {
      setSelectedColorObject(selected);
      setSelectedValue(value);
      const labelText = labels[value] || value;
      setSearchValue(labelText);
      updateSearchParam(value);
      setOpen(false);
      setShowDialog(true);
    }
  };

  const handleDialogOk = async () => {
    const modelId = searchParams.get("selectedModelId");
    if (!modelId || !selectedColorObject?.code) {
      console.error("Missing modelId or selectedColorCode");
      return;
    }

    try {
      setIsLoading(true);
      await api.addVehicle({
        model_id: parseInt(modelId),
        year: 2020,
        color: selectedColorObject.code,
      });
      navigate("/pickup");
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Reset selection.
  const reset = () => {
    setSelectedValue("");
    setSearchValue("");
    updateSearchParam("");
  };

  // Hide the list after a short delay (to allow clicks to register).
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  // Sync state with URL params when they change externally.
  useEffect(() => {
    const paramValue = searchParams.get(name) || "";
    if (paramValue !== selectedValue) {
      setSelectedValue(paramValue);
      const newLabel =
        colors.find((loc) => loc.value === paramValue)?.label || "";
      setSearchValue(newLabel);
      const selected = colors.find((color) => color.value === paramValue);
      setSelectedColorObject(selected || null);
    }
  }, [searchParams, name, selectedValue]);

  return (
    <div className="relative">
      <span className="text-[17px] text-[#939393] font-light">{label}</span>
      <div className="max-w-[827px] mx-auto flex items-center relative mb-12">
        <BiSearch className="absolute left-5 my-auto" color="black" />
        <Input
          name="search"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={onInputBlur}
          placeholder={t("vehicle_color.search_placeholder")}
          autoComplete="off"
          className={cn(
            "text-lg font-light placeholder:text-[#666666] bg-white border-0 h-[60px] rounded-full !ring-0 pl-16"
          )}
        />
        {selectedValue && ( // Only show clear button if an item is selected
          <Button
            type="button"
            onClick={reset}
            variant="ghost"
            className="absolute right-2 px-3 hover:bg-transparent"
          >
            <CloseIcon className="w-4 h-4 text-gray-500" />
          </Button>
        )}
      </div>
      {open && !selectedValue && (
        <ScrollArea className="max-w-[827px] mx-auto z-10 bg-white w-full mt-1 h-[400px] rounded-lg">
          {isLoading ? (
            <div className="p-1">
              <Skeleton className="h-6 w-full" />
            </div>
          ) : filteredLocations.length > 0 ? (
            filteredLocations.map((option) => (
              <div className="flex flex-col px-4 py-2 gap-2" key={option.value}>
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectItem(option.value)}
                  className="cursor-pointer px-6 py-5 hover:bg-gray-100 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <p className="text-sm">
                      {t(`vehicle_color.colors.${option.value.toLowerCase()}`)}
                    </p>
                  </div>
                  <ChevronRight color="#AAAAAA" />
                </div>
                <Separator className="border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-sm text-gray-500">
              {t("vehicle_color.no_items")}
            </div>
          )}
        </ScrollArea>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("vehicle_added_modal.title")}</DialogTitle>
            <DialogDescription>
              {t("vehicle_added_modal.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              {t("vehicle_modal.edit_button")}
            </Button>
            <Button onClick={handleDialogOk}>{t("vehicle_modal.ok_button")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ColorSearch;
