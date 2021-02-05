import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "./assets/context";
import './interface/css/general.scss';

import Init from './assets/init';
import Pages from './assets/pages';
import Messages from './components/messages';

export default () => { return (
    <BrowserRouter>
        <Provider>
            <Init />
            <div id={ 'wrapper' } className={ 'active' }>
                <Pages />
            </div>
            <Messages />
        </Provider>
    </BrowserRouter>
)}
