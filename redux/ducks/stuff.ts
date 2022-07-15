const FETCH_STUFF = 'stuff/FETCH_STUFF';
const ADD_TO_ORDER = 'stuff/ADD_TO_ORDER';
const DELETE_FROM_ORDER = 'stuff/DELETE_FROM_ORDER';
const GET_ORDER_ID = 'stuff/GET_ORDER_ID';
const CLEAR_USER_ORDER = 'stuff/CLEAR_USER_ORDER';

interface state { 
    stuff: Object[], 
    clientOrder: Object[],
    orderId: {}
}

const initialState: state = {
    stuff: [],
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
            return { ...state, orderId: action.payload };
        case CLEAR_USER_ORDER:
            return { ...state, clientOrder: [] };
        default: return state
    }
};

export const storeStuff = (stuff) => ({
    type: FETCH_STUFF,
    payload: stuff
});

export const inOrder = (item) => ({
    type: ADD_TO_ORDER,
    payload: item
});

export const clearOrder = () => ({ type: CLEAR_USER_ORDER })

export const getOrderId = id => ({
    type: GET_ORDER_ID,
    payload: id
});

export const deleteFromOrder = item => ({
    type: DELETE_FROM_ORDER,
    payload: item
});
