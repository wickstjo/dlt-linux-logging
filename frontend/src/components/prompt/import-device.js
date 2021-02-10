import React, { useContext, Fragment } from 'react';
import { Context } from '../../assets/context';
import { load_yaml, sleep } from '../../funcs/misc';
import { sha_hash } from '../../funcs/process';
import { write } from '../../funcs/blockchain';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // PARSE A YAML FILE
    async function parse(event) {
        event.persist();

        // IF THE INPUT ISNT EMPTY
        if (event.target.value !== null) {

            // ATTEMPT TO LOAD THE UPLOADED YAML FILE
            const yaml = await load_yaml(event)

            // SHOW LOADING SCREEN
            dispatch({
                type: 'show-prompt',
                payload: 'loading'
            })

            // SLEEP FOR TWO SECOND TO SMOOTHEN TRANSITION
            await sleep(2)
            
            // EVEYRTHING WENT FINE
            if (yaml.success) {

                // HASH THE PARSED YAML FILE (JSON)
                const hash = sha_hash(yaml.data)
                
                // CREATE THE ORACLE
                const result = await write({
                    contract: 'device',
                    func: 'add',
                    args: [hash]
                }, state)

                // EVERYTHING WENT FINE
                if (result.success) {

                    // REDIRECT TO DEVICE PAGE
                    dispatch({
                        type: 'redirect',
                        payload: '/devices/' + hash
                    })

                    // CREATE TOAST MESSAGE
                    dispatch({
                        type: 'toast-message',
                        payload: {
                            type: 'good',
                            msg: 'oracle created'
                        }
                    })

                // OTHERWISE, SHOW ERROR
                } else {
                    dispatch({
                        type: 'toast-message',
                        payload: {
                            type: 'bad',
                            msg: result.reason
                        }
                    })
                }

            // OTHERWISE, SHOW ERROR
            } else {
                dispatch({
                    type: 'toast-message',
                    payload: {
                        type: 'bad',
                        msg: 'the yaml file could not be parsed'
                    }
                })
            }
        }

        // HIDE PROMPT
        dispatch({ type: 'hide-prompt' })
    }
    
    return (
        <Fragment>
            <div id={ 'header' }>register a device</div>
            <div id={ 'container' }>
                <input
                    id={ 'import' }
                    type={ 'file' }
                    onChange={ parse }
                />
                <div id={ 'import-label' }>Select or drop a YAML config</div>
            </div>
        </Fragment>
    )
}