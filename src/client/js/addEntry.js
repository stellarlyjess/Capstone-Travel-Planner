// File containing functions associated with adding a new travel entry
import { renderEntry } from './common.js'

// Create event listener to call generate post function when post button is clicked
function registerSubmitEvent() {
    document.getElementById('<id_of_button>').addEventListener('click', addEntry);
}

// (1) Main function: pull api data, then store data in consts to use, then call add entry function to set keys, then update the UI
async function addEntry(event) {
    // if (!validateInputs(zipCode, feel)) return; TODO: validate inputs
    event.preventDefault();
    try {
        const d = new Date();
        const newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();
        const entryStart = document.getElementById('entry-start').value;
        const entryEnd = document.getElementById('entry-end').value;
        const entryCity = document.getElementById('entry-city').value;
        const newEntry = await addEntry('/addEntry', { // See addEntry function for return val
            date: newDate,
            startDate: entryStart,
            endDate: entryEnd,
            city: entryCity,
        });

        // TODO: use renderEntry function to update UI for new entry
        // (4) Entries.renderEntry(renderEntry);

    } catch (e) {
        const errEl = document.getElementById('errBox');
        console.error(e);
        errEl.innerHTML = 'POST request to server failed';
    }
};

// (2) Function to validate that input fields are valid for adding an entry
export function validateInputs(...inputs) {
    let isInvalid = false;
    const isInvalidInputs = [];
    for (const input of inputs) {
        if (!input.value) {
            isInvalid = true;
            isInvalidInputs.push(input.id);
            continue;
        }
    }
    // Give an error if the inputs are not valid
    const errEl = document.getElementById('errBox');
    if (isInvalid) {
        errEl.innerHTML = `The following input(s) must be filled out:<br>${isInvalidInputs.toString()}`;
    } else {
        errEl.innerHTML = '';
    }

    return !isInvalid;
}


// (3) Perform actual fetch call to server to store new travel entry
async function submitEntry(url = '', data = {}) {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        if (res.status !== 200) {
            console.error(`Add Entry received error: ${res.status}`);
        }
        // TODO: Server will return data to client after the POST finishes
        // Single object that looks like this:
        /*
            {
                entryTitle: val,
                countdown: val,
                highTemp: val,
                lowTemp: val,
                weatherInfo: val
            }
        */
        const newData = await res.json();
    } catch (error) {
        // If something goes wrong send error message
        console.log('An error has occured', error);
    }
    return newData;
};

