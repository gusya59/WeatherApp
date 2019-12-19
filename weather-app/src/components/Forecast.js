import React, { Fragment, Component } from 'react';
import Button from '@material-ui/core/Button';
import Loader from 'react-loader-spinner'
import config from "../config.json";
import { getLocation, getCityName } from '../services/getLocation'
import getCurrentWeather from '../services/getWeather'
import getLocationPermission from '../services/checkLocationPermisson'

import './Forecast.css'


export default class Forecast extends Component {
    state = {
        weatherInfo: null,
        city: null,
        isRendering: false,
        isLocationEnabled: true
    };

    async componentDidMount() {
        const permissionState = await getLocationPermission(); //check location permissions
        if (permissionState === "access denied") {
            this.setState({ isLocationEnabled: false });
        } else if (permissionState === "access granted") {
            this.setState({ isLocationEnabled: true });
            this.getDataForCurrentLocation();
        } else {
            navigator.geolocation.getCurrentPosition(() => {
                this.setState({ isLocationEnabled: true });
                this.getDataForCurrentLocation();
            });
        }
    }
    getDataForCurrentLocation = async() => {
        this.setState({ isRendering: true });
        const coord = await getLocation(); //current coordinates
        const city = await getCityName(coord.latitude, coord.longitude)
        const { data: weatherData } = await getCurrentWeather(coord.latitude, coord.longitude);
        //gather weather information
        const weatherInfo = {
            temperature: weatherData.main.temp,
            icon: weatherData.weather[0].icon,
            description: weatherData.weather[0].main,
            scale: 'C'
        };
        this.setState({ city, weatherInfo, isRendering: false });
    };

    //switch temperature from celcius to farenhait and vice versa
    getTemp(ch) {
        const {
            weatherInfo
        } = this.state;
        let newTemperature = null;
        if ('C' === ch && 'C' !== weatherInfo.scale) {
            newTemperature = (weatherInfo.temperature - 32) / 1.8;
            weatherInfo.scale = 'C';
        } else if ('F' === ch && 'F' !== weatherInfo.scale) {
            newTemperature = (weatherInfo.temperature * 1.8) + 32;
            weatherInfo.scale = 'F';
        }
        weatherInfo.temperature = newTemperature;
        this.setState({ weatherInfo: weatherInfo });
    }

    render() {
            const {
                weatherInfo,
                city,
                isRendering,
                isLocationEnabled
            } = this.state;

            if (!isLocationEnabled) {
                return ( <
                    div className = "bg-dark" >
                    <
                    div className = "warning" >
                    <
                    h3 className = "u-font-size-s u-nowrap" > Please enable location permission < /h3> < /
                    div > <
                    /div>
                );
            }

            return ( <
                div > {
                    isRendering && ( <
                        div className = "loader" >
                        <
                        Loader type = "Puff"
                        color = "	#F0FFFF"
                        height = { 50 }
                        width = { 50 }
                        timeout = { 3000 } //3 secs
                        /> < /
                        div >
                    )
                } <
                div className = "weather-details" > {
                    weatherInfo ? ( <
                        Fragment >
                        <
                        ul className = "weather-details-wrapper"
                        style = {
                            { listStyleType: "none" }
                        } >
                        <
                        li className = "city u-font-size-l" > { city } < /li> <
                        li className = "weather-temp u-font-size-xxl" > { `${Math.round(weatherInfo.temperature / 10)}` } { `${weatherInfo.scale}` } <
                        /li> <
                        Button className = "btn"
                        color = "primary"
                        variant = "contained"
                        onClick = {
                            () => { this.getTemp('C') }
                        } > { < div className = "btnText" > C < /div>} < /
                            Button > <
                            Button className = "btn"
                            variant = "contained"
                            onClick = {
                                () => { this.getTemp('F') }
                            } > { < div className = "btnText" > F < /div>} < /
                                Button > <
                                li className = "weather-icon" >
                                <
                                img className = "weather-img"
                                src = { `${config.openWeather.img}${weatherInfo.icon}.png` }
                                alt = "wthr img" / >
                                <
                                /li> <
                                li className = "weather-description u-font-size-m" > { `${weatherInfo.description}` } <
                                /li> < /
                                ul > <
                                /Fragment>
                            ): ( <
                                p className = "u-font-size-s" > Fetching weather data... < /p>
                            )
                        } <
                        /div> < /
                        div >
                    );
                }
            }