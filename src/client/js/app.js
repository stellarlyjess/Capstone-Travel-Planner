// // Create event listener to call generate post function when post button is clicked
document.getElementById('entry=').addEventListener('click', generatePost);

// Function to validate that both input fields are valid
function validateInputs(...inputs) {
    let isInvalid = false;
    const isInvalidInputs = [];
    for (const input of inputs) {
        if (!input.value) {
            isInvalid = true;
            isInvalidInputs.push(input.id);
            continue;
        }
    }
    // Give an error if the inputs are not valid
    const errEl = document.getElementById('errBox');
    if (isInvalid) {
        errEl.innerHTML = `The following input(s) must be filled out:<br>${isInvalidInputs.toString()}`;
    } else {
        errEl.innerHTML = '';
    }

    return !isInvalid;
}

const submitEntry = async (url = '', data = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        if (res.status !== 200) {
            console.error(`Add Entry received error: ${res.status}`);
        }
        // Server will return data to client after the POST finishes
        const newData = await res.json();
    } catch (error) {
        // If something goes wrong send error message
        console.log('An error has occured', error);
    }
    return newData;
};

// Main function: pull api data, then store data in consts to use, then call add entry function to set keys, then update the UI
function addEntry(event) {
    // if (!validateInputs(zipCode, feel)) return; TODO: validate inputs
    event.preventDefault();
    try {
        const d = new Date();
        const newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();
        const entryStart = document.getElementById('entry-start').value;
        const entryEnd = document.getElementById('entry-end').value;
        const entryCity = document.getElementById('entry-city').value;
        const entryResponse = await addEntry('/addEntry', {
            date: newDate,
            startDate: entryStart
            endDate: entryEnd
            city: entryCity,
        });

        const payload = await entryResponse.json();
        updateUI();
    } catch (e) {
        const errEl = document.getElementById('errBox');
        console.error(e);
        errEl.innerHTML = 'POST request to server failed';
    }
};

// Pull API data and then set the background of the app, date, city, temp, description, and feeling UI to match last entry data
const updateUI = async () => {
    console.log('updating ui');

    try {
        const res = await fetch('/all');
        const lastEntry = await res.json();
        console.log(lastEntry);

        // setBackground(lastEntry.main); TODO: refactor for weather icon

        document.getElementById('entry-title').innerHTML = lastEntry.entryTitle;
        document.getElementById('entry-countdown').innerHTML = lastEntry.countdown;
        document.getElementById('weather-high').innerHTML = `${lastEntry.highTemp}°F`;
        document.getElementById('weather-low').innerHTML = `${lastEntry.lowTemp}°F`;
        document.getElementById('weather-specifics').innerHTML = `I am feeling: ${lastEntry.weatherInfo}`;
    } catch (error) {
        console.log('an error has occured', error);
    }
};

// // Map for API conditions to weather icons
const backgroundIconMap = {
    Clear: 'sunny',
    Clouds: 'cloudSky',
    Rain: 'rain',
    Drizzle: 'sunShower',
    Snow: 'flurries',
    Thunderstorm: 'thunderStorm',
    Mist: 'cloudSky',
};

// Switch conditions for changing the background of the API depending on the weather condition from API
function setBackground(weatherMain) {
    let weatherStyle = null;
    const background = document.getElementById('bound');
    background.removeAttribute('class');
    switch (weatherMain) {
        case 'Clear':
            weatherStyle = 'clear';
            break;
        case 'Clouds':
            weatherStyle = 'cloudy';
            break;
        case 'Rain': // Purposeful fallthrough
        case 'Drizzle':
            weatherStyle = 'rainy';
            break;
        default:
            weatherStyle = 'stormy';
            break;
    }

    // Clear icons displayed
    Object.values(backgroundIconMap).forEach(element => {
        document.getElementById(element).style.display = 'none';
    });

    const iconClassName = backgroundIconMap[weatherMain];
    if (iconClassName) {
        document.getElementById(iconClassName).style.display = 'initial';
    }

    background.classList.add(weatherStyle);
}
