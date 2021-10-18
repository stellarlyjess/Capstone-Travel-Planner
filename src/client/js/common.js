// File with functions shared between 'adding' and 'getting (all entries)' travel entry functionality
import newEntryHtml from '../html/views/newEntry.html';

// Renders a travel entry into the UI
export function renderEntry(lastEntry) {
    // webpack converts imported html into JS files as JS strings, so create a DOMParser object to parse the string into
    // a Node type https://developer.mozilla.org/en-US/docs/Web/API/Node
    const node = new DOMParser()
        .parseFromString(newEntryHtml, 'text/html').body.firstElementChild;
    // A document fragment is used to append the node to a fake DOM tree to prepare the HTML component before adding it to the real DOM
    const fragment = document.createDocumentFragment();
    fragment.appendChild(node);

    // setBackground(lastEntry.main); TODO: refactor this to work
    fragment.getElementById('entry-img').style.backgroundImage = `url(${lastEntry.imgURL})`;
    fragment.getElementById('entry-title').innerHTML = `${lastEntry.city}, ${lastEntry.country}`;
    fragment.getElementById('entry-startDate').innerHTML = lastEntry.startDate;
    fragment.getElementById('entry-endDate').innerHTML = lastEntry.endDate;
    fragment.getElementById('entry-length').innerHTML = lastEntry.tripLength;
    fragment.getElementById('entry-countdown').innerHTML = lastEntry.countdown;
    fragment.getElementById('weather-high').innerHTML = `${lastEntry.max_temp}°F`;
    fragment.getElementById('weather-low').innerHTML = `${lastEntry.min_temp}°F`;
    fragment.getElementById('weather-desc').innerHTML = `${lastEntry.description}`;
    // Create a unique identifier for each HTML entry holder div to be the creation date of the entry for easy removal from front end
    fragment.getElementById('entry-info-holder').setAttribute('id', `entry-info-holder-${lastEntry.entryCreationDate}`)

    // Add the new entry HTML to the actual DOM
    document.body.appendChild(fragment);
}

const weatherCode = lastEntry.code

// Map for API conditions to weather icons
const weatherIconMap = {
    Clear: 'sunny',
    Clouds: 'cloudSky',
    Rain: 'rain',
    Drizzle: 'sunShower',
    Snow: 'flurries',
    Thunderstorm: 'thunderStorm',
    Mist: 'cloudSky',
};

// // Switch conditions for changing the background of the API depending on the weather condition from API
function setWeatherIcon(weatherCode) {

    // Clear icons displayed
    Object.values(weatherIconMap).forEach(element => {
        document.getElementById(element).style.display = 'none';
    });

    const iconClassName = weatherIconMap[weatherCode];
    if (iconClassName) {
        document.getElementById(iconClassName).style.display = 'initial';
    }

    // background.classList.add(weatherStyle);
}

