export const storage = {
    saveFavoriteCities: function(favoriteCities) {
        localStorage.setItem("favoriteCities", JSON.stringify([...favoriteCities]));
    },
    getFavoriteCities: function() {
        if (JSON.parse( localStorage.getItem("favoriteCities") ) == null) {
            return []
        } else {
            return JSON.parse( localStorage.getItem("favoriteCities") );
        }
    },
    saveCurrentCity: (currentCity) => {
        localStorage.setItem('currentCity', currentCity);
    },
    getCurrentCity: () => {
        return localStorage.getItem("currentCity")
    },
    saveWeatheObj: function(data) {
        localStorage.setItem("weatherObj", JSON.stringify(data));
    },
    getWeatherObj: () => {
        return JSON.parse( localStorage.getItem("weatherObj"));
    }
};
