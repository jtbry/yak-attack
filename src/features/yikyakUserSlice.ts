import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../model/User';

interface YikYakUserState extends User {}

const initialState: YikYakUserState = {
  id: '',
  username: '',
  emoji: '',
  color: '',
  yakarmaScore: 0,
}

const yikyakUserSlice = createSlice({
  name: 'yikyakUser',
  initialState,
  reducers: {
    setYikYakUser: (_state, action: PayloadAction<User>) => {
      return action.payload
    },
  },
});

export const { setYikYakUser } = yikyakUserSlice.actions;
export default yikyakUserSlice.reducer;
