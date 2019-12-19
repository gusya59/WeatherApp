import Axios from "axios";
import config from "../config.json";
require('dotenv').config();

//get weather from OpenWeatherAPI
export default async function getWeatherForCity(lat, lon) {
    return await Axios({
        method: 'GET',
        url: config.openWeather.endpoint + "lat=" + lat + "&lon=" + lon + "&appid=" + process.env.REACT_APP_OPEN_WEATHER_API_KEY
    })
}