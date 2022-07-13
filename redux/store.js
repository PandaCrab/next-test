import { configureStore } from '@reduxjs/toolkit';

import stuffReducer from './ducks/stuff';
import userReducer from './ducks/user';
 
export const makeStore = () => configureStore({reducer: {
  order: stuffReducer,
  user: userReducer
}});

const store = makeStore();

export default store;
