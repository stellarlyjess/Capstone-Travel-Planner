/**
 * @jest-environment jsdom
 */

import { renderEntry, setWeatherIcon, weatherIconMap } from '../src/client/js/common.js';

// Example of data returned from server API from GET to /all (as object in array) or as response from POST to /addEntry
const mockTravelEntry = {
    imgURL: 'https://cdn.pixabay.com/photo/2019/07/21/19/53/san-diego-skyline-4353504_1280.jpg',
    city: 'San Diego',
    country: 'United States',
    startDate: '2021-12-01',
    endDate: '2021-12-10',
    tripLength: '9',
    max_temp: '56',
    min_temp: '46',
    description: 'Cloudy with a change of meatballs',
    code: 801
};

describe('Expects functions for renderEntry to update UI', () => {
    test('Expects some success from rendering an entry', () => {
        window.flickCarousel = {};
        window.flickCarousel.remove = () => void (0);
        window.flickCarousel.insert = ([cell], ind) => document.body.appendChild(cell);
        window.flickCarousel.select = () => void (0);
        const mule = document.createElement('div');
        mule.innerHTML = '<div class="flickity-slider"><div class="cell-carousel"></div></div>';
        document.body.appendChild(mule);
        renderEntry(mockTravelEntry);
        const entryStart = document.querySelector('.entry-startDate');
        const entryEnd = document.querySelector('.entry-endDate');
        const entryLength = document.querySelector('.entry-length');
        const entryMaxTemp = document.querySelector('.weather-high');
        const entryMinTemp = document.querySelector('.weather-low');
        const entryDesc = document.querySelector('.weather-desc');
        expect(entryStart.innerHTML).toEqual(`<span class=\"entry-text\">Start Date:</span> ${mockTravelEntry.startDate}`);
        expect(entryEnd.innerHTML).toEqual(`<span class=\"entry-text\">End Date:</span> ${mockTravelEntry.endDate}`);
        expect(entryLength.innerHTML).toEqual(`<span class=\"entry-text\">Trip Length:</span> ${mockTravelEntry.tripLength}`);
        expect(entryMaxTemp.innerHTML).toEqual(`<span class=\"entry-text\">High:</span> ${mockTravelEntry.max_temp}°F`);
        expect(entryMinTemp.innerHTML).toEqual(`<span class=\"entry-text\">Low:</span> ${mockTravelEntry.min_temp}°F`);
        expect(entryDesc.innerHTML).toEqual(mockTravelEntry.description);
    });
    test('Expects all weather icons to meet within designated weather type ranges', () => {
        const fragment = document.createDocumentFragment();
        // add weather icon divs with classes to fragment
        [
            '<div style="display:block" class="sunny"></div>',
            '<div style="display:block" class="cloudSky"></div>',
            '<div style="display:block" class="rainy"></div>',
            '<div style="display:block" class="sunShower"></div>',
            '<div style="display:block" class="flurries"></div>',
            '<div style="display:block" class="thunderStorm"></div>'
        ].forEach((htmlStr) => {
            const el = document.createElement('div');
            el.innerHTML = htmlStr.trim();
            fragment.appendChild(el);
        });
        // For each type of weather div,  test a code that falls within their respective ranges
        [
            ['sunny', 800],
            ['cloudSky', 851],
            ['rainy', 511],
            ['sunShower', 301],
            ['flurries', 612],
            ['thunderStorm', 202]
        ].forEach(([expectedType, weatherCode]) => {
            setWeatherIcon(weatherCode, fragment);
            expect(fragment.querySelector(`.${expectedType}`).style.display).toEqual('initial');
            Object.keys(weatherIconMap)
                .filter((w) => w !== expectedType)
                .forEach((e) => expect(fragment.querySelector(`.${e}`).style.display).toEqual('none'));

        });
        const defaultConsoleWarn = globalThis.console.warn;
        globalThis.console.warn = () => void (0);
        setWeatherIcon(10000, fragment);
        Object.keys(weatherIconMap).forEach((e) => expect(fragment.querySelector(`.${e}`).style.display).toEqual('none'));
        globalThis.console.warn = defaultConsoleWarn;
    });
});