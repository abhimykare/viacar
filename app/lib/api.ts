const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useUserStore } from "./store/userStore";

const getToken = () => useUserStore.getState().token;

async function callApi(
  endpoint: string,
  method: string,
  data: any,
  contentType: "json" | "formdata" = "json"
) {
  const url = `${BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {},
  };

  if (contentType === "json") {
    options.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    };
    options.body = JSON.stringify(data);
  } else if (contentType === "formdata") {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (getToken()) {
      options.headers = {
        Authorization: `Bearer ${getToken()}`,
      };
    }
    options.body = formData;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error calling API ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  sendAuthOtp: (data: { country_code: string; mobile_number: string }) =>
    callApi(import.meta.env.VITE_API_SEND_AUTH_OTP, "POST", data, "formdata"),
  verifyAuthOtp: (data: {
    otp_id: string;
    otp: string;
    device_type: string;
    fcm_token: string;
  }) =>
    callApi(import.meta.env.VITE_API_VERIFY_AUTH_OTP, "POST", data, "formdata"),
  register: (data: {
    otp_id: string;
    device_type: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    fcm_token: string;
  }) => callApi(import.meta.env.VITE_API_REGISTER, "POST", data, "formdata"),
  placesAutocomplete: (data: { input: string }) =>
    callApi(
      import.meta.env.VITE_API_PLACES_AUTOCOMPLETE,
      "POST",
      data,
      "formdata"
    ),
  addBankDetails: (data: {
    account_holder_name: string;
    bank_name: string;
    bank_branch: string;
    account_number: string;
    iban: string;
    swift_code: string;
  }) =>
    callApi(
      import.meta.env.VITE_API_ADD_BANK_DETAILS,
      "POST",
      data,
      "formdata"
    ),
  updateBankDetails: (data: {
    id: string;
    account_holder_name: string;
    bank_name: string;
    bank_branch: string;
    account_number: string;
    iban: string;
    swift_code: string;
  }) =>
    callApi(
      import.meta.env.VITE_API_UPDATE_BANK_DETAILS,
      "POST",
      data,
      "formdata"
    ),
  listBankDetails: () =>
    callApi(import.meta.env.VITE_API_LIST_BANK_DETAILS, "GET", {}),
  deleteBankDetails: (data: { id: string }) =>
    callApi(
      import.meta.env.VITE_API_DELETE_BANK_DETAILS,
      "POST",
      data,
      "formdata"
    ),
  updateProfile: (data: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    profile_image?: File | string;
    about?: string;
  }) =>
    callApi(import.meta.env.VITE_API_UPDATE_PROFILE, "POST", data, "formdata"),
  // New API method for updating profile image
  updateProfileImage: (data: { profile_image: File }) =>
    callApi(
      import.meta.env.VITE_API_UPDATE_PROFILE_IMAGE,
      "POST",
      data,
      "formdata"
    ),
  createRide: (data: {
    pickup_lat: number;
    pickup_lng: number;
    pickup_address: string;
    destination_lat: number;
    destination_lng: number;
    destination_address: string;
    departure_time: string;
    available_seats: number;
    price_per_seat: number;
    notes: string;
    vehicle_id: number;
  }) =>
    callApi(
      import.meta.env.VITE_API_CREATE_RIDE,
      "POST",
      data,
      "json"
    ),
};
