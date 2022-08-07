import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from 'leaflet';

interface LocationState {
  point: LatLng;
  displayName: string;
}

const initialState: LocationState = {
  point: new LatLng(39.828187090462094, -98.57961727559157),
  displayName: 'Charlotte, NC',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocationPoint: (state, action: PayloadAction<LatLng>) => {
      state.point = action.payload;
    },
    setLocationString: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    }
  },
});

export const { setLocationPoint, setLocationString } = locationSlice.actions;
export default locationSlice.reducer;
