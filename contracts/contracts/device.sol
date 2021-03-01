pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

contract Device {

    // DEVICE OWNER & IDENTIFIER
    address public owner;
    string public identifier;

    // MARGIN OF ERROR EXPRESSED AS A BASIS POINT -- 185 == 1.85%
    uint public error_margin;

    // AMOUNT OF DISTANCES TO AVERAGE
    uint public distance_quota;
    
    // MAP OF EVENTS
    mapping (string => history) public events;

    // ANOMALY REPORTS
    report[] public reports;

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

    // ANOMALOUS EVENT
    event anomaly(report);

    // WHEN CREATED..
    constructor(
        address _owner,
        string memory _identifier,
        uint _error_margin,
        uint _distance_quota
    ) {
    
        // SET STATIC PARAMS
        owner = _owner;
        identifier = _identifier;

        // SET DISTANCE PARAMS
        error_margin = _error_margin;
        distance_quota = _distance_quota;
    }

    // EVALUATE EVENTS
    function evaluate(event_data[] memory data) public {

        // IF THE SENDER IS THE OWNER
        require(msg.sender == owner, 'permission denied');

        // LOOP THROUGH & PUSH EACH LINE
        for(uint index = 0; index < data.length; index++) {

            // IF THE EVENT HAS OCCURRED BEFORE
            if (events[data[index].hash_id].exists) {

                // CALCULATE DISTANCE FROM PREVIOUS OCCURRENCE
                uint distance = data[index].timestamp - events[data[index].hash_id].last_occurrence;

                // CALCULATE ERROR MARGIN FOR DISTANCE
                uint margin = distance * error_margin / 10000;

                // IF THE DISTANCE MATRIX ISNT EMPTY
                if (events[data[index].hash_id].distances.length > 0) {

                    // CALCULATE AVERAGE DISTANCE
                    uint average = avg_distance(data[index].hash_id);

                    // IF THE DISTANCE IS NOT WITHIN RANGE
                    if (distance + margin >= average && distance - margin <= average) {

                        // CREATE ANOMALY REPORT
                        create_report(data[index], distance, average);
                    }

                // OTHERWISE..
                } else {

                    // CREATE ANOMALY REPORT
                    create_report(data[index], 0, 0);
                }

                // UPDATE THE DISTANCE MATRIX
                events[data[index].hash_id].distances[events[data[index].hash_id].next_index] = distance;

                // UPDATE LAST OCCURRENCE
                events[data[index].hash_id].last_occurrence = data[index].timestamp;

                // IF THE NEXT INDEX IS LARGER THAN THE DISTANCE QUOTA, ROLL BACK TO ZERO
                if (events[data[index].hash_id].next_index + 1 > distance_quota) {
                    events[data[index].hash_id].next_index = 0;

                // OTHERWISE, INCREMENT INDEX NORMALLY
                } else {
                    events[data[index].hash_id].next_index += 1;
                }

            // OTHERWISE..
            } else {

                // CREATE A TEMP CONTAINER
                uint[] memory foo;
                
                // CREATE ENTRY
                events[data[index].hash_id] = history({
                    distances: foo,
                    last_occurrence: data[index].timestamp,
                    next_index: 0,
                    exists: true
                });

                // CREATE ANOMALY REPORT
                create_report(data[index], 0, 0);
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