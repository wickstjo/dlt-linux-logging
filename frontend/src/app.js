import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "./assets/context";
import './interface/css/general.scss';

import Init from './assets/init';
import Redirect from './components/redirect';
import Pages from './assets/pages';
import Prompt from './components/prompt';
import Messages from './components/messages';

export default () => {

    // WRAPPER STYLE STATE -- DEFAULT TO ACTIVE
    const [local, set_local] = useState('active');
    
    return (
        <BrowserRouter>
            <Provider>
                <Init />
                <Redirect />
                <div id={ 'wrapper' } className={ local }>
                    <Pages />
                </div>
                <Prompt set_wrapper={ set_local } />
                <Messages />
            </Provider>
        </BrowserRouter>
    )
}
