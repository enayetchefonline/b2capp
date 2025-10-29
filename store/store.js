import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import cuisineListReducer from './slices/cuisineListSlice';
import restaurantDetailReducer from './slices/restaurantDetailSlice';
import restaurantListReducer from './slices/restaurantListSlice';

const store = configureStore({
	reducer: {
		restaurantList: restaurantListReducer,
		restaurantDetail: restaurantDetailReducer,
		cuisineList: cuisineListReducer,
		cart: cartReducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false, // ✅ disables the warning in development
		}),
});

export default store;
