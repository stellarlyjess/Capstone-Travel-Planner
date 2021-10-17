// import checkUrl from "../src/client/js/urlChecker";

// TODO: refactor this test from project 4
describe('Tests that checkUrl returns expected outputs', () => {
    test('checkUrl should return an invalid url', () => {
        const url = "htrhth://ferwger.com";
        const isValid = checkUrl(url);
        expect(isValid).toBe(false);
    });
    test('checkUrl should return a valid url', () => {
        const url = "https://ferwger.com";
        const isValid = checkUrl(url);
        expect(isValid).toBe(true);
    });
});