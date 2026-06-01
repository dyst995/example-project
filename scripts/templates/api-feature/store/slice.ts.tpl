import { createSlice } from '@reduxjs/toolkit';

import type { {{Feature}} } from '../../domain/models/{{feature}}';
import type { ApiError } from '../../network/core/types';
import { isApiError } from '../../network/utils/normalizeApiError';
import { {{feature}}Api } from './{{feature}}.api';

export type {{Feature}}State = {
  item: {{Feature}} | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: {{Feature}}State = {
  item: null,
  isLoading: false,
  error: null,
};

const {{feature}}Slice = createSlice({
  name: '{{feature}}',
  initialState,
  reducers: {
    clear{{Feature}}Error(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher({{feature}}Api.endpoints.get{{Feature}}.matchPending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher({{feature}}Api.endpoints.get{{Feature}}.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.item = action.payload;
      })
      .addMatcher({{feature}}Api.endpoints.get{{Feature}}.matchRejected, (state, action) => {
        state.isLoading = false;
        state.item = null;
        const payload = action.payload as ApiError | undefined;
        state.error =
          (payload && isApiError(payload) ? payload.message : undefined) ??
          action.error.message ??
          'Request failed';
      });
  },
});

export const { clear{{Feature}}Error } = {{feature}}Slice.actions;
export default {{feature}}Slice.reducer;
