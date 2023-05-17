const FETCH_STUFF = 'stuff/FETCH_STUFF';

interface state { 
    stuff: Object[],
}

const initialState: state = {
    stuff: [],
};

export default function stuffReducer (state = initialState, action: { type: string, payload?: Object[] | String[] }) {
    switch ( action.type ) {
        case FETCH_STUFF: 
            return { ...state, stuff: action.payload };
        default: return state
    }
};

export const storeStuff = (stuff) => ({
    type: FETCH_STUFF,
    payload: stuff
});
