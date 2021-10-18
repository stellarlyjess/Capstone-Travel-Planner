// File containing functions associated with adding a new travel entry
import { renderEntry } from './common.js'

// (0) Create event listener to call generate post function when post button is clicked (need to call this in src/client/index.js)
export function registerSubmitEvent() {
    document.getElementById('entry-save').addEventListener('click', addEntry);
}

// (1) Main function: pull api data, then store data in consts to use, then call add entry function to set keys, then update the UI
async function addEntry(event) {
    // if (!validateInputs(zipCode, feel)) return; TODO: validate inputs
    event.preventDefault();
    try {
        const entryCreationDate = new Date();
        const entryStart = document.getElementById('entry-start').value;
        const entryEnd = document.getElementById('entry-end').value;
        const entryCity = document.querySelector('.entry-city').value;
        const newEntry = await submitEntry('/entry', { // See addEntry function for return val
            date: entryCreationDate,
            startDate: entryStart,
            endDate: entryEnd,
            city: entryCity,
            countdown: getCountdownDays(entryStart)
        });

        // TODO: use renderEntry function to update UI for new entry
        // (4) Entries.renderEntry(newEntry);

        // (5) TODO: clear all inputs after successful fetch POST
        a
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

// function which accepts an date inputValue in the format of yyyy-MM-dd e.g. 2021-01-29
// and gets the number of days until then from the current date.
export function getCountdownDays(inputValue) {
    const datefnsFormattedDate = inputValue.replace(/-/g, '/');
    const date = parse(datefnsFormattedDate, 'yyyy/MM/dd', new Date());
    const countdown = differenceInDays(date, new Date());
    return countdown;
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
