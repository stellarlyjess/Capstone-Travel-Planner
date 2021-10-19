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
        const oct_18_2021 = 1634605056805;
        const date = format(oct_18_2021, 'yyyy-MM-dd');

        const countdown = getCountdownDays('2022-10-18');
        expect(countdown).toEqual(364);
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
