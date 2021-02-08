import React, { Fragment } from 'react';

export default ({ header, value, placeholder, update }) => { return (
    <Fragment>
        <div id={ 'header' }>{ header }</div>
        <div id={ 'container' }>
            <input
                type={ 'text' }
                placeholder={ placeholder }
                value={ value }
                onChange={ event => { update(event.target.value) }}
            />
        </div>
    </Fragment>
)}