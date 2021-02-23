pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

// IMPORT INTERFACE
import { DeviceManager } from './device_manager.sol';

contract AuthServer {

    // MAP OF CREATED KEYS
    mapping (string => string[]) public keys;

    // REQUEST BACKLOG
    string[] public backlog;

    // DEVICE MANAGER REFERENCE
    DeviceManager public device_manager;

    // INIT STATUS
    bool public initialized = false;

    // GENERATE NEW KEY EVENT
    event generate_event(string);

    // REQUEST AUTH KEY
    function request_key(
        string memory device,
        string memory encryption_key
    ) public {

        // IF THE CONTRACT HAS BEEN INITIALIZED
        require(initialized, 'contract has not been initialized');

        // IF THE DEVICE IS REGISTERED
        // IF THE SENDER IS THE OWNER
        require(device_manager.exists(device), 'the device is not registered');
        require(device_manager.fetch_device(device).owner() == msg.sender, 'you are not the device owner');

        // PUSH TO BACKLOG
        backlog.push(encryption_key);

        // EMIT ASYNC EVENT
        generate_event(encryption_key);
    }

    // FETCH A SPECIFIC KEY
    function fetch_key(string memory encryption_key) public view returns(string[] memory) {
        return keys[encryption_key];
    }

    // INITIALIZE CONTRACT
    function init(address _device_manager) public {

        // IF THE CONTRACT HAS NOT BEEN INITIALIZED BEFORE
        require(!initialized, 'contract has already been initialized');

        // SET REFERENCE
        device_manager = DeviceManager(_device_manager);
    }
}