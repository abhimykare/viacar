import { PencilIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ModelImage from "../../../public/assets/profileeditimg.png";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import PlaceholderGallery from "../../../public/assets/placeholdeGallery.png";
import EditIcon from "../../../public/assets/editIcon.png";
import { api } from "~/lib/api";
import { useUserStore } from "~/lib/store/userStore";

export function EditProfileModal({
  open,
  onOpenChange,
  userData,
  onProfileUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData?: any;
  onProfileUpdate?: (updatedUser: any) => void;
}) {
  const { t } = useTranslation();
  const { userData: storeUserData, updateUserData } = useUserStore();

  // Use store data as fallback if userData prop is not provided
  const currentUserData = userData || storeUserData;
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phoneNumber, setPhoneNumber] = useState("+1234567890");
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("Male");
  const [about, setAbout] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user data
  useEffect(() => {
    if (currentUserData && open) {
      setFullName(
        currentUserData.full_name ||
          `${currentUserData.first_name || ""} ${
            currentUserData.last_name || ""
          }`
      );
      setEmail(currentUserData.email || "");
      setPhoneNumber(
        currentUserData.phone_number || currentUserData.mobile_number || ""
      );
      setAge(currentUserData.age?.toString() || "");
      setGender(currentUserData.gender || "");
      setAbout(currentUserData.about || "");
      setProfileImagePreview(currentUserData.profile_image_url || "");
      setErrors({});
    }
  }, [currentUserData, open]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      // Clear any previous image errors
      setErrors((prev) => ({ ...prev, image: "" }));

      // Set preview immediately
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));

      // Upload image immediately
      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    setIsImageUploading(true);

    try {
      const response = await api.updateProfileImage({ profile_image: file });

      if (response.data) {
        console.log("Image uploaded successfully:", response);

        // Update the preview with the server URL
        setProfileImagePreview(response.data.profile_image_url);

        // Update the store with new image data
        updateUserData({
          profile_image: response.data.profile_image,
          profile_image_url: response.data.profile_image_url,
        });

        // Update the user data in parent component if callback is provided
        if (onProfileUpdate) {
          const updatedUser = {
            ...currentUserData,
            profile_image_url: response.data.profile_image_url,
            profile_image: response.data.profile_image,
          };
          onProfileUpdate(updatedUser);
        }

        // Show success message
        alert(response.message || "Profile image updated successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);

      // Reset to previous state on error
      setProfileImagePreview(currentUserData?.profile_image_url || "");
      setProfileImage(null);

      if (error instanceof Error) {
        setErrors((prev) => ({
          ...prev,
          image: error.message || "Failed to upload image",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          image: "An unexpected error occurred while uploading image",
        }));
      }
    } finally {
      setIsImageUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (age && (isNaN(Number(age)) || Number(age) < 13 || Number(age) > 100)) {
      newErrors.age = "Please enter a valid age (13-100)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Split full name into first and last name
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const updateData: any = {
        first_name: firstName,
        last_name: lastName,
        gender:
          gender === "1" || gender === "male"
            ? 1
            : gender === "0" || gender === "female"
            ? 0
            : gender === "2" || gender === "other"
            ? 2
            : null,
      };

      // Calculate date of birth from age if provided
      if (age) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - parseInt(age);
        updateData.date_of_birth = `${birthYear}-01-01`;
      }

      // Add optional fields only if they have values
      if (about.trim()) {
        updateData.about = about.trim();
      }

      console.log("Updating profile with data:", updateData);

      const response = await api.updateProfile(updateData);

      if (response.data) {
        console.log("Profile updated successfully:", response);

        // Update the store with new profile data
        updateUserData({
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          gender: updateData.gender,
          date_of_birth: updateData.date_of_birth,
          about: updateData.about,
          age: age ? parseInt(age) : undefined,
        });

        // Call the callback to update parent component with combined data
        if (onProfileUpdate) {
          const updatedUser = {
            ...currentUserData,
            ...response.data,
            profile_image_url: profileImagePreview, // Keep the current image URL
          };
          onProfileUpdate(updatedUser);
        }

        // Show success message
        alert(response.message || "Profile updated successfully");

        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      // Handle specific error cases
      if (error instanceof Error) {
        setErrors({
          general: error.message || "An error occurred while updating profile",
        });
      } else {
        setErrors({ general: "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex flex-col items-center gap-6 mt-8 flex-grow justify-center">
            {/* Profile Image Placeholder with Edit Icon */}
            <div className="relative w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              {isImageUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
              <img
                src={profileImagePreview || PlaceholderGallery}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-0 right-0 top-[110px]">
                <label htmlFor="profile-image-input" className="cursor-pointer">
                  <img
                    src={EditIcon}
                    alt="Edit Icon"
                    className="h-6 w-6 top-10"
                  />
                </label>
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isImageUploading}
                />
              </div>
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
            {isImageUploading && (
              <p className="text-blue-500 text-sm">Uploading image...</p>
            )}

            {/* Input Fields */}
            <div className="grid w-full gap-4 max-w-sm">
              <div>
                <Input
                  id="fullName"
                  placeholder={
                    t("edit_profile_modal.full_name_placeholder") || "Full Name"
                  }
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      t("edit_profile_modal.email_placeholder") || "Email"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Input
                    id="phoneNumber"
                    placeholder={
                      t("edit_profile_modal.phone_number_placeholder") ||
                      "Phone Number"
                    }
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                    disabled={true} // Phone number is typically not editable
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="age"
                    type="number"
                    placeholder={
                      t("edit_profile_modal.age_placeholder") || "Age"
                    }
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 h-12"
                    disabled={isLoading}
                    min="13"
                    max="100"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                  )}
                </div>
                <div>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-12 bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 rounded-md px-3"
                    disabled={isLoading}
                  >
                    <option value="">
                      {t("edit_profile_modal.gender_placeholder") ||
                        "Select Gender"}
                    </option>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                    <option value="2">Other</option>
                  </select>
                </div>
              </div>

              {/* About Section */}
              <div>
                <textarea
                  id="about"
                  placeholder={
                    t("edit_profile_modal.about_placeholder") ||
                    "About (Optional)"
                  }
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full h-20 bg-gray-100 border-none focus:ring-0 focus:ring-offset-0 rounded-md p-3 resize-none"
                  disabled={isLoading}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {about.length}/500 characters
                </p>
              </div>
            </div>

            {errors.general && (
              <div className="w-full max-w-sm">
                <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {errors.general}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              onClick={handleSave}
              disabled={isLoading || isImageUploading}
              className="float-end w-[170px] bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 h-12 text-lg rounded-full"
            >
              {isLoading
                ? t("edit_profile_modal.saving_button") || "Saving..."
                : t("edit_profile_modal.save_button") || "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
