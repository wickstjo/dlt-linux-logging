import React, { useContext, useEffect } from 'react';
import { Context } from '../assets/context';
import { Redirect } from 'react-router-dom';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // AFTER REDIRECTING..
    useEffect(() => {

        // RESET THE COMPONENT
        if (state.redirect.status) {
            dispatch({ type: 'reset-redirect' })
        }

    // eslint-disable-next-line
    }, [state.redirect.status])

    // BASED ON THE REDIRECTION STATUS..
    switch (state.redirect.status) {

        // RENDER REDIRECTING COMPONENT
        case true: { return (
            <Redirect to={ state.redirect.location } />
        )}

        // RENDER NOTHING
        default: {
            return null
        }
    }
}