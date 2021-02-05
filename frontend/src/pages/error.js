import React, { Fragment } from 'react';

export default () => { return (
    <Fragment>
        <div id={ 'header' }>Error 404</div>
        <div id={ 'container' }>
            <div id={ 'fallback' }>
                This page does not exist!
            </div>
        </div>
    </Fragment>
)}