/**
 * @jest-environment jsdom
 */

// import { updateUI } from '../src/client/js/formHandler';

const mockPayload = {
    "model": "general_en",
    "score_tag": "NEU",
    "irony": "NONIRONIC",
    "subjectivity": "SUBJECTIVE",
    "confidence": "86"
}

// TODO: refactor this test from project 4
describe('Expects the UI to update based on given data', () => {
    test('Expects the DOM not to update or for function to fail', () => {
        expect(() => updateUI()).toThrow();

        document.body.innerHTML = `
             <div id="model"></div>
             <div id="score_tag"></div>
             <div id="irony"></div>
             <div id="subjectivity"></div>
             <div id="confidence"></div>
         `;
        expect(() => updateUI(mockPayload)).not.toThrow();
        expect(document.getElementById('model').innerHTML).toEqual(`Model: ${mockPayload.model}`);

    });
});
