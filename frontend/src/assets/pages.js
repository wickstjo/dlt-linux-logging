import React, { useContext } from 'react';
import { Context } from './context';
import { Route, Switch, Redirect } from 'react-router-dom';
import '../interface/css/innerbody.scss';

import Devices from '../pages/devices';
import Device from '../pages/device';
import Error from '../pages/error';

export default () => {

    // GLOBAL STATE
    const { state } = useContext(Context);

    // IF WHISPER & WEB3 CONNECTIONS HAVE BEEN ESTABLISHED
    if (state.initialized) { return (

        <div id={ 'innerbody' }>
            <Switch>
                <Route exact path="/" component={() => <Redirect to={ '/devices' } /> } />
                <Route exact path={ '/devices' } component={ Devices } />
                <Route path={ '/devices/:address' } component={ Device } />
                <Route component={ Error } />
            </Switch>
        </div>

    // OTHERWISE, RENDER NOTHING
    )} else { return null }
}