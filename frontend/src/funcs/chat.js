import moment from 'moment';

// SHORTEN HASH KEY
function shorten(hash, size) {
    return hash.slice(0, size) + '...' + hash.slice(-size)
}

// CONVERT UNIX TIMESTAMP TO READABLE DATE
function to_date(unix) {
    return moment.unix(unix).format('MM/DD H:mm')
}

export {
    shorten,
    to_date
}