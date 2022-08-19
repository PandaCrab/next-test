const USER_TOKEN = 'user/USER_TOKEN';
const USER_INFO = 'user/USER_INFO';
const USER_LOGOUT = 'user/USER_LOGOUT';

const initialState = {
    token: '',
    info: null
};

export default function userReducer (state = initialState, action) {
    switch (action.type) {
        case  USER_TOKEN:
            return { ...state, token: action.payload };
        case USER_INFO:
            return { ...state, info: action.payload };
        case USER_LOGOUT:
            return { token: '', info: {} }
        default: return state
    }
};

export const getToken = (token) => ({
    type: USER_TOKEN,
    payload: token
});

export const getInfo = (info) => ({
    type: USER_INFO,
    payload: info
});

export const logout = () => ({ type: USER_LOGOUT })
