const dotenv = require('dotenv');
const path = require('path');
const dateFns = require('date-fns');
const got = require('got');

// inject .env file variables
dotenv.config()

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

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

// Setup Server
const port = 3000;
const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

const travelEntries = {};

async function getGeonameData(city) {
    const geoUserName = process.env.GEO_USER;
    const geoBaseURL = "http://api.geonames.org/searchJSON?";
    const geoRes = await got(`${geoBaseURL}q=${city}&maxRows=1&username=${geoUserName}`);
    const geoJson = JSON.parse(geoRes.body);
    return geoJson.geonames[0];
}

async function getPixabayImg(city, countryName) {
    const pixaApiKey = process.env.PIXA_API_KEY;
    const pixaBaseURL = "https://pixabay.com/api";
    const pixaRes = await got(`${pixaBaseURL}?key=${pixaApiKey}&q=${city}&category=travel`);
    const pixaJson = JSON.parse(pixaRes.body);
    let imgURL = pixaJson.hits[0]?.webformatURL;
    if (!imgURL) {
        const pixaResCountry = await got(`${pixaBaseURL}?key=${pixaApiKey}&q=${countryName}`);
        const pixaCountryJson = JSON.parse(pixaResCountry.body);
        imgURL = pixaCountryJson.hits[0]?.webformatURL;
    }
    return { imgURL: imgURL };
}

async function getWeatherbitData(geonames, countdown) {
    const weatherApiKey = process.env.BIT_API_KEY;
    const weatherBaseURL = "https://api.weatherbit.io/v2.0/forecast/daily";
    const weatherBitData = {
        description: null,
        code: null,
        max_temp: null,
        min_temp: null
    };
    const weatherRes = await got(`${weatherBaseURL}?lat=${geonames.lat}&lon=${geonames.lng}&units=I&key=${weatherApiKey}`);
    const weatherJson = JSON.parse(weatherRes.body);
    if (countdown < 16) {
        const firstDayOfWeather = weatherJson.data[countdown];
        weatherBitData.description = firstDayOfWeather?.weather?.description;
        weatherBitData.code = firstDayOfWeather?.weather?.code;
        weatherBitData.max_temp = firstDayOfWeather?.max_temp;
        weatherBitData.min_temp = firstDayOfWeather?.min_temp;
    } else {
        const todayWeather = weatherJson.data[0];
        weatherBitData.description = "Trip too far away. This is current weather";
        weatherBitData.code = todayWeather?.weather?.code;
        weatherBitData.max_temp = todayWeather?.max_temp;
        weatherBitData.min_temp = todayWeather?.min_temp;
    }
    return weatherBitData;
}

// Setup POST route for creating an entry
app.post('/entry', async (req, res) => {

    // console.log(JSON.stringify(req.body));

    const city = req.body.city;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const country = req.body.country;
    const countdown = req.body.countdown;
    const entryCreationDate = req.body.date;
    const tripLength = req.body.tripLength;
    // Setup empty JS object to act as endpoint for all routes
    let travelEntry = {};

    try {
        const [geonames, imgURL] = await Promise.all([
            await getGeonameData(city),
            await getPixabayImg(city, country)
        ]);
        const weatherBitData = await getWeatherbitData(geonames, countdown)
        travelEntry = {
            countdown,
            country,
            city,
            startDate,
            endDate,
            entryCreationDate,
            tripLength,
            ...weatherBitData,
            ...imgURL
        };

    } catch (error) {
        console.log('an error has occured', error)
    }

    travelEntries[entryCreationDate] = travelEntry;
    res.send(travelEntry);
});

// Setup GET Route to get all entries
app.get('/entry', (req, res) => {
    // console.log('sending all travel entries');
    res.send(Object.entries(travelEntries));
});

// Setup DELETE Route to delete a specific entry
app.delete('/entry/:entryID', (req, res) => {
    // console.log(`deleting travel entry: ${req.params.entryID}`);
    if (travelEntries[req.params.entryID]) {
        delete travelEntries[req.params.entryID];
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
