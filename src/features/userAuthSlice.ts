import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserAuthState {
  accessToken: string;
  refreshToken: string;
  userId: string;
  accessExpireTimestamp: Date;
}

const initialState: UserAuthState = {
  accessToken: '',
  refreshToken: '',
  userId: '',
  accessExpireTimestamp: new Date(),
};

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setAccessExpireTimestamp: (state, action: PayloadAction<Date>) => {
      state.accessExpireTimestamp = action.payload;
    }
  }
});

export const { setAccessToken, setRefreshToken, setUserId, setAccessExpireTimestamp } = userAuthSlice.actions;
export default userAuthSlice.reducer;