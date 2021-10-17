// Entry point file for all javascript

import './styles/main.scss'


import { renderEntry } from './js/common';

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
