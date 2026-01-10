import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import type { Route } from "./+types/add-card";
import Header from "~/components/layouts/header";
import Footer from "~/components/layouts/footer";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useTranslation } from "react-i18next";
import { getCards, saveCards } from "~/lib/storage/cardStore";
import type { SavedCardMeta } from "~/lib/types/payment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { FaCreditCard } from "react-icons/fa";
import { useUserStore } from "~/lib/store/userStore";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ViaCar | Add Card" },
        { name: "description", content: "Add a new payment card" },
    ];
}

type CardType = "VISA" | "MASTERCARD" | "AMEX" | "MADA";

export default function AddCard() {
    const { t } = useTranslation("translation", { keyPrefix: "payment" });
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = useUserStore((state) => state.token);

    const [formData, setFormData] = useState({
        cardType: "VISA" as CardType,
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        email: "",
        billingStreet: "",
        billingCity: "",
        billingState: "",
        billingPostCode: "",
        billingCountry: "SA",
    });

    const [loading, setLoading] = useState(false);
    const [errorDialog, setErrorDialog] = useState({ visible: false, title: "", message: "" });
    const [successDialog, setSuccessDialog] = useState({ visible: false });

    const rideId = searchParams.get("rideId");
    const rideAmountId = searchParams.get("rideAmountId");

    // Redirect if not logged in
    useEffect(() => {
        if (!token) {
            navigate(`/login?from=add-card&rideId=${rideId}&rideAmountId=${rideAmountId}`);
        }
    }, [token, navigate, rideId, rideAmountId]);

    const showError = (title: string, message: string) => {
        setErrorDialog({ visible: true, title, message });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);

        // Validation
        const [monthStr, yearStr] = formData.expiryDate.split("/");
        const month = Number(monthStr);
        const year = Number(yearStr);

        if (!formData.cardHolderName.trim()) {
            showError("Validation Error", "Please enter cardholder name");
            setLoading(false);
            return;
        }

        const cleanedCardNumber = formData.cardNumber.replace(/\s/g, "");
        if (cleanedCardNumber.length !== 16) {
            showError("Validation Error", "Please enter a valid 16-digit card number");
            setLoading(false);
            return;
        }

        if (!monthStr || !yearStr || month < 1 || month > 12 || yearStr.length !== 2 || year < 0 || year > 99) {
            showError("Validation Error", "Please enter a valid expiry date (MM/YY)");
            setLoading(false);
            return;
        }

        if (formData.cvv.length < 3 || formData.cvv.length > 4) {
            showError("Validation Error", "Please enter a valid CVV (3-4 digits)");
            setLoading(false);
            return;
        }

        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            showError("Validation Error", "Please enter a valid email address");
            setLoading(false);
            return;
        }

        if (!formData.billingStreet.trim()) {
            showError("Validation Error", "Please enter billing street");
            setLoading(false);
            return;
        }

        if (!formData.billingCity.trim()) {
            showError("Validation Error", "Please enter billing city");
            setLoading(false);
            return;
        }

        if (!formData.billingPostCode.trim()) {
            showError("Validation Error", "Please enter billing post code");
            setLoading(false);
            return;
        }

        try {
            // Extract last 4 digits and create card metadata
            const last4 = cleanedCardNumber.slice(-4);
            const expMonth = month;
            const expYear = 2000 + year;
            const alias = `${formData.cardHolderName.trim()} •••• ${last4} ${expMonth.toString().padStart(2, "0")}/${expYear}`;

            const savedCardMeta: SavedCardMeta = {
                alias,
                last4,
                brand: formData.cardType,
                expMonth,
                expYear,
                holder: formData.cardHolderName.trim(),
                addedAt: new Date().toISOString(),
                cardHolderName: formData.cardHolderName.trim(),
                billingStreet: formData.billingStreet.trim(),
                billingCity: formData.billingCity.trim(),
                billingState: formData.billingState.trim(),
                billingPostCode: formData.billingPostCode.trim(),
                billingCountry: formData.billingCountry.trim(),
                email: formData.email.trim(),
                cardNumber: cleanedCardNumber,
            };

            // Save to localStorage
            const cards = getCards();
            const updatedCards = [...cards, savedCardMeta];
            saveCards(updatedCards);

            setSuccessDialog({ visible: true });
        } catch (error: any) {
            console.error("Error saving card:", error);
            showError("Error", "Failed to save card. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccessDialog({ visible: false });
        navigate(`/payment?rideId=${rideId}&rideAmountId=${rideAmountId}`);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <Header title="Add New Card" />
            <div className="max-w-[800px] w-full mx-auto px-6 py-8">
                <Card className="p-8">
                    <h2 className="text-2xl font-semibold mb-6">Card Information</h2>

                    {/* Card Type Selection */}
                    <div className="mb-6">
                        <Label className="mb-3 block">Card Type</Label>
                        <div className="flex gap-4">
                            {(["VISA", "MASTERCARD", "AMEX", "MADA"] as CardType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleInputChange("cardType", type)}
                                    className={`px-6 py-3 rounded-lg border-2 transition-all ${formData.cardType === type
                                            ? "border-[#FF4848] bg-red-50"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Card Holder Name */}
                    <div className="mb-6">
                        <Label htmlFor="cardHolderName">Card Holder Name</Label>
                        <Input
                            id="cardHolderName"
                            value={formData.cardHolderName}
                            onChange={(e) => handleInputChange("cardHolderName", e.target.value)}
                            placeholder="John Doe"
                            disabled={loading}
                        />
                    </div>

                    {/* Card Number */}
                    <div className="mb-6">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => {
                                const cleaned = e.target.value.replace(/\D/g, "");
                                const match = cleaned.match(/^(.{0,4})(.{0,4})(.{0,4})(.{0,4})/);
                                if (!match) return;
                                const formatted = [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
                                handleInputChange("cardNumber", formatted);
                            }}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            disabled={loading}
                        />
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                                id="expiryDate"
                                value={formData.expiryDate}
                                onChange={(e) => {
                                    const cleaned = e.target.value.replace(/\D/g, "");
                                    if (cleaned.length >= 3) {
                                        const formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
                                        handleInputChange("expiryDate", formatted);
                                    } else {
                                        handleInputChange("expiryDate", cleaned);
                                    }
                                }}
                                placeholder="MM/YY"
                                maxLength={5}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                                id="cvv"
                                type="password"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                                placeholder="123"
                                maxLength={4}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4 mt-8">Billing Details</h3>

                    {/* Email */}
                    <div className="mb-6">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="john@example.com"
                            disabled={loading}
                        />
                    </div>

                    {/* Billing Street */}
                    <div className="mb-6">
                        <Label htmlFor="billingStreet">Street Address</Label>
                        <Input
                            id="billingStreet"
                            value={formData.billingStreet}
                            onChange={(e) => handleInputChange("billingStreet", e.target.value)}
                            placeholder="123 Main Street"
                            disabled={loading}
                        />
                    </div>

                    {/* Billing City and State */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <Label htmlFor="billingCity">City</Label>
                            <Input
                                id="billingCity"
                                value={formData.billingCity}
                                onChange={(e) => handleInputChange("billingCity", e.target.value)}
                                placeholder="Riyadh"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="billingState">State/Province</Label>
                            <Input
                                id="billingState"
                                value={formData.billingState}
                                onChange={(e) => handleInputChange("billingState", e.target.value)}
                                placeholder="Riyadh Province"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Billing Post Code */}
                    <div className="mb-8">
                        <Label htmlFor="billingPostCode">Post Code</Label>
                        <Input
                            id="billingPostCode"
                            value={formData.billingPostCode}
                            onChange={(e) => handleInputChange("billingPostCode", e.target.value)}
                            placeholder="12345"
                            disabled={loading}
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            asChild
                            disabled={loading}
                        >
                            <Link to={`/payment?rideId=${rideId}&rideAmountId=${rideAmountId}`}>
                                Cancel
                            </Link>
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 bg-[#FF4848] hover:bg-[#FF4848]/90"
                        >
                            {loading ? "Saving..." : "Save Card"}
                        </Button>
                    </div>
                </Card>
            </div>

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

            {/* Success Dialog */}
            <Dialog open={successDialog.visible} onOpenChange={handleSuccessClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Success</DialogTitle>
                        <DialogDescription>
                            Card saved successfully! You can now use it for payment.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleSuccessClose} className="bg-[#FF4848] hover:bg-[#FF4848]/90">
                            Continue to Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}
