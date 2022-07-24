import { configureStore } from '@reduxjs/toolkit';

import stuffReducer from './ducks/stuff';
import userReducer from './ducks/user';
import alertReducer from './ducks/alerts';
 
export const makeStore = () => configureStore({reducer: {
  order: stuffReducer,
  user: userReducer,
  alert: alertReducer
}});

const store = makeStore();

export default store;
