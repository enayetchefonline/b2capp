import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	cuisineList: [],
	loading: false,
	error: null,
};

const cuisineListSlice = createSlice({
	name: 'cuisine',
	initialState,
	reducers: {
		setCuisineList: (state, action) => {
			state.cuisineList = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
	},
});

export const {setCuisineList, setLoading, setError} = cuisineListSlice.actions;
export default cuisineListSlice.reducer;
