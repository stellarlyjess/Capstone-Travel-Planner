/**
 * @jest-environment jsdom
 */

import { validateInputs } from '../src/client/js/addEntry'
import { getCountdownDays, getTripLength } from '../src/client/js/addEntry'
import { format } from 'date-fns';


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
    test('Expects countdown days to return valid amount of days based on date', () => {
        const defaultDateNow = globalThis.Date.now;
        globalThis.Date.now = () => "2021-10-22T07:29:29.743Z";
        const oct_22_2022 = new Date("2022-10-22T07:29:29.743Z");
        const date = format(oct_22_2022, 'yyyy-MM-dd');

        const countdown = getCountdownDays(date);
        expect(countdown).toEqual(364);
        globalThis.Date.now = defaultDateNow;
    });
    test('Expects trip length to return valid length based on provided dates', () => {
        let tripLength = getTripLength('2021-01-01', '2021-01-02');
        expect(tripLength).toEqual(1);
        tripLength = getTripLength('2021-01-01', '2021-01-01');
        expect(tripLength).toEqual(0);
        tripLength = getTripLength('2021-01-01', '2022-01-01');
        expect(tripLength).toEqual(365);
        tripLength = getTripLength('2021-01-01', '2021-02-01');
        expect(tripLength).toEqual(31);
    });
});
