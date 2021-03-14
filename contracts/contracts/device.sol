pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

contract Device {

    // STATIC PARAMS
    address public owner;
    string public identifier;

    // AUTH MANAGER REF
    address public auth_manager;

    // MARGIN OF ERROR EXPRESSED AS A BASIS POINT -- 185 == 1.85%
    uint public error_margin = 1000;

    // AMOUNT OF DISTANCES TO AVERAGE
    uint public distance_quota = 5;
    
    // MAP OF EVENTS
    mapping (string => history) public events;

    // ANOMALY REPORTS
    report[] public reports;

    // ASSIGNED PUBLIC ENCRYPTION KEY
    string public encryption_key;

    // ENCRYPTED LOG ARCHIVE
    log_archive[] public logs;

    // EVENT HISTORY OBJECT
    struct history {
        uint[] distances;
        uint last_occurrence;
        uint next_index;
        bool exists;
    }

    // EVENT DATA
    struct event_data {
        string hash_id;
        uint timestamp;
    }

    // ANOMALY REPORT
    struct report {
        string hash_id;
        uint timestamp;
        uint distance;
        uint average;
    }

    // LOG ARCHIVE 
    struct log_archive {
        string data;
        string encryption_key;
    }

    // ANOMALOUS EVENT
    event anomaly(report);

    // WHEN CREATED...
    constructor(
        address _owner,
        string memory _identifier,
        address _auth_manager
    ) {

        // SET STATIC PARAMS
        owner = _owner;
        identifier = _identifier;
        auth_manager = _auth_manager;
    }

    // SET DISTANCE QUOTA
    function set_encryption_key(string memory _encryption_key) public {

        // IF THE SENDER IS THE OWNER
        require(msg.sender == auth_manager, 'permission denied');

        // SET PARAM
        encryption_key = _encryption_key;
    }

    // SET DISTANCE QUOTA
    function set_distance_quota(uint _distance_quota) public {

        // IF THE SENDER IS THE OWNER
        require(msg.sender == owner, 'permission denied');

        // SET PARAM
        distance_quota = _distance_quota;
    }

    // SET ERROR MARGIN
    function set_error_margin(uint _error_margin) public {

        // IF THE SENDER IS THE OWNER
        require(msg.sender == owner, 'permission denied');

        // SET PARAM
        error_margin = _error_margin;
    }

    // EVALUATE EVENTS
    function evaluate(
        log_archive memory log_data,
        event_data[] memory hashed_data
    ) public {

        // IF THE SENDER IS THE OWNER
        require(msg.sender == owner, 'permission denied');

        // ARCHIVE LOG DATA
        logs.push(log_data);

        // LOOP THROUGH HASHED LOGS
        for(uint index = 0; index < hashed_data.length; index++) {

            // IF THE EVENT HAS OCCURRED BEFORE
            if (events[hashed_data[index].hash_id].exists) {

                // CALCULATE DISTANCE FROM PREVIOUS OCCURRENCE
                uint distance = hashed_data[index].timestamp - events[hashed_data[index].hash_id].last_occurrence;

                // CALCULATE ERROR MARGIN FOR DISTANCE
                uint margin = distance * error_margin / 10000;

                // IF THE DISTANCE MATRIX ISNT EMPTY
                if (events[hashed_data[index].hash_id].distances.length > 0) {

                    // CALCULATE AVERAGE DISTANCE
                    uint average = avg_distance(hashed_data[index].hash_id);

                    // IF THE DISTANCE IS NOT WITHIN RANGE
                    if (distance + margin >= average && distance - margin <= average) {

                        // CREATE ANOMALY REPORT
                        create_report(hashed_data[index], distance, average);
                    }

                // OTHERWISE..
                } else {

                    // CREATE ANOMALY REPORT
                    create_report(hashed_data[index], 0, 0);
                }

                // UPDATE THE DISTANCE MATRIX
                events[hashed_data[index].hash_id].distances[events[hashed_data[index].hash_id].next_index] = distance;

                // UPDATE LAST OCCURRENCE
                events[hashed_data[index].hash_id].last_occurrence = hashed_data[index].timestamp;

                // IF THE NEXT INDEX IS LARGER THAN THE DISTANCE QUOTA, ROLL BACK TO ZERO
                if (events[hashed_data[index].hash_id].next_index + 1 > distance_quota) {
                    events[hashed_data[index].hash_id].next_index = 0;

                // OTHERWISE, INCREMENT INDEX NORMALLY
                } else {
                    events[hashed_data[index].hash_id].next_index += 1;
                }

            // OTHERWISE..
            } else {

                // CREATE A TEMP CONTAINER
                uint[] memory foo;
                
                // CREATE ENTRY
                events[hashed_data[index].hash_id] = history({
                    distances: foo,
                    last_occurrence: hashed_data[index].timestamp,
                    next_index: 0,
                    exists: true
                });

                // CREATE ANOMALY REPORT
                create_report(hashed_data[index], 0, 0);
            }
        }
    }

    // CALCULATE AVERAGE DISTANCE
    function avg_distance(string memory hash_id) private view returns(uint) {

        // CONTAINER
        uint distance = 0;

        // LOOP THROUGH EACH OCCURRENCE
        for(uint index = 0; index < events[hash_id].distances.length; index++) {
            
            // ADD TO THE CONTAINER
            distance += events[hash_id].distances[index];
        }

        // DIVIDE CONTAINER BY LENGTH
        return distance / events[hash_id].distances.length;
    }

    // CREATE ANOMALY REPORT
    function create_report(
        event_data memory data,
        uint distance,
        uint average
    ) private {

        // CREATE ANOMALY REPORT
        report memory rep = report({
            hash_id: data.hash_id,
            timestamp: data.timestamp,
            distance: distance,
            average: average
        });

        // PUSH TO REPORT CONTAINER
        reports.push(rep);

        // EMIT ANOMALOUS EVENT
        emit anomaly(rep);
    }
}