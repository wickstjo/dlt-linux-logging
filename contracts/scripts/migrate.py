import os
import json

# RELEVANT PATHS
root = '/home/wickstjo/coding/linux-logging'
middleware = root + '/middleware/resources/'
interfaces = root + '/contracts/build/contracts/'

# READ FILENAMES & REMOVE MIGRATIONS
files = os.listdir(interfaces)
files.remove('Migrations.json')

# LOAD JSON
def load_json(path):
    with open(path) as json_file:
        return json.load(json_file)

# SAVE JSON
def save_json(data, path):
    with open(path, 'w') as outfile:
        json.dump(data, outfile)

# TEMP CONTAINER
latest = {}

# LOOP THROUGH FILES
for file in files:
    
    # CREATE NEW HEADER & EXTRACT JSON CONTENT
    header = file[0:-5].lower()
    content = load_json(interfaces + file)
    
    # NETWORK LIST
    network_list = list(content['networks'].keys())
    
    # IF THE CONTRACT DOES NOT HAVE AN ADDRESS
    if len(network_list) == 0:
        address = 'undefined'
    
    # IF IT DOES, EXTRACT IT
    else:
        address = content['networks'][network_list[0]]['address']
    
    # PUSH TO CONTAINER
    latest[header] = {
        'address': address,
        'abi': content['abi'] 
    }

# RELEVANT REPOS
repos = [middleware]

# DISTRIBUTE THE ABI FILE
for repo in repos:
    save_json(latest, repo + 'latest.json')