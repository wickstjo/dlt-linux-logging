import React, { useContext, useEffect, useReducer, Fragment } from 'react';
import { Context } from '../assets/context';
import { read, event } from '../funcs/blockchain';
import reducer from '../states/local';

import Info from '../components/info';
import List from '../components/list';

export default () => {

    // GLOBAL STATE
    const { state } = useContext(Context)

    // LOCAL STATES
    const [local, set_local] = useReducer(reducer, {
        devices: []
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH DATA & SET IN STATE
            set_local({
                type: 'all',
                payload: {

                    // LIST OF DEVICES
                    initialized: await read({
                        contract: 'task',
                        func: 'initialized'
                    }, state),
                }
            })
        }

        // RUN THE ABOVE
        run()
          
        // SUBSCRIBE TO EVENTS IN THE CONTRACT
        const feed = event({
            contract: 'task',
            name: 'modification'
        }, state)

        // WHEN EVENT DATA IS INTERCEPTED
        feed.on('data', async() => {

            // RE-FETCH DATA
            run()
        })

        // UNSUBSCRIBE ON UNMOUNT
        return () => { feed.unsubscribe(); }

    // eslint-disable-next-line
    }, [])
    
    return (
        <Fragment>
            <Info
                header={ 'device manager' }
                data={{
                    'Contract Address': state.contracts.managers.task._address,
                }}
            />
            <List
                header={ 'registered devices' }
                fallback={ 'No devices found.' }
                data={ local.devices }
                category={ '/devices' }
            />
        </Fragment>
    )
}