const SEARCH_ITEMS = 'search/SEARCH_ITEMS';
const CLEAR_SEARCH = 'search/CLEAR_SEARCH';

const initialState = {
    search: ''
}

export default function searchReducer (state = initialState, action) {
    switch (action.type) {
        case SEARCH_ITEMS:
            return {...state, search: action.payload};
        case CLEAR_SEARCH:
            return {...state, search: ''};
        default: return state
    }
};

export const putSearch = (text) => ({
    type: SEARCH_ITEMS,
    payload: text
});

export const deleteSearch = () => ({ type: CLEAR_SEARCH });
