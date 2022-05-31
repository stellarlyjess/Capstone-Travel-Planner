// Entry point file for all javascript

import './styles/main.scss'
import './styles/entry.scss'
import './styles/carousel.scss'
import './styles/spinnerloader.scss'

import {
    renderEntry,
    createFlickity,
    hideCarouselDummyCell,
    initializeDatePickers
} from './js/common.js';
import { registerSubmitEvent } from './js/addEntry.js';
import { getEntries } from './js/getEntries.js';

window.onload = async () => {
    createFlickity(); // initialize carousel
    initializeDatePickers(); // initialize date-picker

    await getEntries();

    // after getting any potential entries, hide dummy if no entries loaded
    hideCarouselDummyCell();

    registerSubmitEvent();
}

