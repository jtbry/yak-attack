import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum OnboardingStep {
  Credentials = 'TOKEN',
  Location = 'LOCATION',
  Done = 'DONE',
}

interface OnboardingState {
  step: OnboardingStep;
}

const initialState: OnboardingState = {
  step: OnboardingStep.Credentials,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingStep: (state, action: PayloadAction<OnboardingStep>) => {
      state.step = action.payload;
    },
  },
});

export const { setOnboardingStep } = onboardingSlice.actions;
export default onboardingSlice.reducer;
