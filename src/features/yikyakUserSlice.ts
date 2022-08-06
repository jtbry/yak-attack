import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from 'leaflet';
import { User } from '../model/User';

interface YikYakUserState {
  user?: User;
  location: LatLng;
  locationString: string;
}

const initialState: YikYakUserState = {
  user: undefined,
  location: new LatLng(39.828187090462094, -98.57961727559157),
  locationString: 'Charlotte, NC',
};

interface UserLocationPayload {
  location: LatLng;
  city: string;
}

const yikyakUserSlice = createSlice({
  name: 'yikyakUser',
  initialState,
  reducers: {
    setYikYakUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<UserLocationPayload>) => {
      state.location = action.payload.location;
      state.locationString = action.payload.city;
    }
  },
});

export const { setUserLocation, setYikYakUser } = yikyakUserSlice.actions;
export default yikyakUserSlice.reducer;
