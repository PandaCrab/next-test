const SEARCH_ITEMS = 'search/SEARCH_ITEMS';

const initialState = {
    search: ''
}

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_ITEMS:
            return {...state, search: action.payload}
        default: return state
    }
}

export const putSearch = (text) => ({
    type: SEARCH_ITEMS,
    payload: text
});

export default searchReducer;
