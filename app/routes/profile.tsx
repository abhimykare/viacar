import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/profile";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import ChatIcon from "~/components/icons/chat-icon";
import { CiLocationOn } from "react-icons/ci";
import { LuInfo } from "react-icons/lu";
import { MdOutlineStar, MdOutlineStarHalf, MdEdit } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { EditProfileModal } from "~/components/modals/edit-profile-modal";
import { useUserStore } from "~/lib/store/userStore";
import { api } from "~/lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ViaCar | Profile" },
    { name: "description", content: "ViaCar" },
  ];
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  country_code: string;
  mobile_number: string;
  phone_number: string;
  gender: string | null;
  gender_name: string;
  date_of_birth: string;
  profile_image_url: string;
  about: string | null;
  age: number | null;
  avg_rating: string;
  is_verified: number;
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useUserStore(); // Assuming you have user data in your store

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile from API
        const response = await api.getProfile();
        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
        
        // Fallback to store data if API fails
        if (currentUser) {
          setUser(currentUser as User);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    // You might also want to update your user store here
    // useUserStore.getState().setUser(updatedUser);
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderStarRating = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MdOutlineStar key={i} color="#FF9C00" className="size-[22px]" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <MdOutlineStarHalf key="half" color="#FF9C00" className="size-[22px]" />
      );
    }

    const remainingStars = 5 - Math.ceil(numRating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <MdOutlineStar
          key={`empty-${i}`}
          color="#E0E0E0"
          className="size-[22px]"
        />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="bg-[#F8FAFB] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="bg-[#F8FAFB] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#F8FAFB] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFB]">
      <Header
        title={t("profile.title")}
        breadcrumb={[
          { label: t("common.home"), href: "/" },
          { label: t("profile.breadcrumb.select_ride"), href: "/ride" },
          {
            label: t("profile.breadcrumb.ride_details"),
            href: "/ride-details",
          },
          { label: t("profile.breadcrumb.profile"), href: "/profile" },
        ]}
      />
      <div className="max-w-[1410px] w-full mx-auto px-6 pt-8 lg:pt-[60px] pb-10 lg:pb-[80px] flex flex-col lg:flex-row gap-10 lg:gap-[80px]">
        <div className="flex flex-col items-center justify-center gap-[40px]">
          <div className="relative">
            <img
              src={user.profile_image_url || "/assets/profile-img.png"}
              alt="Profile"
              className="w-48 h-48 lg:w-64 lg:h-64 object-cover rounded-lg"
            />
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-2 right-2 bg-white hover:bg-gray-50 text-gray-600 p-2 rounded-full shadow-md"
              size="sm"
            >
              <MdEdit className="size-4" />
            </Button>
          </div>
          <Button
            className="bg-[#FF4848] rounded-full h-[40px] lg:h-[55px] w-[183px] px-8 cursor-pointer text-base lg:text-xl"
            asChild
          >
            <Link to={`/chat`}>
              <ChatIcon className="!stroke-white size-[20px] lg:size-[30px]" />
              <span>{t("profile.chat")}</span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap gap-4 lg:gap-14 mb-8 items-center">
            <div>
              <p className="text-[2.188rem] font-semibold">
                {user.full_name || `${user.first_name} ${user.last_name}`}
              </p>
              {user.age ||
                (calculateAge(user.date_of_birth) > 0 && (
                  <p className="text-lg text-[#666666]">
                    {user.age || calculateAge(user.date_of_birth)} years old
                    {user.gender_name &&
                      user.gender_name !== "Not Specified" &&
                      ` • ${user.gender_name}`}
                  </p>
                ))}
            </div>
            <a
              className="flex items-center gap-1 text-lg text-[#666666]"
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CiLocationOn color="black" />
              <span>{t("profile.location")}</span>
            </a>
            <Button
              variant="outline"
              className="text-[#00A1FF] border-[#EBEBEB] shadow-none text-base font-light rounded-full h-[42px] !px-6 lg:ml-auto"
            >
              <LuInfo />
              <span>{t("profile.report_number")}</span>
            </Button>
          </div>

          {user.email && (
            <div className="mb-4">
              <p className="text-lg text-[#666666]">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-lg text-[#666666]">
              <span className="font-medium">Phone:</span> {user.phone_number}
            </p>
          </div>

          <Link to={`/reviews`}>
            <p className="text-xl text-[#666666] font-light mb-1">
              {t("profile.rating")}
            </p>
            <div className="flex items-center mb-8">
              <p className="text-[1.563rem] mr-4">{user.avg_rating}</p>
              {renderStarRating(user.avg_rating)}
            </div>
          </Link>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-[80px] mb-[40px]">
            <div className="flex items-center gap-3">
              <FiCheckSquare
                color={user.email ? "#00F076" : "#CCCCCC"}
                className="size-[22px]"
              />
              <p
                className={`text-lg font-light ${
                  user.email ? "text-[#666666]" : "text-[#CCCCCC]"
                }`}
              >
                {t("profile.verified.email")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckSquare color="#00F076" className="size-[22px]" />
              <p className="text-lg text-[#666666] font-light">
                {t("profile.verified.phone")}
              </p>
            </div>
            <p className="text-lg text-[#666666] font-light">
              <span className="text-[#00F076] mr-2">53</span>
              {t("profile.rides_published")}
            </p>
          </div>
          <p className="text-2xl mb-3">{t("profile.about")}</p>
          <div className="bg-[#F5F5F5] rounded-2xl p-4 lg:p-8 text-base font-light leading-[30px] relative">
            {user.about ? (
              <p>{user.about}</p>
            ) : (
              <p className="text-[#AAAAAA] italic">
                {t("profile.no_bio") ||
                  "No bio available. Click edit to add your bio."}
              </p>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={user}
        onProfileUpdate={handleProfileUpdate}
      />

      <Footer />
    </div>
  );
}
