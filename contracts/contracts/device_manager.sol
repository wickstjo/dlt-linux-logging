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

    // DEVICE ADDED EVENT
    event added();

    // FETCH DEVICE CONTRACT
    function fetch_device(string memory identifier) public view returns(Device) {
        return devices[identifier];
    }

    // FETCH ALL DEVICES
    function fetch_devices() public view returns(string[] memory) {
        return listed;
    }

    // ADD DEVICE
    function add(string memory identifier) public {

        // IF THE DEVICE IS NOT REGISTERED
        require(!exists(identifier), 'the device is already registered');

        // CREATE THE DEVICE CONTRACT
        devices[identifier] = new Device(
            msg.sender,
            identifier
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
}