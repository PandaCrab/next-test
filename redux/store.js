import { configureStore } from '@reduxjs/toolkit';

import stuffReducer from './ducks/stuff';
import userReducer from './ducks/user';
import alertReducer from './ducks/alerts';
import searchReducer from './ducks/search';
import orderReducer from './ducks/order';

export const makeStore = () =>
	configureStore({
		reducer: {
			stuff: stuffReducer,
			user: userReducer,
			alert: alertReducer,
			search: searchReducer,
			order: orderReducer,
		},
	});

const store = makeStore();

export default store;
