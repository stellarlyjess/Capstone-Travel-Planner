const dotenv = require('dotenv');
const path = require('path');
const dateFns = require('date-fns')

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
const port = 8000;
const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

const travelEntries = [];

async function getGeonameData(city) {
    const geoUserName = process.env.GEO_USER;
    const geoBaseURL = "http://api.geonames.org/searchJSON?";
    const geoRes = await fetch(`${geoBaseURL}q=${city}&maxRows=1&username=${geoUserName}`);
    const geoJson = await geoRes.json();
    return geoJson.geonames[0];
}

async function getPixabayImg(city, countryName) {
    const pixaApiKey = process.env.PIXA_API_KEY;
    let imgURL = '';
    const pixaBaseURL = "https://pixabay.com/api/";
    const pixaResCity = await fetch(`${pixaBaseURL}?key=${pixaApiKey}&q=${city}&category=places&orientation=horizontal&image_type=photo`);
    let pixaJson = await pixaRes.json();
    let imgURL = pixaJson.hits[0].webformatURL;
    if (imgURL === '') {
        const pixaResCountry = await fetch(`${pixaBaseURL}?key=${pixaApiKey}&q=${countryName}&category=places&orientation=horizontal&image_type=photo`);
        pixaJson = await pixaRes.json();
        imgURL = pixaJson.hits[0].webformatURL;
    }
    return imgURL;
}

app.post('/entry', async (req, res) => {
    const weatherApiKey = process.env.BIT_API_KEY;
    const city = req.body.city;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    // Setup empty JS object to act as endpoint for all routes
    let travelEntry = {};

    try {

        const { lat, lng, name, countryName, countryCode } = await getGeonameData(city);
        const imgURL = await getPixabayImg(city, countryName);


        dateFns.intervalToDuration({

        });

        const weatherBaseURL = "https://api.weatherbit.io/v2.0";
        if (countdown < 16) {
            const weatherRes = await fetch(`${weatherBaseURL}/forcast/daily&lat=${geonames.lat}&lon=${geonames.lng}&units=I&key=${weatherApiKey}`);
            const weatherJson = await weatherRes.jsDon();
            let { weather, max_temp, min_temp } = weatherJson.data[countdown];
        }
        else {
            /*
                 dateFns.format(new Date(), 'yyyy-dd-MM')
            */
            const weatherRes = await fetch(`${weatherBaseURL}/history/daily&lat=${geonames.lat}&lon=${geonames.lng}&start_date=${startDate}&end_date=${endDate}&units=I&key=${weatherApiKey}`);
            const weatherJson = await weatherRes.json();
            let description = 'Trip is too far away for weather forcast, This is historic weather data for this time of year'
            let { max_temp, min_temp } = weatherJson.data[countdown];
        }
    } catch (error) {
        console.log('an error has occured', error)
    }
});

// Setup GET Route
app.get('/entry', (req, res) => {
    console.log('sending all travel entries.');
    res.send(travelEntries);
});
