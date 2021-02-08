import React, { useContext, useReducer, Fragment, useEffect } from 'react';
import { Context } from '../assets/context';
import reducer from '../states/local';

//import { read } from '../funcs/blockchain';
import mock from '../resources/mock.json';

import Filter from '../components/filter';
import Chat from '../components/chat';

export default ({ match }) => {

    // GLOBAL STATE
    const { state } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useReducer(reducer, {
        original: [],
        filtered: [],
        input: ''
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH DATA & SET IN STATE
            set_local({
                type: 'all',
                payload: {

                    // LOG ROWS
                    original: mock.data,
                    filtered: mock.data
                }
            })
        }

        // RUN THE ABOVE
        run()

    // eslint-disable-next-line
    }, [])

    // UPDATE INPUT STATE
    function update(value) {
        set_local({
            type: 'specific',
            payload: {
                name: 'input',
                data: value
            }
        })
    }

    // ON KEY EVENT..
    useEffect(() => {
        if (state.key_event !== null && state.key_event.keyCode === 13) {

            // IF AN INPUT WAS GIVEN
            if (local.input !== '') {

                // FIND THE SPLITTING INDEX
                const index = local.input.indexOf('=')

                // EXTRACT THE HEADER & QUERY
                const header = local.input.substring(0, index)
                let query = local.input.substring(index + 1, local.input.length)

                // IF QUERY IS A NUMBER, PARSE IT
                if (!isNaN(query)) {
                    query = Number(query)
                }

                // FILTER ROWS
                const foo = local.original.filter(row => row[header] === query)

                // SET IN STATE
                set_local({
                    type: 'specific',
                    payload: {
                        name: 'filtered',
                        data: foo
                    }
                })

            // OTHERWISE, RESET FILTER
            } else {
                set_local({
                    type: 'specific',
                    payload: {
                        name: 'filtered',
                        data: local.original
                    }
                })
            }
        }

    // eslint-disable-next-line
    }, [state.key_event])

    return (
        <Fragment>
            <Filter
                header={ 'filter content' }
                value={ local.input }
                placeholder={ 'For Example: module=foo' }
                update={ update }
            />
            <Chat
                header={ 'syslog rows' }
                data={ local.filtered }
                fallback={ 'No rows found.' }
            />
        </Fragment>
    )
}