const values = {

    // WINDOW SIZE
    window: {
        height: window.innerHeight,
        width: window.innerWidth
    },

    // MOUSE & KEY EVENTS
    click_event: null,
    key_event: null,

    // REDIRECT PARAMS
    redirect: {
        status: false,
        location: ''
    },

    // PROMPT WINDOW
    prompt: {
        visible: false,
        params: {},
        type: null
    },

    // TOAST MESSAGES
    messages: [],

    // INIT STATUS
    initialized: false,

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

        // REDIRECT TO PAGE
        case 'redirect': { return {
            ...state,
            redirect: {
                status: true,
                location: payload
            }
        }}

        // RESET REDIRECT LOGIC
        case 'reset-redirect': { return {
            ...state,
            redirect: {
                status: false,
                location: ''
            }
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