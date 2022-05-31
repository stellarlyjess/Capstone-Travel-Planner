// File with functions shared between 'adding' and 'getting (all entries)' travel entry functionality
import newEntryHtml from '../html/views/newEntry.html';
import { registerRemoveEvent } from './removeEntry.js';
import { getCountdownDays } from './addEntry.js';
import NativeDatepicker from "native-datepicker";
import { format } from 'date-fns';

// initialize the carousel and register change event to add a class to entry-holder 
export function createFlickity() {
    window.flickCarousel = new Flickity('.carousel', {
        initialIndex: 0,
        prevNextButtons: true,
        wrapAround: true,
        pageDots: false,
    });
    window.flickCarousel.on('change', (index) => {
        window.flickCarousel.cells.forEach(({ element }) => element?.firstChild?.classList.remove('selected-cell'));
        window.flickCarousel.selectedElement?.firstChild.classList.add('selected-cell');
    });
}

// function to use a date-picker library which basically wraps the native <input type=date />
// to allow for more extensible styling options of the input
export function initializeDatePickers() {
    const date = format(new Date(), 'yyyy-MM-dd');
    const startTextEl = document.getElementById('entry-start-text');
    const endTextEl = document.getElementById('entry-end-text');
    // Define the date input elements for the two date-picker objects as globally accessible state
    const pickerEnd = new NativeDatepicker({
        initialValue: date,
        existingElement: document.getElementById('entry-end'),
        onChange: (newValue) => {
            endTextEl.innerText = newValue;
            window.endDateValue = newValue;
        }
    });
    const pickerStart = new NativeDatepicker({
        initialValue: date,
        onChange: (newValue) => {
            // Make it such that end date cannot select a date before the start date
            pickerEnd.dateInputElement.setAttribute('min', newValue);
            startTextEl.innerText = newValue;
            window.startDateValue = newValue;
        },
        existingElement: document.getElementById('entry-start')
    });
    // Make it such that start and end date cannot select a date in the past
    pickerStart.dateInputElement.setAttribute('min', date);
    pickerEnd.dateInputElement.setAttribute('min', date);
}

// Flickity requires a dummy cell if there are not entries loaded,
// therefore the dummy cell should be hidden if there are no real entries detected
export function hideCarouselDummyCell() {
    const carouselContainer = document.querySelector('.flickity-slider');
    const carouselCell = document.querySelector('.carousel-cell');
    document.querySelector('.flickity-page-dots').style.display = 'none';
    if (carouselContainer.childElementCount === 1
        && carouselCell && !carouselCell.firstChild?.id) {
        carouselCell.style.display = 'none';
    }
}

// HACK: flickity seems to require atleast one carousel cell to start, so remove the dummy once a real entry comes along
function appendToCarousel(fragment) {
    const carouselContainer = document.querySelector('.flickity-slider');
    const loadingSpinnerContainer = document.querySelector('#spinner-loader-container');
    if (loadingSpinnerContainer.style)
        loadingSpinnerContainer.style.display = 'none'
    // need to unhide carousel here after loading spinner goes  away
    if (carouselContainer.style) {
        carouselContainer.style.display = 'inherit';
    }
    [...carouselContainer.childNodes].forEach((el) => !el.firstChild && window.flickCarousel.remove(el));

    // Add the new entry HTML to an actual DOM element
    const cell = document.createElement('div');
    cell.className = 'carousel-cell';
    cell.appendChild(fragment);
    // insert the new cell into the carousel
    window.flickCarousel.insert([cell], 0);
    window.flickCarousel.select(0, false, true); // select the new carousel entry
}

// Renders a travel entry into the UI
export function renderEntry(lastEntry) {
    // webpack converts imported html into JS strings when imported;
    // create a DOMParser object to parse the string into
    // a Node type https://developer.mozilla.org/en-US/docs/Web/API/Node
    const node = new DOMParser()
        .parseFromString(newEntryHtml, 'text/html').body.firstElementChild;
    // A document fragment is used to append the node to a fake DOM tree
    // to prepare the HTML component before adding it to the real DOM
    const fragment = document.createDocumentFragment();
    fragment.appendChild(node);

    const entryTextSpan = "<span class=\"entry-text\">";
    fragment.querySelector('.entry-img').style.backgroundImage = `url(${lastEntry.imgURL})`;
    fragment.querySelector('.entry-title').innerHTML = `${lastEntry.city}, ${lastEntry.country}`;
    fragment.querySelector('.entry-startDate').innerHTML = `${entryTextSpan}Start Date:</span> ${lastEntry.startDate}`;
    fragment.querySelector('.entry-endDate').innerHTML = `${entryTextSpan}End Date:</span> ${lastEntry.endDate}`;
    fragment.querySelector('.entry-length').innerHTML = `${entryTextSpan}Trip Length:</span> ${lastEntry.tripLength}`;

    // countdown days can change because it uses current date, therefore must be set everytime renderEntry is called
    fragment.querySelector('.entry-countdown').innerHTML = `${entryTextSpan}Days Until Trip:</span> ${getCountdownDays(lastEntry.startDate)}`;
    fragment.querySelector('.weather-high').innerHTML = `${entryTextSpan}High:</span> ${lastEntry.max_temp}°F`;
    fragment.querySelector('.weather-low').innerHTML = `${entryTextSpan}Low:</span> ${lastEntry.min_temp}°F`;
    fragment.querySelector('.weather-desc').innerHTML = `${lastEntry.description}`;
    // Create a unique identifier for each HTML entry holder div to be the creation date of the entry for easy removal from front end
    fragment.querySelector('.entry-info-holder').setAttribute('id', `entry-info-holder-${lastEntry.entryCreationDate}`)
    fragment.querySelector('.entry-info-holder').setAttribute('data-entryid', lastEntry.entryCreationDate)
    const weatherCode = lastEntry.code;
    setWeatherIcon(weatherCode, fragment);

    registerRemoveEvent(fragment.querySelector('.entry-remove'));
    appendToCarousel(fragment);
}

// Mappings between weather codes and HTML element IDs
export const weatherIconMap = {
    'sunny': [800, 801],
    'cloudSky': [802, 900],
    'rainy': [500, 522],
    'sunShower': [300, 302],
    'flurries': [600, 623],
    'thunderStorm': [200, 233],
};

// Switch conditions for changing the background of the API depending on the weather condition from API
export function setWeatherIcon(weatherCode, container) {
    // Clear icons displayed
    Object.keys(weatherIconMap).forEach(element => {
        container.querySelector(`.${element}`).style.display = 'none';
    });

    try {
        // Find the first (and in this case only) element in the array that satisfies the condition:
        // weatherCode falls between one of the ranges of weather codes and gets the associated weather type that holds said range
        const [weatherType] = Object.entries(weatherIconMap).find(([_, [start, end]]) => (
            weatherCode >= start && weatherCode <= end
        ));
        container.querySelector(`.${weatherType}`).style.display = 'initial';
    } catch (e) {
        console.warn(`Error from  setting weather icon: ${e}`);
    }
}
