import React, { useContext, useReducer, Fragment, useEffect } from 'react';
import { Context } from '../assets/context';
import reducer from '../states/local';

//import { read } from '../funcs/blockchain';
import mock from '../resources/mock.json';

import Chat from '../components/chat';

export default ({ match }) => {

    // GLOBAL STATE
    const { state } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useReducer(reducer, {
        rows: []
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH DATA & SET IN STATE
            set_local({
                type: 'all',
                payload: {

                    // LOG ROWS
                    rows: mock.data
                }
            })
        }

        // RUN THE ABOVE
        run()

    // eslint-disable-next-line
    }, [])

    return (
        <Fragment>
            <Chat
                header={ 'device manager / device log' }
                data={ local.rows }
                fallback={ 'No rows found.' }
            />
        </Fragment>
    )
}