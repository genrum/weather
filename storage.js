export const storage = {
    saveFavoriteCities: function(favoriteCities = ["Moscow"]) {
        localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
        console.log("test1 saving favorites");
    },
    getFavoriteCities: function() {
        console.log(localStorage.getItem("favoriteCities"));
        //return JSON.parse(localStorage.getItem("favoriteCities"));
        if (JSON.parse( localStorage.getItem("favoriteCities") ) == null) {
            return []
        } else {
            return JSON.parse(localStorage.getItem("favoriteCities"));
        }
    },
    saveCurrentCity: (currentCity) => {
        localStorage.setItem('currentCity', currentCity);
        console.log("test3 saving current city");
    },
    getCurrentCity: () => {
        console.log("test4 getting current city");
        return localStorage.getItem("currentCity")
    },
    saveWeatheObj: function(data) {
        localStorage.setItem("weatherObj", JSON.stringify(data));
        console.log("objj saved")
    },
    getWeatherObj: () => {
        return JSON.parse( localStorage.getItem("weatherObj"));
    }
};
