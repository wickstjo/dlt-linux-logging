const values = {

    // WINDOW SIZE
    window: {
        height: window.innerHeight,
        width: window.innerWidth
    },

    // MOUSE & KEY EVENTS
    click_event: null,
    key_event: null,

    // PROMPT WINDOW
    prompt: {
        visible: false,
        params: {},
        type: null
    },

    // INIT STATUS
    initialized: false,

    // TOAST MESSAGES
    messages: [],

    // BLOCKCHAIN PARAMS
    web3: null,
    contracts: null,
    keys: {
        public: '',
        private: ''
    },

    // HEX UTILITIES
    utils: {}
}

// STATE REDUCER
function reducer(state, { type, payload, params }) {
    switch (type) {
        
        // WINDOW RESIZE EVENT
        case 'window': { return {
            ...state,
            window: payload
        }}

        // MOUSE CLICK EVENT
        case 'click-event': { return {
            ...state,
            click_event: payload
        }}

        // KEYBOARD EVENT
        case 'key-event': { return {
            ...state,
            key_event: payload
        }}

        // SHOW SPECIFIC PROMPT
        case 'show-prompt': { return {
            ...state,
            prompt: {
                type: payload,
                params: params,
                visible: true,
            }
        }}

        // HIDE PROMPT
        case 'hide-prompt': { return {
            ...state,
            prompt: {
                ...state.prompt,
                visible: false,
                payload: null
            }
        }}

        // ADD TOAST MESSAGE
        case 'toast-message': { return {
            ...state,
            messages: [
                ...state.messages, {
                    text: payload.msg,
                    type: payload.type
                }
            ]
        }}

        // INITIALIZE APIS & DATA
        case 'init': { return {
            ...state,
            ...payload,
            initialized: true
        }}

        // FALLBACK
        default: {
            console.log('GLOBAL REDUCER TYPE NOT FOUND');
            return state;
        }
    }
}

export {
    values,
    reducer
}