pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

// IMPORT INTERFACE
import { Device } from './device.sol';

contract DeviceManager {

    // DEVICE MAP [ADDRESS => CONTRACT]
    mapping (string => Device) public devices;

    // ITERABLE LIST OF DEVICES
    string[] public listed;

    // INIT STATUS
    bool public initialized = false;

    // AUTH MANAGER REF
    address public auth_manager;

    // DEVICE ADDED EVENT
    event added();

    // FETCH DEVICE CONTRACT
    function fetch_device(string memory identifier) public view returns(Device) {
        return devices[identifier];
    }

    // ADD DEVICE
    function add(string memory identifier) public {

        // IF THE DEVICE IS NOT REGISTERED
        require(!exists(identifier), 'the device is already registered');

        // CREATE THE DEVICE CONTRACT
        devices[identifier] = new Device(
            msg.sender,
            identifier,
            auth_manager
        );

        // LIST THE DEVICE
        listed.push(identifier);

        // EMIT EVENT
        emit added();
    }

    // CHECK IF A DEVICE EXISTS
    function exists(string memory identifier) public view returns(bool) {
        if (address(devices[identifier]) != 0x0000000000000000000000000000000000000000) {
            return true;
        } else {
            return false;
        }
    }

    // INITIALIZE CONTRACT
    function init(address _auth_manager) public {

        // IF THE CONTRACT HAS NOT BEEN INITIALIZED BEFORE
        require(!initialized, 'contract has already been initialized');

        // SET REFERENCE
        auth_manager = _auth_manager;
        initialized = true;
    }
}