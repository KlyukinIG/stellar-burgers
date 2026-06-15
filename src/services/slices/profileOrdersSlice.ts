import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

type TProfileOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
};

const initialState: TProfileOrdersState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
  currentOrderLoading: false
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  async () => await getOrdersApi()
);

export const fetchProfileOrderByNumber = createAsyncThunk(
  'profileOrders/fetchProfileOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrders(state) {
      state.orders = [];
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(fetchProfileOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchProfileOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearProfileOrders } = profileOrdersSlice.actions;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;

export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.loading;

export const selectProfileOrdersError = (state: RootState) =>
  state.profileOrders.error;

export const selectProfileCurrentOrder = (state: RootState) =>
  state.profileOrders.currentOrder;

export const selectProfileCurrentOrderLoading = (state: RootState) =>
  state.profileOrders.currentOrderLoading;

export default profileOrdersSlice.reducer;
