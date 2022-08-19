import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import homeFeedReducer from '../features/homeFeedSlice';
import locationReducer from '../features/locationSlice';
import notificationReducer from '../features/notificationSlice';
import onboardingReducer from '../features/onboardingSlice';
import userAuthReducer from '../features/userAuthSlice';
import yikyakUserReducer from '../features/yikyakUserSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['notifications', 'homeFeed']
}

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  notifications: notificationReducer,
  userAuth: userAuthReducer,
  yikyakUser: yikyakUserReducer,
  location: locationReducer,
  homeFeed: homeFeedReducer
});

export const store = configureStore({
  devTools: true,
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: [thunk]
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
