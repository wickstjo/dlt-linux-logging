import axios from 'axios';
import YAML from 'yaml'

// GENERATE NEW WHISPER KEYS
async function generate_keys(shh) {
    return {
        msg: await shh.newSymKey(),
        id: await shh.newKeyPair()
    }
}

// WAIT FOR GIVEN MILLISECONDS
function sleep (seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

// REPLACE BRACKETS IN STRING WITH ARGUMENTS
function replace(string, args) {
    let i = 0
    return string.replace(/{}/g, () => {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    })
}

// ATTEMPT TO LOAD & PARSE YAML FILE
function load_yaml(event) {
    return new Promise((resolve, reject) => {

        // EXTRACT THE FILE & CREATE A READER OBJECT
        const content = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            axios.get(reader.result).then(response => {

                // CLEAR THE INPUT FIELD
                event.target.value = null;

                // IF THE FILE CAN BE PARSED
                try {

                    // PARSE AS YAML
                    const data = YAML.parse(response.data)

                    // RETURN DATA
                    resolve({
                        success: true,
                        data: data
                    })

                // OTHERWISE, RETURN ERROR
                } catch(error) {
                    resolve({
                        success: false
                    })
                }
            })
        }

        // TRIGGER THE READER
        reader.readAsDataURL(content);
    })
}

export {
    generate_keys,
    sleep,
    replace,
    load_yaml
}