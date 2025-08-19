import { PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ModelImage from "../../../public/assets/profileeditimg.png";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import PlaceholderGallery from "../../../public/assets/placeholdeGallery.png";
import EditIcon from "../../../public/assets/editIcon.png";

export function EditProfileModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phoneNumber, setPhoneNumber] = useState("+1234567890");
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("Male");

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving profile:", {
      fullName,
      email,
      phoneNumber,
      age,
      gender,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 !max-w-5xl w-full grid grid-cols-2 rounded-lg overflow-hidden min-h-[600px] sm:!max-w-5xl">
        {/* Left Section: Image and Text */}
        <div className="relative h-[600px] flex items-end p-8 rounded-l-lg overflow-hidden">
          <img
            src={ModelImage}
            alt="People in car"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
          />
        </div>

        {/* Right Section: Form */}
        <div className="relative p-8 bg-white flex flex-col justify-between rounded-r-lg min-h-[600px]">
          {/* Close Button */}

          <div className="flex flex-col items-center gap-6 mt-8 flex-grow justify-center">
            {/* Profile Image Placeholder with Edit Icon */}
            <div className="relative w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <img
                src={PlaceholderGallery}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 right-0 top-[110px]">
                <img
                  src={EditIcon}
                  alt="Edit Icon"
                  className="h-6 w-6 top-10"
                />
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid w-full gap-4 max-w-sm">
              <Input
                id="fullName"
                placeholder={t("edit_profile_modal.full_name_placeholder")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="email"
                  placeholder={t("edit_profile_modal.email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                />
                <Input
                  id="phoneNumber"
                  placeholder={t("edit_profile_modal.phone_number_placeholder")}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="age"
                  placeholder={t("edit_profile_modal.age_placeholder")}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                />
                <Input
                  id="gender"
                  placeholder={t("edit_profile_modal.gender_placeholder")}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                />
              </div>
            </div>
          </div>

          <div className=" flex items-center justify-end">
            <Button
              type="submit"
              onClick={handleSave}
              className="float-end  w-[170px] bg-red-500 hover:bg-red-600 text-white py-3 h-12 text-lg rounded-full"
            >
              {t("edit_profile_modal.save_button")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
