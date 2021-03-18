pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

contract Device {

    // STATIC PARAMS
    address public owner;
    address public device;
    string public identifier;

    // ASSIGNED PUBLIC ENCRYPTION KEY
    string public encryption_key;

    // ENCRYPTED LOG ARCHIVE
    log_archive[] public logs;

    // AUTH MANAGER REF
    address public auth_manager;

    // LOG ARCHIVE 
    struct log_archive {
        string data;
        string encryption_key;
    }

    // EVENTS
    event key_assigned();

    // WHEN CREATED, SET STATIC PARAMS
    constructor(address _owner, string memory _identifier, address _auth_manager) {
        owner = _owner;
        identifier = _identifier;
        auth_manager = _auth_manager;
    }

    // ARCHIVE LOG BATCH
    function archive(log_archive memory batch) public {

        // IF THE SENDER IS THE DEVICE ITSELF
        require(msg.sender == device, 'permission denied');

        // ARCHIVE LOG BATCH
        logs.push(batch);
    }

    // SET ENCRYPTION KEY
    function set_encryption_key(string memory _encryption_key) public {

        // IF THE SENDER IS THE AUTH MANAGER
        require(msg.sender == auth_manager, 'permission denied');

        // SET PARAM
        encryption_key = _encryption_key;

        // EMIT EVENT
        emit key_assigned();
    }

    // SET DEVICE ADDRESS
    function set_device_account(address _device) public {

        // IF THE SENDER IS THE OWNER
        require(msg.sender == owner, 'permission denied');

        // SET PARAM
        device = _device;
    }
}