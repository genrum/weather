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

	setCookieCity: function(key, value, options = {}) {
		/* options = {
			path: "/",
			secure: true,
		} */
		if (options.expires instanceof Date) {
			options.expires = options.expires.toUTCString();
		}

		let updatedCookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);

		for(let optionKey in options) {
			updatedCookie += "; " + optionKey;
			let optionValue = options[optionKey];
			if (optionValue !== true) {
				updatedCookie += "=" + optionValue;
			}
		}
		document.cookie = updatedCookie;
		console.log(document.cookie);
	},

	getCookieCity: function() {
		let myCookie = document.cookie;
		myCookie = myCookie.split("=");
		if(myCookie[0] === 'city') {
			return decodeURIComponent(myCookie[1]);
		}
		return null
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
