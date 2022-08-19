const SUCCESS_ALERT = 'alert/SUCCESS_ALERT';
const WARNING_ALERT = 'alert/WARNING_ALERT';
const ERROR_ALERT = 'alert/ERROR_ALERT';
const CLEAR_ALERTS = 'alert/CLEAR_ALERTS';

const initialState = {
    success: '',
    warning: '',
    error: ''
};

const alertReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUCCESS_ALERT:
            return { ...state, success: action.payload };
        case WARNING_ALERT:
            return { ...state, warning: action.payload };
        case ERROR_ALERT: 
            return { ...state, error: action.payload };
        case CLEAR_ALERTS:
            return { success: '', warning: '', error: '' }
        default: return state;
    }
};

export const catchSuccess = (message) => ({
   type: SUCCESS_ALERT,
   payload: message
});

export const catchWarning = (message) => ({
   type: WARNING_ALERT,
   payload: message
});

export const catchError = (message) => ({
   type: ERROR_ALERT,
   payload: message
});

export const clearAlerts = () => ({
    type: CLEAR_ALERTS
})

export default alertReducer;
