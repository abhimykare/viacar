import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import type { Route } from "./+types/payment";
import Header from "~/components/layouts/header";
import Footer from "~/components/layouts/footer";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { api } from "~/lib/api";
import { getCards, saveCards, deleteCard } from "~/lib/storage/cardStore";
import type { SavedCardMeta, BookingPaymentData, PaymentAuthResponse } from "~/lib/types/payment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { FaCreditCard, FaTrash, FaEdit } from "react-icons/fa";
import { useUserStore } from "~/lib/store/userStore";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ViaCar | Payment" },
    { name: "description", content: "Complete your booking payment" },
  ];
}

type Status = "idle" | "waiting" | "approved" | "failed";

export default function Payment() {
  const { t } = useTranslation("translation", { keyPrefix: "payment" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);

  const [cards, setCards] = useState<SavedCardMeta[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [rideDetails, setRideDetails] = useState<any>(null);

  // Dialogs
  const [cvvDialog, setCvvDialog] = useState({ visible: false, cvv: "" });
  const [errorDialog, setErrorDialog] = useState({ visible: false, title: "", message: "" });
  const [show3DS, setShow3DS] = useState(false);
  const [authUrl, setAuthUrl] = useState("");
  const [authParams, setAuthParams] = useState<any[]>([]);

  const rideId = searchParams.get("rideId");
  const rideAmountId = searchParams.get("rideAmountId");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate(`/login?from=payment&rideId=${rideId}&rideAmountId=${rideAmountId}`);
    }
  }, [token, navigate, rideId, rideAmountId]);

  // Fetch ride details
  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId || !rideAmountId) return;

      try {
        const response = await api.getRideDetail({
          ride_id: parseInt(rideId),
          ride_amount_id: parseInt(rideAmountId),
        });

        if (response?.data) {
          setRideDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching ride details:", error);
      }
    };

    fetchRideDetails();
  }, [rideId, rideAmountId]);

  // Load saved cards
  useEffect(() => {
    const loadCards = () => {
      const savedCards = getCards();
      setCards(savedCards);
      if (savedCards.length > 0) {
        setSelectedCardIndex(0);
      }
    };
    loadCards();
  }, []);

  // Create booking and get booking_id
  const createBooking = async () => {
    if (!rideId || !rideAmountId) {
      showError("Booking Error", "Missing ride information");
      return null;
    }

    try {
      const response = await api.createBooking({
        ride_id: parseInt(rideId),
        ride_amount_id: parseInt(rideAmountId),
      });

      if (response?.data?.booking_id) {
        return response.data.booking_id;
      } else {
        showError("Booking Error", response?.message || "Failed to create booking");
        return null;
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      showError("Booking Error", error?.message || "Failed to create booking");
      return null;
    }
  };

  const showError = (title: string, message: string) => {
    setErrorDialog({ visible: true, title, message });
  };

  const handlePayWithSavedCard = () => {
    if (cards.length === 0) {
      showError("Payment Error", "No saved cards available");
      return;
    }
    setCvvDialog({ visible: true, cvv: "" });
  };

  const handleCVVSubmit = async () => {
    if (!cvvDialog.cvv || cvvDialog.cvv.length < 3) {
      showError("Validation Error", "Please enter a valid CVV");
      return;
    }

    const selectedCard = cards[selectedCardIndex];
    if (!selectedCard) {
      showError("Payment Error", "Please select a payment method");
      return;
    }

    setCvvDialog({ visible: false, cvv: "" });
    setLoading(true);

    try {
      // Create booking first
      const newBookingId = await createBooking();
      if (!newBookingId) {
        setLoading(false);
        return;
      }
      setBookingId(newBookingId);

      // Prepare payment data
      const postData: BookingPaymentData = {
        booking_id: newBookingId,
        payment_brand: selectedCard.brand,
        card_number: selectedCard.cardNumber,
        card_holder_name: selectedCard.cardHolderName,
        card_expiration_month: selectedCard.expMonth.toString().padStart(2, "0"),
        card_expiration_year: selectedCard.expYear,
        card_cvv: cvvDialog.cvv,
        customer_email: selectedCard.email,
        billing_street: selectedCard.billingStreet,
        billing_city: selectedCard.billingCity,
        billing_state: selectedCard.billingState,
        billing_post_code: selectedCard.billingPostCode,
        billing_country: selectedCard.billingCountry,
        given_name: selectedCard.cardHolderName.split(" ")[0] || "",
        sur_name: selectedCard.cardHolderName.split(" ").slice(1).join(" ") || "",
        alias: selectedCard.alias,
      };

      const response: PaymentAuthResponse = await api.authorizePayment(postData);

      // Handle errors
      if (response?.error || response?.status === "error") {
        const errorMessage = response?.message || response?.error || "Payment authorization failed";
        showError("Payment Error", errorMessage as string);
        setStatus("failed");
        return;
      }

      // Check for 3DS authentication
      if (response?.message?.url && response?.message?.parameters) {
        setAuthUrl(response.message.url);
        setAuthParams(response.message.parameters);
        setShow3DS(true);
        setStatus("waiting");
      } else if (response?.result?.code === "000.100.110") {
        setStatus("waiting");
      } else {
        setStatus("waiting");
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      showError("Payment Error", error?.message || "Failed to authorize payment");
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status
  useEffect(() => {
    if (status !== "waiting" || !bookingId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await api.getPaymentStatus(bookingId);
        if (response?.data?.paymentStatus === 2) {
          setStatus("approved");
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (status === "waiting") {
        setStatus("failed");
        showError("Payment Timeout", "Payment verification timed out");
      }
    }, 180000); // 3 minutes

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [status, bookingId]);

  // Generate 3DS form
  const generate3DSForm = () => {
    const paramsHtml = authParams
      .map((param) => {
        const key = param.name || Object.keys(param)[0];
        const value = param.value || param[key];
        return `<input type="hidden" name="${key}" value="${value}" />`;
      })
      .join("\n");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body onload="document.forms[0].submit()">
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
          <p>Redirecting to authentication...</p>
        </div>
        <form method="POST" action="${authUrl}">
          ${paramsHtml}
        </form>
      </body>
      <script type="text/javascript">
        var wpwlOptions = {
          paymentTarget: "_top",
        }
      </script>
      </html>
    `;
  };

  const handleDeleteCard = (index: number) => {
    deleteCard(index);
    setCards(getCards());
    if (selectedCardIndex >= cards.length - 1) {
      setSelectedCardIndex(Math.max(0, cards.length - 2));
    }
  };

  if (show3DS) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header title="Secure Authentication" />
        <div className="max-w-[1410px] w-full mx-auto px-6 py-8">
          <Card className="p-6">
            <iframe
              srcDoc={generate3DSForm()}
              className="w-full h-[600px] border-0"
              title="3DS Authentication"
            />
          </Card>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header title="Payment Successful" />
        <div className="max-w-[1410px] w-full mx-auto px-6 py-20">
          <Card className="p-12 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-semibold mb-4">Booking Confirmed!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Your payment has been processed successfully and your booking is confirmed.
            </p>
            <Button asChild className="bg-[#FF4848] hover:bg-[#FF4848]/90">
              <Link to="/my-rides">View My Rides</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header title="Payment" />
      <div className="max-w-[1410px] w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Saved Cards */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Select Payment Method</h2>

            {cards.length === 0 ? (
              <div className="text-center py-12">
                <FaCreditCard className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500 mb-6">No saved cards found</p>
                <Button asChild>
                  <Link to={`/add-card?rideId=${rideId}&rideAmountId=${rideAmountId}`}>
                    Add New Card
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cards.map((card, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedCardIndex === index
                          ? "border-[#FF4848] bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                        }`}
                      onClick={() => setSelectedCardIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaCreditCard className="text-3xl text-gray-600" />
                          <div>
                            <p className="font-semibold">
                              {card.brand} •••• {card.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {card.expMonth.toString().padStart(2, "0")}/
                              {card.expYear.toString().slice(-2)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCard(index);
                          }}
                        >
                          <FaTrash className="text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link to={`/add-card?rideId=${rideId}&rideAmountId=${rideAmountId}`}>
                    Add New Card
                  </Link>
                </Button>
              </>
            )}
          </Card>

          {/* Payment Summary */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Payment Summary</h2>

            {rideDetails ? (
              <>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ride Amount</span>
                    <span className="font-semibold">
                      SAR {parseFloat(rideDetails.serviceAmount || "0").toFixed(2)}
                    </span>
                  </div>

                  {rideDetails.platformFeeAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Platform Fee ({rideDetails.platformFeePercentage}%)
                      </span>
                      <span className="font-semibold">
                        SAR {rideDetails.platformFeeAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {rideDetails.vatAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        VAT ({rideDetails.vatPercentage}%)
                      </span>
                      <span className="font-semibold">
                        SAR {rideDetails.vatAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-xl font-bold mb-8">
                  <span>Total Amount</span>
                  <span className="text-[#00665A]">
                    SAR {rideDetails.totalAmount.toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full bg-[#FF4848] hover:bg-[#FF4848]/90 h-14 text-lg"
                  onClick={handlePayWithSavedCard}
                  disabled={loading || cards.length === 0}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading payment details...</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* CVV Dialog */}
      <Dialog open={cvvDialog.visible} onOpenChange={(open) => setCvvDialog({ ...cvvDialog, visible: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter CVV</DialogTitle>
            <DialogDescription>
              Please enter your CVV to complete the payment
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="password"
              maxLength={4}
              value={cvvDialog.cvv}
              onChange={(e) => setCvvDialog({ ...cvvDialog, cvv: e.target.value.replace(/\D/g, "") })}
              placeholder="Enter CVV"
              className="text-center text-lg"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCvvDialog({ visible: false, cvv: "" })}>
              Cancel
            </Button>
            <Button
              onClick={handleCVVSubmit}
              disabled={cvvDialog.cvv.length < 3}
              className="bg-[#FF4848] hover:bg-[#FF4848]/90"
            >
              Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialog.visible} onOpenChange={(open) => setErrorDialog({ ...errorDialog, visible: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{errorDialog.title}</DialogTitle>
            <DialogDescription>{errorDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialog({ visible: false, title: "", message: "" })}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiting Modal */}
      {status === "waiting" && !show3DS && (
        <Dialog open={true}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-2xl font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we verify your payment...</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
