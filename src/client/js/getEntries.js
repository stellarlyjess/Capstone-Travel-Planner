// File containing function(s) for adding current travel entries stored in server to client

// TODO: call this when webpage first loads
// (1) Pull API data and then set the background of the app, date, city, temp, description, and feeling UI to match last entry data
/*
    TODO:
    pulls an array of objects from the server in the format:
    {
        entryTitle: val,
        countdown: val,
        highTemp: val,
        lowTemp: val,
        weatherInfo: val
    }
*/
async function getEntries() {
    console.log('Updating UI with travel entries');

    try {
        const res = await fetch('/all');
        const entries = await res.json(); // an array of objects
        console.log(lastEntry);

        for (entry in entries) {
            renderEntry(entry);
        }
    } catch (error) {
        console.log('an error has occured', error);
    }
};

export default Entries;
