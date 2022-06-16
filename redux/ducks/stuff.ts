import { put, call,takeEvery } from 'redux-saga/effects';

import { fetchProductsStorage, fetchStuff } from '../../pages/api/api';

export const FETCH_STUFF = 'stuff/FETCH_STUFF';
const REQUEST_STUFF = 'stuff/REQUEST_STUFF';
export const SHOW_LOADER = 'global/SHOW_LOADER';
export const HIDE_LOADER = 'global/HIDE_LOADER';
const REQUEST_PRODUCTS_STORAGE = 'stuff/REQUEST_PRODUCTS_STORAGE';
const FETCH_PRODUCTS_STORAGE = 'stuff/FETCH_PRODUCTS_STORAGE';
const ADD_TO_ORDER = 'stuff/ADD_TO_ORDER';
const DELETE_FROM_ORDER = 'stuff/DELETE_FROM_ORDER';
const GET_ORDER_ID = 'stuff/GET_ORDER_ID';

interface state { 
    stuff: Object[], 
    loading: boolean, 
    productsStorage: Object[], 
    clientOrder: Object[],
    orderId: Object
}

const initialState: state = {
    stuff: [],
    loading: false,
    productsStorage: [],
    clientOrder: [],
    orderId: {}
};

export default function stuffReducer (state = initialState, action: { type: any, payload?: Object[] | String[] | any }) {
    switch ( action.type ) {
        case FETCH_STUFF: 
            return { ...state, stuff: action.payload };
        case ADD_TO_ORDER:
            return { ...state, clientOrder: state.clientOrder.concat(action.payload) };
        case DELETE_FROM_ORDER:
            return { ...state, clientOrder: state.clientOrder.filter(items => items !== action.payload) };
        case GET_ORDER_ID: 
            return {...state, orderId: action.payload};
        case SHOW_LOADER: 
            return {...state, loading: true};
        case HIDE_LOADER: 
            return {...state, loading: false};
        case FETCH_PRODUCTS_STORAGE:
            return { ...state, productsStorage: action.payload };
        default: return state
    }
};

export const getStuff = () => ({
    type: REQUEST_STUFF
});

export const inOrder = (item) => ({
    type: ADD_TO_ORDER,
    payload: item
});

export const getOrderId = id => ({
    type: GET_ORDER_ID,
    payload: id
})

export const deleteFromOrder = item => ({
    type: DELETE_FROM_ORDER,
    payload: item
});

export const getProductsStorage = () => ({
    type: REQUEST_PRODUCTS_STORAGE
});

const showLoader = () => ({
    type: SHOW_LOADER
});

const hideLoader = () => ({
    type: HIDE_LOADER
});

export function* stuffWatcher() {
    yield takeEvery(REQUEST_STUFF, fillStuff);
};

export function* productsStorageWatcher() {
    yield takeEvery(REQUEST_PRODUCTS_STORAGE, fillProductsStorage);
};

function* fillProductsStorage() {
    try {
        const payload: [] = yield call(fetchProductsStorage);
        yield put({type: FETCH_PRODUCTS_STORAGE, payload});
    } catch(error) {
        console.error(error);
    }
};

export function* fillStuff() {
    try {
        yield put(showLoader());
        const payload: [] = yield call(fetchStuff);
        yield put({ type: FETCH_STUFF, payload });
        yield put(hideLoader());
    } catch(error) {
        yield put(showLoader());
    }
};
