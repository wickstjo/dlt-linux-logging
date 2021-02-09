pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

contract Device {

    // DEVICE OWNER & IDENTIFIER
    address public owner;
    string public identifier;
    
    // SYSLOG
    string[] public log;

    // DATA ADDED EVENT
    event added(string[] data);

    // WHEN CREATED, SET STATIC PARAMS
    constructor(address _owner, string memory _identifier) {
        owner = _owner;
        identifier = _identifier;
    }

    // FETCH SYSLOG DATA
    function fetch() public view returns(string[] memory) {
        return log;
    }

    // PUSH ROWS TO SYSLOG
    function add(string[] memory data) public {

        // IF THE SENDER IS THE OWNER
        require(msg.sender == owner, 'permission denied');

        // LOOP THROUGH & PUSH EACH LINE
        for(uint index = 0; index < data.length; index++) {
            log.push(data[index]);
        }

        // EMIT EVENT WITH NEW DATA
        emit added(data);
    }
}