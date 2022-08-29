import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageInfo } from '../model/PaginatedEdges';
import { AVAILABLE_FEED_ORDERS, AVAILABLE_FEED_TYPES } from '../utils/constants';

export type FeedType = typeof AVAILABLE_FEED_TYPES[number];
export type FeedOrder = typeof AVAILABLE_FEED_ORDERS[number];

interface FeedState {
  feedType: FeedType;
  feedOrder: FeedOrder;
  currentPage?: PageInfo;
}

const initialState: FeedState = {
  feedType: 'LOCAL',
  feedOrder: 'NEW',
};

const locationSlice = createSlice({
  name: 'homeFeed',
  initialState,
  reducers: {
    setFeedType: (state, action: PayloadAction<FeedType>) => {
      state.feedType = action.payload;
    },
    setFeedOrder: (state, action: PayloadAction<FeedOrder>) => {
      state.feedOrder = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<PageInfo>) => {
      state.currentPage = action.payload;
    }
  },
});

export const { setFeedType, setFeedOrder, setCurrentPage } = locationSlice.actions;
export default locationSlice.reducer;
