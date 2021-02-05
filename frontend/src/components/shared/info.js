import React, { Fragment } from 'react';

export default ({ data, fallback, header }) => { return (
    <Fragment>
        <div id={ 'header' }>{ header }</div>
        <div id={ 'container' }>
            <Content
                data={ data }
                fallback={ fallback }
            />
        </div>
    </Fragment>
)}

// CONTAINER CONTENT
function Content({ data, fallback }) {
    switch(Object.keys(data).length) {

        // NO CONTENT
        case 0: { return (
            <div id={ 'topic' }>{ fallback }</div>
        )}

        // RENDER CONTENT
        default: {
            return Object.keys(data).map((key, index) =>
                <Row
                    header={ key }
                    content={ data[key] }
                    key={ index }
                />
            )
        }
    }
}

// CONTENT ROW
function Row({ header, content }) { return (
    <div id={ 'topic' }>
        <div className={ 'split' }>
            <div>{ header }</div>
            <div>{ content }</div>
        </div>
    </div>
)}