import { storage } from "./storage.js";
import { toCelcius, getTimeInLocalTime, getMonthAndDate, createEl, EL  } from "./helpers.js";
import { secondsToMilliseconds, format } from "date-fns";

const serverUrlWeather = 'http://api.openweathermap.org/data/2.5/weather';
// const serverUrlForecast = 'http://api.openweathermap.org/data/2.5/weather';

const ELEMENTS_UI = {
	form: document.querySelector(".weather__form"),
	cityOut: document.querySelector(".now__city"),
	addedLocationsOut: document.querySelector(".weather__cities"),
	favoriteBtn: document.querySelector(".favorite"),
	input: document.querySelector(".weather__input"),

	tempOut: document.querySelector(".now__temperature>span"),
	imgOut: document.querySelector(".now__img"),
	
	detailsCityOut: document.querySelector('.details__city'),
	detailsTempOut: document.querySelector('.details__temperature'),
	detailsFeelsLikeOut: document.querySelector('.details__feels-like'),
	detailsWeatherOut: document.querySelector('.details__weather'),
	detailsSunriseOut: document.querySelector('.details__sunrise'),
	detailsSunsetOut: document.querySelector('.details__sunset'),
	detailsTime: document.querySelector('.details__time'),
}
let divCards = document.querySelector(".forecast__cards");
let forecastCityOut = document.querySelector(".forecast__city");


ELEMENTS_UI.favoriteBtn.addEventListener("click", addToFavorites);

let favorites = new Set(storage.getFavoriteCities()); //storage.getFavoriteCities() ||  || []; //? storage.getFavoriteCities() : [];
renderAddedLocations();

if (storage.getCookieCity()) {
	fetchData( storage.getCookieCity(), serverUrlWeather );
}

ELEMENTS_UI.form.addEventListener("submit", (event) => {
	event.preventDefault();
	fetchData(ELEMENTS_UI.input.value, serverUrlWeather);
});
// put all variables in namespace.

function renderTabsNowAndDetails({main, name, weather, sys, timezone, dt}) {
	ELEMENTS_UI.tempOut.textContent = toCelcius(main.temp)+"˚";
	ELEMENTS_UI.imgOut.src = `img/${weather[0].icon}.png`;
	ELEMENTS_UI.cityOut.textContent = name 
	ELEMENTS_UI.detailsCityOut.textContent = name

	ELEMENTS_UI.detailsTempOut.textContent = toCelcius(main.temp)+"˚";
	ELEMENTS_UI.detailsFeelsLikeOut.textContent = toCelcius(main.feels_like)+"˚";
	ELEMENTS_UI.detailsWeatherOut.textContent = weather[0].main;

	ELEMENTS_UI.detailsSunriseOut.textContent = getTimeInLocalTime(sys.sunrise, timezone);
	ELEMENTS_UI.detailsSunsetOut.textContent = getTimeInLocalTime(sys.sunset, timezone);
	ELEMENTS_UI.detailsTime.textContent = getTimeInLocalTime(dt, timezone);
}

function addToFavorites() {
	favorites.add(ELEMENTS_UI.cityOut.textContent);
	storage.saveFavoriteCities(favorites);
	renderAddedLocations();
}

function renderAddedLocations() {
	let addedLocations = document.querySelectorAll(".weather__city");
	for (let location of addedLocations){
		location.remove();
	}
	favorites.forEach(function(item) {
		let listItem = document.createElement("li") 
		listItem.className = "weather__city";
		listItem.textContent = item;
		listItem.addEventListener("click", addedBackToNow)

		let span = document.createElement("span");
		span.className = "weather__delete-city";
		span.addEventListener("click", removeFavorite)
		listItem.append(span);
		ELEMENTS_UI.addedLocationsOut.append(listItem);
	});
}

function removeFavorite() {
	let cityName = this.closest(".weather__city").textContent;
	favorites.delete(cityName) //= favorites.filter(item => item !== cityName);
	storage.saveFavoriteCities(favorites);
	renderAddedLocations()
}

function addedBackToNow() {
	fetchData(this.textContent, serverUrlWeather)
}

function doFetch(weatherOrFore, cityNam) {
	const serverUrl = `http://api.openweathermap.org/data/2.5/${weatherOrFore}`;
	const apiKey = '85b54952e3caff80986f12887070bdda';
	const url = `${serverUrl}?q=${cityNam}&appid=${apiKey}`;
	return fetch(url);
}

function fetchData(cityName, serverUrl) {
	const apiKey = '85b54952e3caff80986f12887070bdda';
	const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

	fetch(url)
		.then(response => response.json())
		.then(data => renderTabsNowAndDetails(data))
		.catch(function(error) {
			if (error instanceof TypeError) {
				alert("Error in server response or there's no such location")
			} else if (error instanceof ReferenceError) {
				alert(`Error in executing code ${error.message}`);
			} else {
				throw error;
			}
		})
		.catch(error => {
			alert(`Unknown error: ${error}`);
		})
		.then(() => doFetch("forecast", cityName))
		.then(response => response.json())
		.then(data => renderForecast(data))
		.catch(alert);
		storage.setCookieCity("city", cityName, {"max-age": 3600, secure: true});
		//storage.saveCurrentCity(cityName);
}

function renderForecast(data) {
	const arrForecast = data.list;
	forecastCityOut.textContent = data.city.name;

	let cards = document.querySelectorAll(".forecast__card");
	cards.forEach(function(item) {
		item.remove()
	})

	arrForecast.forEach(function(item) {
		let divCard = createEl(EL.DIV, EL.CARD);

		let divDate = createEl(EL.DIV, EL.DATE);
		divDate.textContent = format(secondsToMilliseconds(item.dt), "iii MMM dd");//getMonthAndDate(item.dt);

		let divTime = createEl(EL.DIV, EL.TIME);
		divTime.textContent = getTimeInLocalTime(item.dt, data.city.timezone); //format(item.dt * 1000, "H mm");//

		let divTemp = createEl(EL.DIV, EL.TEMP);
		divTemp.textContent = `Temperature: ${toCelcius(item.main.temp)}˚`;

		let divCond = createEl(EL.DIV, EL.COND);
		divCond.textContent = item.weather[0].description;

		let divFeels = createEl(EL.DIV, EL.FEELS);
		divFeels.textContent = `Feels like: ${toCelcius(item.main.feels_like)}˚`;

		let divImg = createEl(EL.DIV, EL.IMG);
		let img = document.createElement("img");
		img.src = `img/${item.weather[0].icon}.png`;
		img.alt = item.weather[0].description;
		divImg.append(img);

		divCard.append(divDate, divTime, divTemp, divCond, divFeels, divImg);
		divCards.append(divCard)
	})
}