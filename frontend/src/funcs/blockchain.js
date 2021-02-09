import Web3 from 'web3';
import { gateway, keys } from '../resources/settings.json';
import references from '../resources/latest.json';

// PARSE SC & WEB3
async function init() {

    // ESTABLISH WEB3 CONNECTION
    const web3 = new Web3('ws://' + gateway.host + ':' + gateway.port);

    // RETURN WITH REFERENCES
    return {
        web3: web3,
        shh: web3.shh,
        contracts: {
            managers: managers([
                'device',
            ], web3),
            interfaces: interfaces([
                'device',
            ])
        },
        keys: keys,
        utils: {
            to_string: web3.utils.hexToString,
            to_hex: web3.utils.stringToHex
        }
    }
}

// CONSTRUCT SMART CONTRACT REFERENCE
function managers(names, web3) {

    // RESPONSE PLACEHOLDER
    const response = {};

    // LOOP THROUGH & COMBINE EACH ABI & ADDRESS
    names.forEach(name => {
        response[name] = new web3.eth.Contract(
            references[name + 'manager'].abi,
            references[name + 'manager'].address
        )
    })

    return response;
}

// FETCH SINGLE CONTRACT INTERFACE
function interfaces(names) {

    // RESPONSE PLACEHOLDER
    const response = {}

    // LOOP THROUGH & ATTACH ABI
    names.forEach(name => {
        response[name] = references[name].abi
    })

    return response;
}

// SELECT THE APPROPRIATE CONTRACT
function select_contract(contract, address, state) {
    switch (address) {

        // MANAGER CONTRACT
        case undefined: {
            return state.contracts.managers[contract]
        }

        // CHILD CONTRACT
        default: {
            return new state.web3.eth.Contract(
                state.contracts.interfaces[contract],
                address
            )
        }
    }
}

// READ SMART CONTRACT VARIABLE VALUE
function read({ contract, address, func, args=[] }, state) {

    // SELECT THE CORRECT CONTRACT
    const contr = select_contract(contract, address, state)

    // EXECUTE THE QUERY
    return contr.methods[func](...args).call();
}

// WRITE DATA TO THE BLOCKCHAIN
function write({ contract, address, func, args=[], payable }, state) {

    // SELECT THE CORRECT CONTRACT
    const contr = select_contract(contract, address, state)

    // EXECUTE THE TRANSACTION
    return transaction({
        query: contr.methods[func](...args),
        address: contract._address,
        payable: payable
    }, state)
}

// SMART CONTRACT EVENT
function event({ contract, address, name }, state) {

    // SELECT THE CORRECT CONTRACT
    const contr = select_contract(contract, address, state)

    // RETURN THE EVENT FEED
    return contr.events[name]()
}

// SIGN SC TRANSACTION
function transaction({ query, address, payable }, state) {

    // TRANSACTION OUTLINE
    const tx = {
        from: state.keys.public,
        to: address,
        data: query.encodeABI()
    }

    // IF PAYABLE WAS DEFINED, ADD VALUE PROP TO TRANSACTION -- ROUND UP
    if (payable !== undefined) {
        tx.value = Math.ceil(payable);
    }

    // ESTIMATE GAS PRICE
    return query.estimateGas(tx).then(price => {

        // ADD GAS PROPERTY TO TRANSACTION
        tx.gas = price;

        // SIGN IT & EXECUTE
        return state.web3.eth.accounts.signTransaction(tx, state.keys.private).then(signed => {
            return state.web3.eth.sendSignedTransaction(signed.rawTransaction).then(() => {
                return { success: true }

            // IF THE TRANSACTION FAILS
            }).catch(error => {
                return { reason: prune(error) }
            })
        })

    // IF THE GAS ESTIMATION FAILS
    }).catch(error => {
        return {
            reason: prune(error)
        }
    })
}

// PRUNE GARBAGE FROM TRANSACTION ERRORS
function prune(error) {

    // CONVERT TO STRING & NUKE GARBAGE
    error = error.toString();
    error = error.replace('Error: Returned error: execution reverted: ', '');

    return error;
}

export {
    init,
    read,
    write,
    event,
    transaction
}