// Entry point file for all javascript

import './styles/main.scss'
import './styles/entry.scss'
import './styles/carousel.scss'

import { renderEntry, createFlickity } from './js/common.js';
import { format } from 'date-fns';
import { registerSubmitEvent } from './js/addEntry.js';
import { getEntries } from './js/getEntries.js';

const dateEndInput = document.getElementById('entry-end');
const dateStartInput = document.getElementById('entry-start');

window.flickCarousel = createFlickity();

window.onload = async () => {
    // Make it such that start and end date cannot select a date in the past
    const date = format(new Date(), 'yyyy-MM-dd');
    dateStartInput.setAttribute('min', date);
    dateEndInput.setAttribute('min', date);

    await getEntries();
}

// Make it such that end date cannot select a date before the start date
dateStartInput.addEventListener('change', (e) => {
    dateEndInput.setAttribute('min', e.target.value);
});

registerSubmitEvent();

// smoothScroll.init();
