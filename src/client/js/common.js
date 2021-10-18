// File with functions shared between 'adding' and 'getting (all entries)' travel entry functionality
import newEntryHtml from '../html/views/newEntry.html';
import { registerRemoveEvent } from './removeEntry.js';
import { getCountdownDays } from './addEntry.js';

// Renders a travel entry into the UI
export function renderEntry(lastEntry) {
    // webpack converts imported html into JS files as JS strings, so create a DOMParser object to parse the string into
    // a Node type https://developer.mozilla.org/en-US/docs/Web/API/Node
    const node = new DOMParser()
        .parseFromString(newEntryHtml, 'text/html').body.firstElementChild;
    // A document fragment is used to append the node to a fake DOM tree to prepare the HTML component before adding it to the real DOM
    const fragment = document.createDocumentFragment();
    fragment.appendChild(node);

    fragment.querySelector('.entry-img').style.backgroundImage = `url(${lastEntry.imgURL})`;
    fragment.querySelector('.entry-title').innerHTML = `${lastEntry.city}, ${lastEntry.country}`;
    fragment.querySelector('.entry-startDate').innerHTML = lastEntry.startDate;
    fragment.querySelector('.entry-endDate').innerHTML = lastEntry.endDate;
    fragment.querySelector('.entry-length').innerHTML = lastEntry.tripLength;
    // countdown days can change because it uses current date, therefore must be set everytime renderEntry is called
    fragment.querySelector('.entry-countdown').innerHTML = getCountdownDays(lastEntry.startDate);
    fragment.querySelector('.weather-high').innerHTML = `${lastEntry.max_temp}°F`;
    fragment.querySelector('.weather-low').innerHTML = `${lastEntry.min_temp}°F`;
    fragment.querySelector('.weather-desc').innerHTML = `${lastEntry.description}`;
    // Create a unique identifier for each HTML entry holder div to be the creation date of the entry for easy removal from front end
    fragment.querySelector('.entry-info-holder').setAttribute('id', `entry-info-holder-${lastEntry.entryCreationDate}`)
    fragment.querySelector('.entry-info-holder').setAttribute('data-entryid', lastEntry.entryCreationDate)
    const weatherCode = lastEntry.code;
    setWeatherIcon(weatherCode, fragment);

    registerRemoveEvent(fragment.querySelector('.entry-remove'));

    // Add the new entry HTML to the actual DOM
    document.body.appendChild(fragment);
}

// Mappings between weather codes and HTML element IDs
const weatherIconMap = {
    'sunny': [800, 801],
    'cloudSky': [802, 900],
    'rainy': [500, 522],
    'sunShower': [300, 302],
    'flurries': [600, 623],
    'thunderStorm': [200, 233],
};

// // Switch conditions for changing the background of the API depending on the weather condition from API
function setWeatherIcon(weatherCode, container) {
    // Clear icons displayed
    Object.keys(weatherIconMap).forEach(element => {
        container.querySelector(`.${element}`).style.display = 'none';
    });

    console.log(`weather code is: ${weatherCode}`)
    // Find the first (and in this only) element in the array that satisfies the condition:
    // between the range of weather codes
    const [weatherType] = Object.entries(weatherIconMap).find(([_, [start, end]]) => (
        weatherCode >= start && weatherCode <= end
    ));
    container.querySelector(`.${weatherType}`).style.display = 'initial';
}
