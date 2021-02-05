import { Base64 as compression } from 'js-base64';
import hashing from 'sha256';

// BASE64 ENCODE STRING
function encode(object) {

    // STRINGIFY THE OBJECT
    const stringified = JSON.stringify(object)

    // COMPRESS & RETURN
    return compression.encode(stringified)
}

// BASE64 DECODE STRING
function decode(string) {

    // ATTEMPT TO DECODE & PARSE AS JSON OBJECT
    try {
        const decoded = compression.decode(string);
        return JSON.parse(decoded);

    // IF IT FAILS, RETURN EMPTY OBJECT
    } catch {
        return {}
    }
}

// SHA256 HASH A OBJECT
function sha_hash(object) {

    // STRINGIFY THE OBJECT
    const stringified = JSON.stringify(object)

    // HASH & RETURN
    return hashing(stringified)
}

function exists(string) {
    if (string === '0x0000000000000000000000000000000000000000') {
        return false;
    }

    return true;
}

export {
    encode,
    decode,
    sha_hash,
    exists
}