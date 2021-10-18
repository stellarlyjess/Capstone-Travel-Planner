/**
 * @jest-environment jsdom
 */

import { validateInputs } from '../src/client/js/addEntry'

// Example of data returned from server API from GET to /all (as object in array) or as response from POST to /addEntry
const mockTravelEntry = {
    entryTitle: 'San Diego, California',
    countdown: '1 day(s)',
    highTemp: '87',
    lowTemp: '56',
    weatherInfo: 'Cloudy with a change of meatballs',
    creationDate: Date.now()
};

describe('Expects functions for addEntry to return based on given data', () => {
    test('Expects function to not return valid based on provided input elements', () => {
        expect(() => validateInputs()).toThrow();

        const fakeInput = document.createElement('input');
        const errField = document.createElement('div');
        errField.setAttribute('id', 'errBox');
        document.body.appendChild(errField);
        expect(() => validateInputs(fakeInput)).not.toThrow();
        expect(validateInputs(fakeInput)).toBeFalsy();
    });
    test('Expects some success from rendering an entry', () => {
        // TODO: fix this
        document.body.innerHTML = `
             <div id="entry-start"></div>
             <div id="entry-end"></div>
             <div id="entry-city"></div>
         `;
        renderEntry(mockTravelEntry);
    });
});
