// Entry point file for all javascript

import './styles/main.scss'
import './styles/entry.scss'
import './styles/carousel.scss'

import {
    renderEntry,
    createFlickity,
    hideCarouselDummyCell,
    initializeDatePickers
} from './js/common.js';
import { registerSubmitEvent } from './js/addEntry.js';
import { getEntries } from './js/getEntries.js';
import SmoothScroll from 'smooth-scroll';

// Check that service worker is only being registered in production mode
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', async () => {
        const res = await navigator.serviceWorker.register('/service-worker.js');
        if (res.active.state === 'activated') {
            console.log('service worker activated')
        } else {
            console.log(res.active?.state)
        }
    });
}

window.onload = async () => {
    const scroll = new SmoothScroll('a[href*="#"]'); /// initialize smooth scrolling
    document.getElementById('entry-submit').addEventListener('click', () => {
        scroll.animateScroll(document.getElementById('entry-container'));
    });
    createFlickity(); // initialize carousel
    initializeDatePickers(); // initialize date-picker

    await getEntries();

    // after getting any potential entries, hide dummy if no entries loaded
    hideCarouselDummyCell();

    registerSubmitEvent();
}

