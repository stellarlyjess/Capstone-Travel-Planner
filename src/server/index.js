// Store base Api url and api key
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=220ce18603990fadb07de146cfeee1a6&units=imperial';

// Setup empty JS object to act as endpoint for all routes
let travelEntries = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8000;
const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

const getWeatherApi = async (baseURL, apiKey) => {
    const res = await fetch(`${baseURL}?apiKey=${apiKey}`);
    try {
        const apiData = await res.json();
        console.log(apiData);
        return apiData;
    } catch (error) {
        console.log('an error has occured', error);
    }
}

// Setup GET Route
app.get('/all', (req, res) => {
    console.log('sending all travel entries.');
    res.send(travelEntries);
});

// POST a journal entry
app.post('/addEntry', async (req, res) => {


    // TODO: fetch api data for new travel entry
    const weatherRes = await getWeatherApi();
    const apiData = await weatherRes.json();
    const tmp = apiData.main.temp;
    const name = apiData.name;
    const weatherMain = apiData.weather[0].main;
    const weatherDesc = apiData.weather[0].description;

    travelEntries[`${Date.now()}`] = req.body;
    res.send('A post was made'); // TODO: return fetched apis infos to client after storing new entry in server
});