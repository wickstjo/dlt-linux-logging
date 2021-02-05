import React, { Fragment } from 'react';
import '../interface/css/whisper.scss';

export default ({ header, data }) => {
    switch (data.length) {

        // RENDER NOTHING
        case 0: { return (
            <Fragment>
                <div id={ 'header' }>{ header } (0)</div>
                <div id={ 'fallback' }>No messages found.</div>
            </Fragment>
        )}

        // RENDER MESSAGES
        default: { return (
            <Fragment>
                <div id={ 'header' }>{ header } ({ data.length })</div>
                <div id={ 'whisper' }>
                    <div id={ 'headers' }>
                            <div id={ 'timestamp' }>Timestamp</div>
                            <div id={ 'name' }>Module</div>
                            <div id={ 'code' }>Code</div>
                            <div id={ 'msg' }>Message</div>
                        </div>
                    { data.map((data, index) =>
                        <div id={ 'message' } key={ index }>
                            <div id={ 'timestamp' }>{ data.timestamp }</div>
                            <div id={ 'name' }>{ data.module.name }</div>
                            <div id={ 'code' }>{ data.module.code }</div>
                            <div id={ 'msg' }>{ data.msg.length > 75 ? data.msg.substring(0, 72) + '...' : data.msg }</div>
                        </div>
                    )}
                </div>
            </Fragment>
        )}
    }
}