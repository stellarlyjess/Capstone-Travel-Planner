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
        renderEntry(mockTravelEntry);
        const entryStart = document.querySelector('.entry-startDate');
        const entryEnd = document.querySelector('.entry-endDate');
        const entryLength = document.querySelector('.entry-length');
        const entryMaxTemp = document.querySelector('.weather-high');
        const entryMinTemp = document.querySelector('.weather-low');
        const entryDesc = document.querySelector('.weather-desc');
        expect(entryStart.innerHTML).toEqual(mockTravelEntry.startDate);
        expect(entryEnd.innerHTML).toEqual(mockTravelEntry.endDate);
        expect(entryLength.innerHTML).toEqual(mockTravelEntry.tripLength);
        expect(entryMaxTemp.innerHTML).toEqual(`${mockTravelEntry.max_temp}°F`);
        expect(entryMinTemp.innerHTML).toEqual(`${mockTravelEntry.min_temp}°F`);
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
        setWeatherIcon(10000, fragment);
        Object.keys(weatherIconMap).forEach((e) => expect(fragment.querySelector(`.${e}`).style.display).toEqual('none'));
    });
});