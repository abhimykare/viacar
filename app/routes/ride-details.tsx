import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import type { Route } from "./+types/ride-details";
import { Card } from "~/components/ui/card";
import TimeDirectionIcon from "~/components/icons/time-direction-icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FaAngleRight, FaStar } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { Link, useSearchParams } from "react-router";
import { Separator } from "~/components/ui/separator";
import { IoArrowForward } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsFillLightningFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { cn, formatDDMMYYYYToReadable, formatISODateTimeToTime, formatDuration } from "~/lib/utils";
import { createGoogleMap } from "~/lib/googlemap";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "~/lib/store/userStore";
import { api } from "~/lib/api";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ViaCar | Ride Details" },
    { name: "description", content: "ViaCar" },
  ];
}

export default function Page() {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "ride_details",
  });
  const isRTL = i18n.language === "ar";
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const token = useUserStore((state) => state.token);

  const [searchParams] = useSearchParams();
  const [rideDetails, setRideDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the selected ride amount from the rideAmounts array
  const selectedRideAmount = rideDetails?.rideAmounts?.find(
    (amount: any) => amount.id === parseInt(searchParams.get('rideAmountId') || '0')
  );

  // Get pickup and drop stops based on the selected ride amount
  const pickupStop = rideDetails?.pickUpStop || rideDetails?.rideStops?.[0];
  const dropoffStop = rideDetails?.dropOffStop || rideDetails?.rideStops?.[rideDetails?.rideStops?.length - 1];

  // Fetch ride details
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const rideId = searchParams.get('rideId');
        const rideAmountId = searchParams.get('rideAmountId');

        if (!rideId || !rideAmountId) {
          setError('Missing ride information');
          setLoading(false);
          return;
        }

        console.log('Fetching ride details:', { rideId, rideAmountId });

        const response = await api.getRideDetail({
          ride_id: parseInt(rideId),
          ride_amount_id: parseInt(rideAmountId)
        });

        console.log('Ride details response:', response);

        if (response?.data) {
          setRideDetails(response.data);
        } else {
          setError(response?.message || 'Failed to fetch ride details');
        }
      } catch (err: any) {
        console.error('Error fetching ride details:', err);
        setError(err?.message || 'Failed to fetch ride details');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [searchParams]);

  useEffect(() => {
    let mapService: any = null;

    const initializeMap = async () => {
      if (mapContainerRef.current && rideDetails && pickupStop && dropoffStop) {
        try {
          const startCoords = {
            lat: parseFloat(pickupStop.lat),
            lng: parseFloat(pickupStop.lng),
            address: pickupStop.address
          };
          const endCoords = {
            lat: parseFloat(dropoffStop.lat),
            lng: parseFloat(dropoffStop.lng),
            address: dropoffStop.address
          };

          mapService = await createGoogleMap(
            startCoords,
            endCoords,
            "ride-map",
            "300px"
          );
        } catch (error) {
          console.error("Failed to initialize map:", error);
        }
      }
    };

    initializeMap();

    return () => {
      if (mapService) {
        mapService.destroy();
      }
    };
  }, [rideDetails, pickupStop, dropoffStop]);

  return (
    <div className="bg-[#F5F5F5]">
      <Header title={t("title")} />
      <div className="max-w-[1410px] w-full mx-auto px-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-xl">Loading ride details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-xl text-red-500">{error}</p>
            </div>
          </div>
        ) : rideDetails ? (
          <>
            <p className="flex items-center justify-center gap-2 text-2xl lg:text-[2.188rem] font-medium text-center pt-[60px] pb-[30px]">
              <img
                className="size-[20px] lg:size-[36px]"
                src="/assets/calendar.svg"
                alt=""
              />
              <span>{formatDDMMYYYYToReadable(rideDetails.rideId?.date || rideDetails.date)}</span>
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-[60px]">
              <Card className="shadow-none p-5">
                <div className="flex items-center gap-4 mb-5">
                  <TimeDirectionIcon
                    time={formatDuration(selectedRideAmount?.duration_minutes || rideDetails.estimated_duration_minutes || 0)}
                    className="max-sm:hidden"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm lg:text-base text-[#939393] font-light">
                      {t("pickup")}
                    </p>
                    <p className="text-base lg:text-lg mb-8">
                      {pickupStop?.address || 'N/A'}
                    </p>
                    <p className="text-sm lg:text-base text-[#939393] font-light">
                      {t("drop")}
                    </p>
                    <p className="text-base lg:text-lg">{dropoffStop?.address || 'N/A'}</p>
                  </div>
                  <div className="flex flex-col text-end ml-auto">
                    <p className="text-sm lg:text-base text-[#939393] font-light">
                      {t("pickup_time")}
                    </p>
                    <p className="text-base lg:text-lg mb-8">
                      {formatISODateTimeToTime(rideDetails.pickup_time || '')}
                    </p>
                    <p className="text-sm lg:text-base text-[#939393] font-light">
                      {t("drop_time")}
                    </p>
                    <p className="text-base lg:text-lg">
                      {formatISODateTimeToTime(rideDetails.drop_time || '')}
                    </p>
                  </div>
                </div>

                {/* Google Map Integration */}
                <div
                  ref={mapContainerRef}
                  id="ride-map"
                  className="w-full rounded-lg border border-gray-200 mt-4"
                  style={{ minHeight: "300px" }}
                />

                <div className="flex flex-col mt-5">
                  <p className="text-xl lg:text-2xl mb-4">{t("details.title")}</p>
                  <div className="flex flex-wrap gap-4 pb-4 lg:pb-10">
                    {(rideDetails.rideId?.additional_notes || rideDetails.additional_notes) && (
                      <div className="flex items-center justify-center rounded-full border border-[#E1DFDF] px-4 h-[30px] lg:h-[36px] text-sm lg:text-[1.06rem] font-light w-max">
                        {rideDetails.rideId?.additional_notes || rideDetails.additional_notes}
                      </div>
                    )}
                    <div className="flex items-center justify-center rounded-full border border-[#E1DFDF] px-4 h-[30px] lg:h-[36px] text-sm lg:text-[1.06rem] font-light w-max">
                      {rideDetails.rideId?.available_seats || rideDetails.available_passengers || 0} {((rideDetails.rideId?.available_seats || rideDetails.available_passengers) === 1) ? 'seat' : 'seats'} available
                    </div>
                    {(rideDetails.rideId?.max_2_in_back || rideDetails.max_2_in_back) && (
                      <div className="flex items-center justify-center rounded-full border border-[#E1DFDF] px-4 h-[30px] lg:h-[36px] text-sm lg:text-[1.06rem] font-light w-max">
                        Max 2 in back
                      </div>
                    )}
                    {rideDetails.rideStops && rideDetails.rideStops.length > 2 && (
                      <div className="flex items-center justify-center rounded-full border border-[#E1DFDF] px-4 h-[30px] lg:h-[36px] text-sm lg:text-[1.06rem] font-light w-max">
                        {rideDetails.rideStops.length - 2} stop{rideDetails.rideStops.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              <Card className="shadow-none py-6 px-8 gap-4">
                <div className="flex items-center justify-between">
                  <Link to={`/profile?userId=${rideDetails.driver.id}`} className="flex items-start gap-4">
                    <Avatar className="size-[50px] lg:size-[65px]">
                      <AvatarImage
                        src={rideDetails.driver.profile_image || "https://github.com/shadcn.png"}
                        alt={rideDetails.driver.name}
                      />
                      <AvatarFallback>{rideDetails.driver.first_name?.charAt(0)}{rideDetails.driver.last_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <p className="text-lg lg:text-2xl mb-1">
                          {rideDetails.driver.name}
                        </p>
                        <img
                          className="size-[20px] lg:size-[24px]"
                          src="/assets/verified.svg"
                          alt=""
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <FaStar className="fill-[#FF9C00]" />
                        <p className="text-lg lg:text-2xl">{parseFloat(rideDetails.driver.avg_rating).toFixed(1)}</p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/chat?userId=${rideDetails.driver.id}`}>
                        <img
                          className="size-[30px] lg:size-[40px]"
                          src="/assets/chat.svg"
                          alt=""
                        />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/profile?userId=${rideDetails.driver.id}`}>
                        <FaAngleRight
                          color="#BEBEBE"
                          height={14}
                          className={cn(isRTL && "scale-x-[-1]")}
                        />
                      </Link>
                    </Button>
                  </div>
                </div>
                <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />

                {rideDetails.passengers && rideDetails.passengers.length > 0 ? (
                  <>
                    <p className="text-xl lg:text-[1.563rem]">
                      {t("passengers.title")}
                    </p>
                    {rideDetails.passengers.map((passenger: any, index: number) => (
                      <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="size-[40px] lg:size-[56px]">
                            <AvatarImage
                              src={passenger.profile_image || "https://github.com/shadcn.png"}
                              alt={passenger.name}
                            />
                            <AvatarFallback>{passenger.name?.charAt(0) || 'P'}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-base lg:text-xl mb-1">
                              {passenger.name}
                            </p>
                            {passenger.pickup_address && passenger.drop_address && (
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-sm lg:text-base text-[#666666] font-light truncate max-w-[100px]">
                                  {passenger.pickup_address}
                                </p>
                                <IoArrowForward
                                  color="#A5A5A5"
                                  className={cn(isRTL && "scale-x-[-1]")}
                                />
                                <p className="text-sm lg:text-base text-[#666666] font-light truncate max-w-[100px]">
                                  {passenger.drop_address}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/profile?userId=${passenger.id}`}>
                            <MdKeyboardArrowRight
                              color="#A69A9A"
                              className={cn(
                                "size-[25px] lg:size-[28px]",
                                isRTL && "scale-x-[-1]"
                              )}
                            />
                          </Link>
                        </Button>
                      </div>
                    ))}
                    <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
                  </>
                ) : null}

                <div className="flex items-center justify-between">
                  <p className="text-lg lg:text-[1.563rem]">
                    Price per passenger
                  </p>
                  <p className="text-lg lg:text-[1.563rem] text-[#00665A]">
                    <span className="font-semibold">SAR</span>
                    <span className="font-medium ml-2">{parseFloat(selectedRideAmount?.amount || rideDetails.serviceAmount || '0').toFixed(2)}</span>
                  </p>
                </div>
                <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-xl lg:text-2xl mb-1">
                      {rideDetails.vehicle.vehicleModel.vehicleBrand.name} {rideDetails.vehicle.vehicleModel.name}
                    </p>
                    <p className="text-base text-[#666666] font-light">
                      {rideDetails.vehicle.year} • {rideDetails.vehicle.color}
                    </p>
                  </div>
                  <img src="/assets/car-preview.png" alt="" />
                </div>
                <Separator className="mt-2 border-t !border-dashed !border-[#CDCDCD] bg-transparent" />
                <p className="text-lg lg:text-[1.563rem]">
                  {t("price_summary.title")}
                </p>
                <div className="grid grid-cols-[1fr_10px_auto] gap-4 items-center">
                  <p className="text-base lg:text-xl text-[#666666] font-light">
                    Ride Amount
                  </p>
                  <p className="text-lg lg:text-[1.563rem]">:</p>
                  <p className="text-lg lg:text-xl text-end">
                    {parseFloat(selectedRideAmount?.amount || rideDetails.serviceAmount || '0').toFixed(2)} SAR
                  </p>

                  {rideDetails.platformFeeAmount > 0 && (
                    <>
                      <p className="text-base lg:text-xl text-[#666666] font-light">
                        Platform Fee ({rideDetails.platformFeePercentage}%)
                      </p>
                      <p className="text-lg lg:text-[1.563rem]">:</p>
                      <p className="text-lg lg:text-xl text-end">
                        {rideDetails.platformFeeAmount.toFixed(2)} SAR
                      </p>
                    </>
                  )}

                  {rideDetails.vatAmount > 0 && (
                    <>
                      <p className="text-base lg:text-xl text-[#666666] font-light">
                        VAT ({rideDetails.vatPercentage}%)
                      </p>
                      <p className="text-lg lg:text-[1.563rem]">:</p>
                      <p className="text-lg lg:text-xl text-end">
                        {rideDetails.vatAmount.toFixed(2)} SAR
                      </p>
                    </>
                  )}

                  <p className="text-xl lg:text-[1.375rem] text-[#666666] font-light">
                    {t("price_summary.total")}
                  </p>
                  <p className="text-lg lg:text-[1.563rem]">:</p>
                  <p className="text-xl text-[1.75rem] text-[#00665A] font-medium text-end">
                    {rideDetails.totalAmount.toFixed(2)} SAR
                  </p>
                </div>
                <div className="flex items-center justify-center p-4">
                  <Button
                    className="bg-[#FF4848] rounded-full h-[55px] w-[241px] px-8 cursor-pointer text-xl"
                    asChild
                  >
                    <Link to={token ? `/payment?rideId=${rideDetails.rideId?.id || rideDetails.id}&rideAmountId=${selectedRideAmount?.id}` : `/login?from=ride-details&rideId=${rideDetails.rideId?.id || rideDetails.id}&rideAmountId=${selectedRideAmount?.id}`}>
                      <BsFillLightningFill className="size-[18px]" />
                      <span>{t("book_now")}</span>
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}
