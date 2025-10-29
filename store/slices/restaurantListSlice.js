import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	restaurantList: [],
	loading: false,
	error: null,
};

const restaurantListSlice = createSlice({
	name: 'restaurantList',
	initialState,
	reducers: {
		setRestaurantList: (state, action) => {
			state.restaurantList = action.payload;
		},
		clearRestaurantList(state) {
			state.restaurantList = [];
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
	},
});

export const {setRestaurantList, setLoading, setError, clearRestaurantList} = restaurantListSlice.actions;

export default restaurantListSlice.reducer;
