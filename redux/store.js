import { configureStore } from '@reduxjs/toolkit';

import stuffReducer from './ducks/stuff';
import userReducer from './ducks/user';
import alertReducer from './ducks/alerts';
import searchReducer from './ducks/alerts';

export const makeStore = () =>
    configureStore({
        reducer: {
            order: stuffReducer,
            user: userReducer,
            alert: alertReducer,
            search: searchReducer,
        },
    });

const store = makeStore();

export default store;
