import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { filter_zeros } from '../funcs/format';

export default ({ data, header, fallback, category, trigger }) => {

    // FILTER AWAY NULLIFIED VALUES
    const filtered = filter_zeros(data)

    switch(filtered.length) {

        // NO TASKS FOUND
        case 0: { return (
            <Fragment>
                <div id={ 'header' }>{ header } ({ filtered.length })</div>
                    <div id={ 'container' }>
                    <div id={ 'fallback' }>{ fallback }</div>
                </div>
            </Fragment>
        )}

        // OTHERWISE, LOOP OUT TASKS
        default: { return (
            <Fragment>
                <div id={ 'header' }>{ header } ({ filtered.length })</div>
                <div id={ 'container' }>
                    { filtered.map((value, index) =>
                        <Row
                            value={ value }
                            category={ category }
                            key={ index }
                            callback={ trigger }
                        />
                    )}
                </div>
            </Fragment>
        )}
    }
}

// CONTAINER ROW
function Row({ value, category, callback }) {
    switch(category) {

        // TRIGGER LINK
        case undefined: { return (
            <div id={ 'row' } onClick={() => callback(value) }>{ value[0] }</div>
        )}

        // BASIC LINK
        default: { return (
            <Content
                value={ value }
                category={ category }
            />
        )}
    }
}

// ROW CONTENT
function Content({ value, category }) {
    switch (typeof(value)) {

        // ARRAY
        case 'object': { return (
            <Link to={ category + '/' + value[0] }>
                <div id={ 'row' }>
                    <div className={ 'split' }>
                        <div>{ value[0] }</div>
                        <div>{ value[1] }</div>
                    </div>
                </div>
            </Link>
        )}

        // BASELINE FALLBACK
        default: { return (
            <Link to={ category + '/' + value }>
                <div id={ 'row' }>{ value }</div>
            </Link>
        )}
    }
}

