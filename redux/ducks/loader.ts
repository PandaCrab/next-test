const SHOW_LOADER = 'loader/SHOW_LOADER';
const HIDE_LOADER = 'loader/HIDELOADER';

interface LoaderState {
    loader: boolean;
};

const initialState: LoaderState = {
    loader: false
};

export default function loaderReduer (state = initialState, action) {
    switch (action.type) {
        case SHOW_LOADER:
            return {...state, loader: true};
        case HIDE_LOADER:
            return { ...state, loader: false };
        default: return state;
    }
};

export const loaderOn = () => ({ type: SHOW_LOADER });

export const loaderOff = () => ({ type: HIDE_LOADER });
