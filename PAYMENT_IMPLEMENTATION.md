# Payment Implementation Guide

This document describes the payment flow implementation for the ViaCar web application, mirroring the mobile app's payment functionality.

## Overview

The payment system follows these steps:
1. User selects a ride and clicks "Book Now"
2. User is redirected to the payment page
3. User can add a new card or select from saved cards
4. User enters CVV for the selected card
5. System creates a booking and authorizes payment
6. If 3DS authentication is required, user is redirected to the authentication page
7. System polls for payment status
8. User is shown success/failure message

## Files Created/Modified

### New Files

1. **app/lib/types/payment.ts**
   - Type definitions for payment-related data structures
   - Includes: SavedCardMeta, BookingPaymentData, PaymentAuthResponse, etc.

2. **app/lib/storage/cardStore.ts**
   - Card storage utilities using localStorage
   - Functions: saveCards, getCards, deleteCard, updateCard

3. **app/routes/payment.tsx**
   - Main payment page
   - Displays saved cards and payment summary
   - Handles CVV input and payment authorization
   - Manages 3DS authentication flow
   - Polls for payment status

4. **app/routes/add-card.tsx**
   - Page for adding new payment cards
   - Validates card information
   - Saves card to localStorage

### Modified Files

1. **.env**
   - Added payment API endpoints:
     - VITE_API_PAYMENT_AUTHORIZE=/api/payment/authorize
     - VITE_API_BOOKING_PAYMENT_STATUS=/api/booking/payment-status
     - VITE_API_BOOKING_CREATE=/api/booking/create

2. **app/lib/api.ts**
   - Added payment API methods:
     - createBooking()
     - authorizePayment()
     - getPaymentStatus()

3. **app/routes.ts**
   - Added routes for /payment and /add-card

4. **app/routes/ride-details.tsx**
   - Updated "Book Now" button to link to payment page

## Payment Flow Details

### 1. Booking Creation
```typescript
const response = await api.createBooking({
  ride_id: parseInt(rideId),
  ride_amount_id: parseInt(rideAmountId),
});
// Returns: { data: { booking_id: number } }
```

### 2. Payment Authorization
```typescript
const response = await api.authorizePayment({
  booking_id: number,
  payment_brand: string,
  card_number: string,
  card_holder_name: string,
  card_expiration_month: string,
  card_expiration_year: number,
  card_cvv: string,
  customer_email: string,
  billing_street: string,
  billing_city: string,
  billing_state: string,
  billing_post_code: string,
  billing_country: string,
  given_name: string,
  sur_name: string,
  alias?: string,
});
```

### 3. 3DS Authentication
If the payment requires 3DS authentication, the API returns:
```typescript
{
  message: {
    url: string,
    parameters: Array<{ name: string, value: string }>
  }
}
```

The system generates an HTML form that auto-submits to the 3DS URL:
```html
<form method="POST" action="${authUrl}">
  <input type="hidden" name="param1" value="value1" />
  <!-- ... more parameters ... -->
</form>
```

### 4. Payment Status Polling
After payment authorization, the system polls the payment status every 3 seconds:
```typescript
const response = await api.getPaymentStatus(bookingId);
// Returns: { data: { paymentStatus: number } }
// paymentStatus === 2 means payment is approved
```

Polling continues for up to 3 minutes, then times out.

## Card Storage

Cards are stored in localStorage with the following structure:
```typescript
interface SavedCardMeta {
  alias: string;               // Display name
  last4: string;               // Last 4 digits
  brand: string;               // VISA, MASTERCARD, etc.
  expMonth: number;            // 1-12
  expYear: number;             // Full year (e.g., 2025)
  holder: string;              // Cardholder name
  billingCountry: string;      // ISO country code
  billingCity: string;
  billingState: string;
  billingPostCode: string;
  addedAt: string;             // ISO date string
  cardHolderName: string;
  billingStreet: string;
  email: string;
  cardNumber: string;          // Full card number (for API)
}
```

**Security Note**: In production, card numbers should be encrypted or tokenized. The current implementation stores full card numbers for demonstration purposes only.

## API Endpoints

### 1. Create Booking
- **Endpoint**: `/api/booking/create`
- **Method**: POST
- **Payload**:
  ```json
  {
    "ride_id": 123,
    "ride_amount_id": 456
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "booking_id": 789
    }
  }
  ```

### 2. Authorize Payment
- **Endpoint**: `/api/payment/authorize`
- **Method**: POST
- **Payload**: See BookingPaymentData type
- **Response**: See PaymentAuthResponse type

### 3. Get Payment Status
- **Endpoint**: `/api/booking/payment-status?booking_id={id}`
- **Method**: GET
- **Response**:
  ```json
  {
    "data": {
      "paymentStatus": 2
    }
  }
  ```
  - Status codes:
    - 0: Pending
    - 1: Processing
    - 2: Approved
    - 3: Failed

## User Experience

### Payment Page
1. Shows list of saved cards
2. Allows adding new cards
3. Displays payment summary with breakdown:
   - Ride amount
   - Platform fee
   - VAT
   - Total amount
4. "Pay Now" button triggers CVV dialog

### CVV Dialog
- Modal dialog requesting CVV
- Validates CVV length (3-4 digits)
- Submits payment on confirmation

### 3DS Authentication
- Full-screen iframe showing bank's authentication page
- Auto-submits form to 3DS URL
- Polls for payment status in background

### Success/Failure
- Success: Shows confirmation with "View My Rides" button
- Failure: Shows error dialog with retry option
- Timeout: Shows warning after 3 minutes

## Error Handling

The system handles various error scenarios:
1. **Network errors**: "Please check your internet connection"
2. **Validation errors**: Specific field validation messages
3. **API errors**: Server-provided error messages
4. **Timeout errors**: "Payment verification timed out"
5. **3DS failures**: "Authentication failed or was cancelled"

## Testing

To test the payment flow:
1. Navigate to a ride details page
2. Click "Book Now"
3. Add a test card or select a saved card
4. Enter CVV
5. Observe payment authorization
6. If 3DS is required, complete authentication
7. Wait for payment status confirmation

## Security Considerations

⚠️ **Important**: This implementation is for demonstration purposes. In production:
1. Never store full card numbers in localStorage
2. Use tokenization services (e.g., Stripe, PayPal)
3. Implement proper encryption for sensitive data
4. Use HTTPS for all API calls
5. Implement rate limiting on payment attempts
6. Add fraud detection mechanisms
7. Comply with PCI DSS standards

## Future Enhancements

1. Add card editing functionality
2. Implement card tokenization
3. Add support for more payment methods (Apple Pay, Google Pay)
4. Implement payment retry logic
5. Add payment history page
6. Implement refund functionality
7. Add payment receipt generation
8. Implement webhook handling for async payment updates
