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

    // EVENTS
    event anomaly(report);
    event new_key();

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

        // EMIT EVENT
        emit new_key();
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
        string[] memory hashes,
        uint[] memory timestamps
    ) public {

        // IF THE SENDER IS THE OWNER
        require(msg.sender == owner, 'permission denied');

        // ARCHIVE LOG DATA
        logs.push(log_data);

        // LOOP THROUGH HASHED LOGS
        for(uint index = 0; index < hashes.length; index++) {

            // IF THE EVENT HAS OCCURRED BEFORE
            if (events[hashes[index]].exists) {

                // CALCULATE DISTANCE FROM PREVIOUS OCCURRENCE
                uint distance = timestamps[index] - events[hashes[index]].last_occurrence;

                // CALCULATE ERROR MARGIN FOR DISTANCE
                uint margin = distance * error_margin / 10000;

                // IF THE DISTANCE MATRIX ISNT EMPTY
                if (events[hashes[index]].distances.length > 0) {

                    // CALCULATE AVERAGE DISTANCE
                    uint average = avg_distance(hashes[index]);

                    // IF THE DISTANCE IS NOT WITHIN RANGE
                    if (distance + margin >= average && distance - margin <= average) {

                        // CREATE ANOMALY REPORT
                        create_report(hashes[index], timestamps[index], distance, average);
                    }

                // OTHERWISE..
                } else {

                    // CREATE ANOMALY REPORT
                    create_report(hashes[index], timestamps[index], 0, 0);
                }

                // UPDATE THE DISTANCE MATRIX
                events[hashes[index]].distances[events[hashes[index]].next_index] = distance;

                // UPDATE LAST OCCURRENCE
                events[hashes[index]].last_occurrence = timestamps[index];

                // IF THE NEXT INDEX IS LARGER THAN THE DISTANCE QUOTA, ROLL BACK TO ZERO
                if (events[hashes[index]].next_index + 1 > distance_quota) {
                    events[hashes[index]].next_index = 0;

                // OTHERWISE, INCREMENT INDEX NORMALLY
                } else {
                    events[hashes[index]].next_index += 1;
                }

            // OTHERWISE..
            } else {

                // CREATE A TEMP CONTAINER
                uint[] memory foo;
                
                // CREATE ENTRY
                events[hashes[index]] = history({
                    distances: foo,
                    last_occurrence: timestamps[index],
                    next_index: 0,
                    exists: true
                });

                // CREATE ANOMALY REPORT
                create_report(hashes[index], timestamps[index], 0, 0);
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
        string memory hash_id,
        uint timestamp,
        uint distance,
        uint average
    ) private {

        // CREATE ANOMALY REPORT
        report memory rep = report({
            hash_id: hash_id,
            timestamp: timestamp,
            distance: distance,
            average: average
        });

        // PUSH TO REPORT CONTAINER
        reports.push(rep);

        // EMIT ANOMALOUS EVENT
        emit anomaly(rep);
    }
}