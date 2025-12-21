import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '@/constants';
import { GetDashboardService } from '@/services/dashboard/getDashboardService';

// GET DASHBOARD
export const getDashboard = createAsyncThunk(
  'dashboard/getDashboard',
  async (params, { rejectWithValue }) => {
    try {
      const res = await GetDashboardService.handle(params);
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao buscar dashboard';
      const validationErrors = error.response?.data?.errors || [];
      return rejectWithValue({
        message: errorMessage,
        errors: validationErrors,
      });
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    status: STATUS.IDLE,
    action: null,
    message: null,
    errors: [],
  },
  reducers: {
    clearErrors: state => {
      state.errors = [];
      state.message = null;
    },
    clearStatus: state => {
      state.status = STATUS.IDLE;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getDashboard.pending, state => {
        state.status = STATUS.LOADING;
        state.errors = [];
        state.message = null;
        state.action = 'getDashboard';
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.data = action.payload;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.errors = action.payload?.errors || [];
        state.message = action.payload?.message || 'Erro ao buscar dashboard';
      });
  },
});

export const clearDashboardErrors = dashboardSlice.actions.clearErrors;
export const clearDashboardStatus = dashboardSlice.actions.clearStatus;
export default dashboardSlice.reducer;
