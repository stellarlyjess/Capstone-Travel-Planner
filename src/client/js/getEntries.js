// File containing function(s) for adding current travel entries stored in server to client

// Pull API data and render entries when page first loads
import { renderEntry } from './common.js'

export async function getEntries() {
    // console.log('Updating UI with travel entries');

    try {
        const res = await fetch('/entry');
        const entries = await res.json(); // an array of object entries

        for (const [entryID, entry] of entries) {
            renderEntry(entry);
        }
    } catch (error) {
        console.warn('an error has occured', error);
    }
};
