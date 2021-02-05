import React, { useContext } from 'react';
import { Context } from "../assets/context";
import Message from './messages/message';
import '../interface/css/messages.scss';

export default () => {

    // GLOBAL STATE
    const { state } = useContext(Context);

    return (
        <div id={ 'messages' }>
            { state.messages.map((item, index) =>
                <Message
                    item={ item }
                    id={ index }
                    key={ index }
                />
            )}
        </div>
    )
}