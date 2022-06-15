import { takeEvery, call, select } from '@redux-saga/core/effects';

import { fetchPostData } from '../../pages/api/api';
import { data } from '../../types';

const REQUEST_DATA = 'data/REQUEST_DATA';
export const FILL_SHIPPING_DATA = 'data/FILL_SHIPPING_DATA';
export const FILL_BILLING_DATA = 'data/FILL_BILLING_DATA';
export const FILL_PAYMENT_DATA = 'data/FILL_PAYMENT_DATA';

const initialState = {};

export default function dataReducer(state = initialState, action: { type: string, payload: Object }) {
    switch (action.type) {
        case FILL_SHIPPING_DATA:
            return { 
                ...state,
                shipping: action.payload
             };
        case FILL_BILLING_DATA:
            return {
                ...state,
                billing: action.payload
            };
        case FILL_PAYMENT_DATA:
            return {
                ...state,
                payment: action.payload
            };
        default: return state;
    }
};

export const sendData = () => ({
    type: REQUEST_DATA
});

export const fillShippingData = (info: object) => ({
    type: FILL_SHIPPING_DATA,
    payload: info
});

export const fillBillingData = (info: object) => ({
    type: FILL_BILLING_DATA,
    payload: info
});

export const fillPaymentData = (info: object) => ({
    type: FILL_PAYMENT_DATA,
    payload: info
});

const dataSelector = (state: { data?: object }) => state.data

export function* dataWatcher() {
    yield takeEvery(REQUEST_DATA, postData);
};

export function* postData() {
    const data: data = yield select(dataSelector);
    yield call(fetchPostData, data);
};
