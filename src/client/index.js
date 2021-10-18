// Entry point file for all javascript

import './styles/main.scss'

import { renderEntry } from './js/common.js';
import { parse, differenceInDays } from 'date-fns';
import { registerSubmitEvent } from './js/addEntry.js';

registerSubmitEvent()

// document.querySelector('.entry-city').addEventListener('change', (e) => console.log(e.target.value))
// document.getElementById('entry-start').addEventListener('change', (e) => {
//     const datefnsFormattedDate = e.target.value.replace(/-/g, '/');
//     const date = parse(datefnsFormattedDate, 'yyyy/MM/dd', new Date());
//     const countdown = differenceInDays(date, new Date());
//     console.log(countdown);
// });
