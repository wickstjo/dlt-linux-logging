function reducer(state, { type, payload }) {
    switch (type) {

        // UPDATE INPUT
        case 'specific': { return {
            ...state,
            [payload.name]: payload.data
        }}

        // PARTIALLY OVERWRITE STATES
        case 'partial': { return {
            ...state,
            ...payload
        }}

        // OVERWRITE ENTIRE STATE
        case 'all': { return {
            ...state,
            ...payload
        }}

        // FALLBACK
        default: {
            console.log('LOCAL STATE REDUCER TYPE NOT FOUND');
            return state;
        }
    }
}

export default reducer;