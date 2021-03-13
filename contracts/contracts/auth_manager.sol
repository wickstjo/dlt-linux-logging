pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

// IMPORT INTERFACE
import { DeviceManager } from './device_manager.sol';
import { Device } from './device.sol';

contract AuthManager {

    // CONTRACT OWNER
    address public owner;

    // KEY ORDER BACKLOG
    Device[] public orders;

    // DEVICE MANAGER REFERENCE
    DeviceManager public device_manager;

    // INIT STATUS
    bool public initialized = false;

    // CONTRACT MODIFICATIO NEVENT
    event modification();

    // REQUEST AUTH KEY
    function request_key(string memory device) public {

        // IF THE CONTRACT HAS BEEN INITIALIZED
        require(initialized, 'contract has not been initialized');

        // IF THE DEVICE IS REGISTERED
        // IF THE SENDER IS THE OWNER
        require(device_manager.exists(device), 'the device is not registered');
        require(device_manager.fetch_device(device).owner() == msg.sender, 'you are not the device owner');

        // PUSH ORDER
        orders.push(
            device_manager.fetch_device(device)
        );

        // EMIT EVENT
        modification();
    }

    // ASSIGN ENCRYPTION KEY TO DEVICE
    function assign_key(string memory key, address device) public {

        // IF THE CONTRACT HAS BEEN INITIALIZED
        // IF THE SENDER IS THE OWNER
        require(initialized, 'contract has not been initialized');
        require(msg.sender == owner, 'you are not the contracts owner');

        // ASSIGN THE ENCRYPTION KEY
        Device(device).set_encryption_key(key);

        // CLEAR THE ORDER
        clear_order(device);

        // EMIT EVENT
        modification();
    }

    // CLEAR FINISHED ORDER
    function clear_order(address device) private {

        // LOOP & ATTEMPT TO FIND THE DEVICE
        for(uint index = 0; index < orders.length; index++) {

            // IF ITS FOUND
            if (orders[index] == Device(device)) {

                // DELETE TARGET
                delete orders[index];

                // EMIT EVENT
                emit modification();
            }
        }
    }

    // INITIALIZE CONTRACT
    function init(address _device_manager, address _owner) public {

        // IF THE CONTRACT HAS NOT BEEN INITIALIZED BEFORE
        require(!initialized, 'contract has already been initialized');

        // SET REFERENCE
        device_manager = DeviceManager(_device_manager);
        owner = _owner;
        initialized = true;
    }
}