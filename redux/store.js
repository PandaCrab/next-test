import { combineReducers, applyMiddleware, configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from '@redux-saga/core';
import thunk from 'redux-thunk';

import stuffReducer, { stuffWatcher, productsStorageWatcher } from './ducks/stuff';
import dataReducer, { dataWatcher } from './ducks/data';
import addressReducer, { 
  addressInputWatcher,
  addressWatcher,
  navigatorAddressWatcher,
  geolocationWatcher,
} from './ducks/address';

const reducer = combineReducers({
  order: stuffReducer,
  data: dataReducer,
  address: addressReducer
});

export const saga = createSagaMiddleware();
 
export const makeStore = () => configureStore({reducer: {
  order: stuffReducer,
  data: dataReducer,
  address: addressReducer
}}, composeWithDevTools(
    applyMiddleware(
      [thunk, saga]
    )
  ));

const store = makeStore();

// saga.run(stuffWatcher);
// saga.run(dataWatcher);
// saga.run(addressWatcher);
// // saga.run(addressInputWatcher);
// saga.run(navigatorAddressWatcher);
// // saga.run(geolocationWatcher);
// saga.run(productsStorageWatcher);

export default store;
