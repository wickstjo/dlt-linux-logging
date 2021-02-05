import { useContext, useEffect } from 'react';
import { Context } from './context';
import { init } from '../funcs/blockchain';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // LOAD ONCE
    useEffect(() => {

        // INITIALIZE ETHEREUM APIs & DATA
        init(state).then(data => {

            // SAVE CONNECTION DATA IN STATE
            dispatch({
                type: 'init',
                payload: data
            })
        })

        // HIDE METAMASK GARBAGE
        if (window.ethereum !== undefined) {
            window.ethereum.autoRefreshOnNetworkChange = false;
        }

        // WINDOW SIZE LISTENER
        window.addEventListener('resize', () => {
            dispatch({
                type: 'window',
                payload: {
                    height: window.innerHeight,
                    width: window.innerWidth
                }
            })
        })

        // MOUSE CLICK EVENT LISTENER
        window.addEventListener('click', event => {
            dispatch({
                type: 'click-event',
                payload: event
            })
        })

        // KEY EVENT LISTENER
        window.addEventListener('keydown', event => {
            dispatch({
                type: 'key-event',
                payload: event
            })
        })

    // eslint-disable-next-line
    }, [])

    return null;
}