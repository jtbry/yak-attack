import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppNotification {
  id?: string;
  type: string;
  message: string;
}

interface NotificationState {
  notifications: AppNotification[];
}

const initialState: NotificationState = {
  notifications: [],
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notify(state, action: PayloadAction<AppNotification>) {
      if (!action.payload.id) {
        action.payload.id = Math.random().toString();
      }
      state.notifications.push(action.payload);
    },
    dismissNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    }
  }
})

export const { notify, dismissNotification } = notificationSlice.actions;
export default notificationSlice.reducer;