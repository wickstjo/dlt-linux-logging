pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

contract Device {

    // STATIC PARAMS
    address public owner;
    address public device;
    string public identifier;

    // AUTH MANAGER REF
    address public auth_manager;

    // ASSIGNED PUBLIC ENCRYPTION KEY
    string public encryption_key;

    // ENCRYPTED LOG ARCHIVE
    log_archive[] public logs;

    // LOG ARCHIVE 
    struct log_archive {
        string data;
        string encryption_key;
    }

    // LOG ROTATION INDICIES
    uint public max_index = 5000;
    uint public next_index = 0;

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

        // PUSH BATCH TO THE NEXT INDEX
        logs[next_index] = batch;

        // IF THE MAXIMUM INDEX IS REACHED, SET NEXT INDEX TO ZERO
        if (next_index + 1 > max_index) {
            next_index = 0;

        // OTHERWISE, INCREMENT NORMALLY
        } else { next_index += 1; }
    }

    // FETCH ARCHIVED LOGS
    function fetch_logs() public view returns (log_archive[] memory) {
        return logs;
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