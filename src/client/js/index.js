// Entry point file for all javascript

import '../styles/main.scss'

import { renderEntry } from './common';
import { parse, differenceInDays } from 'date-fns';
import { registerSubmitEvent } from './addEntry';

registerSubmitEvent()

/// TODO: remove these - just for testing
// Example of data returned from server API from GET to /all (as object in array) or as response from POST to /addEntry
const mockTravelEntry = {
    entryTitle: 'San Diego, California',
    countdown: '1 day(s)',
    highTemp: '87',
    lowTemp: '56',
    weatherInfo: 'Cloudy with a change of meatballs',
    creationDate: Date.now()
};
renderEntry(mockTravelEntry);
document.querySelector('.entry-city').addEventListener('change', (e) => console.log(e.target.value))
document.getElementById('entry-start').addEventListener('change', (e) => {
    const datefnsFormattedDate = e.target.value.replace(/-/g, '/');
    const date = parse(datefnsFormattedDate, 'yyyy/MM/dd', new Date());
    const countdown = differenceInDays(date, new Date());
    console.log(countdown);
});
