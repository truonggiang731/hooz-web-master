import axios from 'axios';
import {SignInParams, SignUpParams, Tokens} from './Types';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
});

export async function signUpAsync(
  signUpParams: SignUpParams,
  exponentToken?: string | null
) {
  const response = await axiosInstance.post('/sessions/sign_up', signUpParams, {
    headers: {
      'Exponent-Token': exponentToken
    }
  });

  return response.data.data;
}

export async function signInAsync(
  signInParams: SignInParams,
  exponentToken?: string | null
) {
  const response = await axiosInstance.post('/sessions/sign_in', signInParams, {
    headers: {
      'Exponent-Token': exponentToken
    }
  });

  return response.data.data;
}

export async function signOutAsync(tokens: Tokens) {
  await axiosInstance.post(
    '/sessions/sign_out',
    {},
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Refresh-Token': tokens.refresh_token
      }
    }
  );

  return {access_token: null, refresh_token: null};
}

export async function sendVerificationCode(email: string) {
  const response = await axiosInstance.post(
    '/sessions/send_verification_code',
    {email}
  );

  return response.data.data;
}

export async function resetPassword(
  email: string,
  verification_code: string,
  password: string
) {
  const response = await axiosInstance.post('/sessions/reset_password', {
    email,
    verification_code,
    password
  });

  return response.data.data;
}

export async function refreshTokensAsync(
  tokens: Tokens,
  exponentToken?: string | null
) {
  const response = await axiosInstance.post(
    '/sessions/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Refresh-Token': tokens.refresh_token,
        'Exponent-Token': exponentToken
      }
    }
  );

  return response.data.data;
}
