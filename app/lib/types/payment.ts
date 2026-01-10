// Payment related types
export interface SavedCardMeta {
  alias: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  holder: string;
  billingCountry: string;
  billingCity: string;
  billingState: string;
  billingPostCode: string;
  addedAt: string;
  cardHolderName: string;
  billingStreet: string;
  email: string;
  cardNumber: string;
}

export interface BookingPaymentData {
  booking_id: number;
  payment_brand: string;
  card_number: string;
  card_holder_name: string;
  card_expiration_month: string;
  card_expiration_year: number;
  card_cvv: string;
  customer_email: string;
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_post_code: string;
  billing_country: string;
  given_name: string;
  sur_name: string;
  alias?: string;
}

export interface PaymentAuthResponse {
  error?: string;
  status?: string;
  message?: {
    url?: string;
    parameters?: Array<{ name: string; value: string } | Record<string, string>>;
  };
  result?: {
    code: string;
    description?: string;
  };
  errors?: Array<{ message: string } | string>;
}

export interface PaymentStatusResponse {
  data?: {
    paymentStatus: number;
  };
  message?: string;
}

export interface BookingCreateResponse {
  data?: {
    booking_id: number;
  };
  message?: string;
}
