// File containing functions associated with adding a new travel entry
import { renderEntry } from './common.js'
import { parse, differenceInDays } from 'date-fns';

// (0) Create event listener to call generate post function when post button is clicked
export function registerSubmitEvent() {
    document.getElementById('entry-submit').addEventListener('click', addEntry);
}

// (1) Main function: pull api data, then store data in consts to use, then call add entry function to set keys, then update the UI
async function addEntry(event) {
    event.preventDefault();
    try {
        const entryCreationDate = new Date();
        const entryCity = document.querySelector('.entry-city');
        const entryCountry = document.querySelector('.entry-country');

        const startDateValue = document.getElementById('entry-start').querySelector('input');
        const endDateValue = document.getElementById('entry-end').querySelector('input');

        if (!validateInputs(startDateValue, endDateValue, entryCity)) return;

        const countdown = getCountdownDays(window.startDateValue);

        // See addEntry function for return val
        const newEntry = await submitEntry('http://localhost:8000/entry', {
            date: entryCreationDate,
            startDate: window.startDateValue,
            endDate: window.endDateValue,
            city: entryCity.value,
            countdown: countdown,
            country: entryCountry.value,
            tripLength: getTripLength(window.startDateValue, window.endDateValue)
        });

        // (4) use renderEntry function to update UI for new entry
        renderEntry(newEntry);

        const userFields = document.querySelectorAll('.userFields');
        for (const userField of userFields) {
            if (userField?.nodeName === 'SELECT') {
                userField.selectedIndex = 0;
            } else {
                userField.value = null;
            }
        }

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
    const date = parse(datefnsFormattedDate, 'yyyy/MM/dd', new Date()); // convert yyyy/MM/dd into javascript Date() format
    const countdown = differenceInDays(date, new Date()); // get difference between days of today and the start date of the travel entry
    return countdown;
}

export function getTripLength(startDate, endDate) {
    const startDatefnsFormatted = startDate.replace(/-/g, '/');
    const startDateForm = parse(startDatefnsFormatted, 'yyyy/MM/dd', new Date());
    const endDatefnsFormatted = endDate.replace(/-/g, '/');
    const endDateForm = parse(endDatefnsFormatted, 'yyyy/MM/dd', new Date());
    const tripLength = differenceInDays(endDateForm, startDateForm);
    return tripLength;
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

    let newData = null;
    try {
        if (res.status !== 200) {
            console.error(`Add Entry received error: ${res.status}`);
        } else {
            newData = await res.json();
        }
    } catch (error) {
        // If something goes wrong send error message
        console.warn('An error has occured', error);
    }
    return newData;
};
