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

    // TOAST MESSAGES
    messages: [],

    // REDIRECT PARAMS
    redirect: {
        status: false,
        location: ''
    },

    // INIT STATUS
    initialized: false,

    // BLOCKCHAIN PARAMS
    web3: null,
    contracts: null,
    keys: {
        public: '',
        private: ''
    },

    // WHISPER PARAMS
    shh: null,
    whisper: {
        topic: null,
        symkey: null,
        id: null,
        feed: null,
        messages: []
    },

    // HEX UTILITIES
    utils: {},

    // VERIFY USER REGISTRATION
    verified: false,

    // DEVICE SERVICE QUERY
    query: {
        active: false,
        id: '',
        results: []
    }
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

        // INITIALIZE APIS & DATA
        case 'init': { return {
            ...state,
            ...payload,
            initialized: true
        }}

        // VERIFY USER REGISTRATION
        case 'verify': { return {
            ...state,
            verified: payload
        }}

        // SET WHISPER FEED
        case 'feed': { return {
            ...state,
            whisper: {
                ...state.whisper,
                feed: payload
            }
        }}

        // ADD WHISPER MESSAGE
        case 'whisper-message': { return {
            ...state,
            whisper: {
                ...state.whisper,
                messages: [
                    ...state.whisper.messages,
                    payload
                ]
            }
        }}

        // SET DEVICE SERVICE QUERY
        case 'set-query': { return {
            ...state,
            query: {
                active: true,
                id: payload,
                results: []
            }
        }}

        // ADD QUERY RESPONSE
        case 'query-response': { return {
            ...state,
            query: {
                ...state.query,
                results: [
                    ...state.query.results,
                    payload
                ]
            }
        }}

        // RESET QUERY
        case 'reset-query': { return {
            ...state,
            query: {
                active: false,
                id: '',
                results: []
            }
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