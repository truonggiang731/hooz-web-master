import {Tokens} from '@services';
import Cookies from 'js-cookie';

export function setTokens(tokens: null | Tokens) {
  if (tokens) {
      Cookies.set('RefreshToken', tokens.refresh_token);
      Cookies.set('AccessToken', tokens.access_token);
  } else {
      Cookies.remove('RefreshToken');
      Cookies.remove('AccessToken');
  }
}

export function getTokens() {
  const refresh_token = Cookies.get('RefreshToken');
  const access_token = Cookies.get('AccessToken');

  return refresh_token && access_token ? {refresh_token, access_token} : null;
}

export function eraseTokens() {
  Cookies.remove('RefreshToken');
  Cookies.remove('AccessToken');
}
