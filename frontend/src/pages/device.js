import React, { useContext, useReducer, Fragment, useEffect } from 'react';
import { Context } from '../assets/context';
import reducer from '../states/local';

import { read, event } from '../funcs/blockchain';
import { decode } from '../funcs/process';

import Filter from '../components/filter';
import Chat from '../components/chat';

export default ({ match }) => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useReducer(reducer, {
        original: [],
        filtered: [],
        input: ''
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH THE ADDRESS WITH THE MATCHING HASH
            const address = await read({
                contract: 'device',
                func: 'fetch_device',
                args: [match.params.address]
            }, state)

            // FETCH THE LOG DATA
            const data = await read({
                contract: 'device',
                address: address,
                func: 'fetch'
            }, state)

            // PARSED CONTAINER
            const container = []

            // LOOP THROUGH & DECODE
            data.forEach(block => {
                const decoded = decode(block)
                container.push(decoded)
            })

            // REVERSE THE CONTAINER
            container.reverse()

            // SET IN STATE
            set_local({
                type: 'all',
                payload: {
                    original: container
                }
            })

            return address
        }

        // TEMPORARY FEED
        let feed = null;

        // RUN THE ABOVE
        run().then(address => {

            // SUBSCRIBE TO EVENTS IN THE CONTRACT
            feed = event({
                contract: 'device',
                address: address,
                name: 'added'
            }, state)

            // WHEN EVENT DATA IS INTERCEPTED
            feed.on('data', async() => {

                // FETCH THE ROWS AGAIN
                run()

                // CREATE TOAST MESSAGE
                dispatch({
                    type: 'toast-message',
                    payload: {
                        type: 'good',
                        msg: 'received new data'
                    }
                })
            })
        })

        // UNSUBSCRIBE ON UNMOUNT
        return () => { feed.unsubscribe(); }

    // eslint-disable-next-line
    }, [])

    // WHEN THE DATA CHANGES, FILTER IF NECESSARY
    useEffect(() => {
        filter()

    // eslint-disable-next-line
    }, [local.original])

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

    // FILTER SHOWN DATA
    function filter() {

        // IF SOME   INPUT WAS GIVEN
        if (local.input !== '') {

            // FIND THE SPLITTING INDEX
            const index = local.input.indexOf('=')

            // EXTRACT THE HEADER & QUERY
            const header = local.input.substring(0, index)
            let query = local.input.substring(index + 1, local.input.length)

            // FILTER ROWS
            const filtered_data = local.original.filter(row => row[header] === query)

            // SET IN STATE
            set_local({
                type: 'specific',
                payload: {
                    name: 'filtered',
                    data: filtered_data
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

    // ON KEY EVENT..
    useEffect(() => {
        if (state.key_event !== null && state.key_event.keyCode === 13) {
            filter()
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