import axios from 'axios';
import { store } from '../app/store';
import { notify } from '../features/notificationSlice';
import { setAccessExpireTimestamp, setAccessToken, setRefreshToken, setUserId } from '../features/userAuthSlice';

const yikyakGoogleApiKey = 'AIzaSyCbj3LAMZeKBSkZcrVVI323Znj47Awc7c8';

export async function googleVerifyBearerToken(token: string) {
  const response = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${yikyakGoogleApiKey}`, {
    idToken: token
  });
  

  store.dispatch(setAccessToken(token));
  store.dispatch(setUserId(response.data.users[0].localId));

  const expireTimestamp = new Date(response.data.users[0].lastRefreshAt);
  expireTimestamp.setSeconds(expireTimestamp.getSeconds() + 3600);
  store.dispatch(setAccessExpireTimestamp(expireTimestamp));
}

export async function googleRefreshBearerToken(refreshToken: string) {
  const response = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${yikyakGoogleApiKey}`, { 
    grantType: 'refresh_token', refreshToken: refreshToken 
  });

  store.dispatch(setAccessToken(response.data.access_token));
  store.dispatch(setRefreshToken(response.data.refresh_token));
  store.dispatch(setUserId(response.data.user_id));

  const expireTimestamp = new Date();
  expireTimestamp.setSeconds(expireTimestamp.getSeconds() + 3600);
  store.dispatch(setAccessExpireTimestamp(expireTimestamp));
  return response.data.access_token;
}

export async function googleRefreshExistingTokenIfNeeded() {
  const now = new Date();
  const expireTimestamp = new Date(store.getState().userAuth.accessExpireTimestamp);
  const refreshToken = store.getState().userAuth.refreshToken;
  const existingToken = store.getState().userAuth.accessToken;

  if (now > expireTimestamp) {
    if (refreshToken !== '') {
      return googleRefreshBearerToken(refreshToken);
    } else {
      store.dispatch(notify({ type: 'error', message: 'Unable to refresh credentials'}));
      return '';
    }
  } 
  return existingToken;
}