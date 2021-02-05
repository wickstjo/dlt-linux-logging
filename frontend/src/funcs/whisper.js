import { to_date } from './chat';
import { encode } from './process';

// UBSUBCRIBE FROM OLD & SUBSCRIBE TO NEW WHISPER FEED
function create_feed(callback, state, dispatch) {

    // CREATE & RETURN A NEW FEED
    const feed = state.shh.subscribe('messages', {
        symKeyID: state.whisper.symkey,
        topics: [state.utils.to_hex(state.whisper.topic)]

    // ON MESSAGE, RUN CALLBACK FUNCTION
    }).on('data', response => {
        callback(response)
    })

    // SAVE IT IN STATE
    dispatch({
        type: 'feed',
        payload: feed
    })
}

// ENTER KEY LISTENER
function add_message(input, set_input, state, dispatch, event) {

    // PREVENT PAGE RELOAD FROM FORM
    event.preventDefault();

    // IF THE INPUT FIELD ISNT EMPTY
    if (input.trim() !== '') {

        // COMMAND INPUTS
        const keyword = input.trim().split(' ')[0].toLowerCase()
        // const value = input.trim().split(' ')[1]

        // LOCAL CHAT COMMANDS
        const commands = {

            // CLEAR MESSAGE
            '/clear': () => {
                dispatch({
                    type: 'clear'
                })
            }
        }

        // IF KEYWORD IS FOUND
        if (Object.keys(commands).includes(keyword)) {

            // RUN FUNC & RESET INPUT
            commands[keyword]()
            set_input('')

        // OTHERWISE, SEND MESSAGE PAYLOAD
        } else {
            state.shh.post({
                symKeyID: state.whisper.symkey,
                sig: state.whisper.id,
                ttl: 10,
                topic: state.utils.to_hex(state.whisper.topic),
                payload: state.utils.to_hex(input),
                powTime: 3,
                powTarget: 0.5
            
            // EVERYTHING OK, RESET INPUT
            }).then(hash => {
                set_input('')
    
            // OTHERWISE, SHOW ERROR
            }).catch(error => {
                dispatch({
                    type: 'message',
                    payload: {
                        msg: 'Could not send message!',
                        timestamp: to_date(Date.now() / 1000),
                        type: 'error'
                    }
                })
            })
        }
    }
}

// SUBMIT DEVICE SERVICE QUERY
function query(response, state, dispatch) {

    // STRINGIFY & ENCODE THE RESPONSE MESSAGE
    const stringify = JSON.stringify(response);
    const encoded = encode(stringify);

    // SEND THE MESSAGE
    state.shh.post({
        symKeyID: state.whisper.topic.key,
        sig: state.whisper.id,
        ttl: 10,
        topic: state.utils.to_hex(state.whisper.topic),
        payload: state.utils.to_hex(encoded),
        powTime: 3,
        powTarget: 0.5
    
    // EVERYTHING OK...
    }).then(() => {

        // ACTIVATE QUERY
        dispatch({
            type: 'set-query',
            payload: encoded
        })

        // SHOW POSITIVE ALERT
        dispatch({
            type: 'alert',
            payload: {
                type: 'good',
                text: 'A query has been sent submitted'
            }
        })

    // OTHERWISE, SHOW ERROR
    }).catch(() => {
        dispatch({
            type: 'alert',
            payload: {
                type: 'bad',
                text: 'Could not submit query'
            }
        })
    })
}

export {
    create_feed,
    add_message,
    query
}