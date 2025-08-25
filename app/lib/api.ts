const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function callApi(endpoint: string, method: string, data: any, contentType: 'json' | 'formdata' = 'json') {
  const url = `${BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {},
  };

  if (contentType === 'json') {
    options.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    options.body = JSON.stringify(data);
  } else if (contentType === 'formdata') {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
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
    callApi(import.meta.env.VITE_API_SEND_AUTH_OTP, 'POST', data, 'formdata'),
  verifyAuthOtp: (data: { otp_id: string; otp: string; device_type: string; fcm_token: string }) =>
    callApi(import.meta.env.VITE_API_VERIFY_AUTH_OTP, 'POST', data, 'formdata'),
  register: (data: { otp_id: string; device_type: string; first_name: string; last_name: string; date_of_birth: string; gender: string; fcm_token: string }) =>
    callApi(import.meta.env.VITE_API_REGISTER, 'POST', data, 'formdata'),
  placesAutocomplete: (data: { input: string }) =>
    callApi(import.meta.env.VITE_API_PLACES_AUTOCOMPLETE, 'POST', data, 'formdata'),
};