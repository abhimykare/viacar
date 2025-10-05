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
    if (method !== "GET") {
      options.body = JSON.stringify(data);
    }
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
  }) => callApi(import.meta.env.VITE_API_CREATE_RIDE, "POST", data, "json"),

  verifyId: (data: {
    national_id_number: string;
    sequence_number: string;
    car_plate_number: string;
    national_id?: File | string;
    vehicle_registration?: File | string;
    driving_license?: File | string;
  }) => callApi(import.meta.env.VITE_API_VERIFY_ID, "POST", data, "formdata"),

  getVehicleBrands: (searchQuery?: string) => {
    const endpoint = searchQuery
      ? `${import.meta.env.VITE_API_VEHICLE_BRANDS}?search=${searchQuery}`
      : import.meta.env.VITE_API_VEHICLE_BRANDS;
    return callApi(endpoint, "GET", {});
  },

  getVehicleModels: (searchQuery?: string, brand_id?: number, category_id?: number) => {
    let endpoint = import.meta.env.VITE_API_LIST_VEHICLE_MODELS;
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (brand_id) {
      params.append("brand_id", brand_id.toString());
    }
    if (category_id) {
      params.append("category_id", category_id.toString());
    }

    if (params.toString()) {
      endpoint = `${endpoint}?${params.toString()}`;
    }
    return callApi(endpoint, "GET", {});
  },

  addVehicle: (data: { model_id: number; year: number; color: string }) =>
    callApi(import.meta.env.VITE_API_VEHICLE_ADD, "POST", data, "json"),

  searchRides: (data: {
    user_lat: number;
    user_lng: number;
    destination_lat: number;
    destination_lng: number;
    date: string;
    passengers: number;
    max_walking_distance_km: number;
  }) => callApi(import.meta.env.VITE_API_RIDE_SEARCH, "POST", data, "json"),

  getRideDetail: (data: { ride_id: number }) =>
    callApi(import.meta.env.VITE_API_RIDE_DETAIL, "POST", data, "json"),

  updateRideStatus: (data: { ride_id: number; status: string }) =>
    callApi(import.meta.env.VITE_API_RIDE_STATUS, "POST", data, "json"),
};
