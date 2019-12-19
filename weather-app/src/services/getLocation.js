import Axios from "axios";
import config from "../config.json";
require('dotenv').config();

//get the coordinates for the current location
function getPosition() {
    if (!navigator.geolocation)
        return "Location not Allowed";
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

//get and export current position on a map (country and city)
export async function getLocation() {
    const { coords } = await getPosition();
    const { latitude: lat, longitude: lon } = coords;
    return { latitude: lat, longitude: lon };
}
//get the city from the Google Geolocation API
export async function getCityName(lat, lon) {
    const { data } = await getLocationData(lat, lon);
    const fullAddress = data.plus_code.compound_code;
    let address = fullAddress.split(" "); // get current's user adress
    address = `${address[1]}${address[2]}`;
    return address;
}

//get geolocation data from Google GEO
export async function getLocationData(lat, lon) {
    return await Axios({
        method: 'GET',
        url: config.googleGeo.endpoint + lat + "," + lon + "&key=" + process.env.REACT_APP_GOOGLE_GEO_API_KEY
    })
}