import React, { useState, useEffect } from 'react';
import { sleep } from "../../funcs/misc";

export default ({ item }) => {

    // LOCAL STYLE STATE -- DEFAULT TO INACTIVE
    const [local, set_local] = useState('inactive')

    // LOCAL STYLE STATE -- DEFAULT TO INACTIVE
    const [style, set_style] = useState({})

    // ON LOAD...
    useEffect(() => {
        sleep(0.1).then(() => {

            // ACTIVATE
            set_local('active')

            // WAIT 3 SECONDS, THEN DEACTIVATE
            sleep(3).then(() => {
                set_local('inactive')

                // WAIT ANOTHER 10 SECONDS, THEN DELETE
                sleep(10).then(() => {
                    set_style({ display: 'none' })
                })
            })
        })
    }, [])

    return (
        <div id={ 'message' } className={ local } style={ style }>
            <div id={ 'icon' } className={ item.type }>X</div>
            <div id={ 'text' }>{ item.text }</div>
        </div>
    )
}