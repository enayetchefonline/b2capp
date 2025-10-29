// store/slices/restaurantDetailSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	data: null,
	payment_options: [],
	loading: false,
	error: null,
};

const restaurantDetailSlice = createSlice({
	name: 'restaurantDetail',
	initialState,
	reducers: {
		setRestaurantDetail(state, action) {
			state.data = action.payload;
		},
		setRestaurantPaymentOptions: (state, action) => {
			state.payment_options = action.payload;
		},
		clearRestaurantDetail(state) {
			state.data = null;
			state.payment_options = []; // ✅ Correct key
			state.loading = false;
			state.error = null;
		},
		setRestaurantDetailLoading(state, action) {
			state.loading = action.payload;
		},
		setRestaurantDetailError(state, action) {
			state.error = action.payload;
		},
	},
});

export const {
	setRestaurantDetail,
	setRestaurantPaymentOptions,
	clearRestaurantDetail,
	setRestaurantDetailLoading,
	setRestaurantDetailError,
} = restaurantDetailSlice.actions;

export default restaurantDetailSlice.reducer;
