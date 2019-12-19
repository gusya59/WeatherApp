const locationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
//check if the location is enabled for this browser
export default async function getLocationPermission() {
    const { geolocation } = navigator; //access the geolocation property 
    if (!geolocation)
        return "access denied";
    try {
        await getPosition(locationOptions);
        return "access granted";
    } catch (ex) {
        return "access denied";
    }
}


const getPosition = (options) => {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}