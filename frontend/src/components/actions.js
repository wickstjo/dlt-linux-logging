import React from 'react';
import '../interface/css/actions.scss';

export default ({ options }) => { return (
    <div id={ 'actions' }>
        { Object.keys(options).map((data, index) =>
            <Action
                header={ data }
                func={ options[data] }
                key={ index }
            />
        )}
    </div>
)}

// ACTION OPTION
function Action({ header, func }) { return (
    <li id={ 'action' } className={ header } onClick={ func }>
        { header }
    </li>
)}