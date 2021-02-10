import React, { Fragment } from 'react';
import '../interface/css/whisper.scss';

export default ({ header, data }) => {
    switch (data.length) {

        // RENDER NOTHING
        case 0: { return (
            <Fragment>
                <div id={ 'header' }>{ header } (0)</div>
                <div id={ 'container' }>
                    <div id={ 'fallback' }>No messages found.</div>
                </div>
            </Fragment>
        )}

        // RENDER MESSAGES
        default: { return (
            <Fragment>
                <div id={ 'header' }>{ header } ({ data.length })</div>
                <div id={ 'whisper' }>
                    <div id={ 'headers' }>
                        <div id={ 'timestamp' }>Timestamp</div>
                        <div id={ 'module' }>Module</div>
                        <div id={ 'code' }>Code</div>
                        <div id={ 'msg' }>Message</div>
                    </div>
                    <div id={ 'overflow' }>
                        <div id={ 'foobz' }>
                            { data.map((data, index) =>
                                <Row
                                    data={ data }
                                    limit={ 75 }
                                    key={ index }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Fragment>
        )}
    }
}

// LOG ROW
function Row({ data, limit }) { return (
    <div id={ 'message' }>
        <div id={ 'timestamp' }>{ data.timestamp }</div>
        <div id={ 'module' }>{ data.module }</div>
        <div id={ 'code' }>{ data.code }</div>
        <div id={ 'msg' }>{ data.msg.length > limit ? data.msg.substring(0, limit - 3) + '...' : data.msg }</div>
    </div>
)}