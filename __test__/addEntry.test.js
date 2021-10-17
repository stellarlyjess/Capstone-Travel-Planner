/**
 * @jest-environment jsdom
 */

import { validateInputs } from '../src/client/js/addEntry'

// TODO: refactor this test from project 4
const mockPayload = {
    "model": "general_en",
    "score_tag": "NEU",
    "irony": "NONIRONIC",
    "subjectivity": "SUBJECTIVE",
    "confidence": "86"
}

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
    test('Expects adding an entry to fail since fetch isnt defined', () => {
        document.body.innerHTML = `
             <div id="entry-start"></div>
             <div id="entry-end"></div>
             <div id="entry-city"></div>
         `;
    });
});
