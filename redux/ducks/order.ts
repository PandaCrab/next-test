import type { ShippingInfo, Stuff } from "../../types/types";

const FILL_SHIPPING_INFO = "order/FILL_SHIPPING_INFO";
const GET_ORDER_ID = 'order/GET_ORDER_ID';
const ADD_TO_ORDER = 'order/ADD_TO_ORDER';
const DELETE_FROM_ORDER = 'order/DELETE_FROM_ORDER';
const DELETE_ONE_ITEM = 'order/DELETE_ONE_ITEM';
const CLEAR_USER_ORDER = 'order/CLEAR_USER_ORDER';

interface State {
    shippingInfo: ShippingInfo | {};
    orderId: string;
    clientOrder: {
        id: string;
        _id: string;
    }[];
}

const initialState: State = {
    shippingInfo: {},
    orderId: '',
    clientOrder: [],
};

const orderReduer = (state=initialState, action) => {
    switch (action.type) {
        case FILL_SHIPPING_INFO: 
            return { ...state, shippingInfo: action.payload };
        case GET_ORDER_ID: 
            return { ...state, orderId: action.payload };
        case ADD_TO_ORDER:
            return { ...state, clientOrder: state.clientOrder.concat(action.payload) };
        case DELETE_FROM_ORDER:
            return { ...state, clientOrder: state.clientOrder.filter(items => items._id !== action.payload) };
        case DELETE_ONE_ITEM:
            return {...state, clientOrder: state.clientOrder.filter(item => item !== action.payload)}
        case CLEAR_USER_ORDER:
            return { ...state, clientOrder: [], shippinginfo: {} };
        default: return state;
    }
};

export const fillShipping = (info) => ({
    type: FILL_SHIPPING_INFO,
    payload: info
});

export const getOrderId = id => ({
    type: GET_ORDER_ID,
    payload: id
});

export const inOrder = (item) => ({
    type: ADD_TO_ORDER,
    payload: item
});

export const clearOrder = () => ({ type: CLEAR_USER_ORDER });

export const deleteItem = item => ({
    type: DELETE_ONE_ITEM,
    payload: item
});

export const deleteFromOrder = item => ({
    type: DELETE_FROM_ORDER,
    payload: item._id
});

export default orderReduer;
