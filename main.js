import { storage } from "./storage.js";
import { toCelcius, getTimeInLocalTime, getMonthAndDate, createEl, EL  } from "/helpers.js";

// tabs
const weatherButtons = document.querySelector('.weather__buttons');
const weatherButtonAll = Array.from( document.querySelectorAll('.weather__button'));
const weatherTabs = document.querySelector('.weather__tabs')
const weatherTabAll = document.querySelectorAll('.weather__tab')
weatherButtons.addEventListener("click", function (event) {
	const clickButton = event.target
	if (checkClickTabs(clickButton)){
		changeTabs(clickButton)
	}
});

function checkClickTabs(clickButton) {
	const clickButtonParent = clickButton.closest(".weather__button")
	const activeClickElementParent = clickButtonParent.classList.contains("-active")
	return clickButtonParent && !activeClickElementParent
}

function changeTabs(clickButton) {
	const activeButton = weatherButtons.querySelector('.weather__button.-active');
	activeButton.classList.remove("-active")
	clickButton.classList.add("-active")
	const indexClickButton = weatherButtonAll.findIndex(item => item === clickButton)
	const activeTab = weatherTabs.querySelector('.weather__tab.-active');
	activeTab.classList.remove("-active")
	const newActiveTab = weatherTabAll[indexClickButton]
	newActiveTab.classList.add("-active")
}

const serverUrlWeather = 'http://api.openweathermap.org/data/2.5/weather';
const serverUrlForecast = 'http://api.openweathermap.org/data/2.5/weather';

let form = document.querySelector(".weather__form");
let cityOut = document.querySelector(".now__city");
let addedLocationsOut = document.querySelector(".weather__cities");
let favoriteBtn = document.querySelector(".favorite");
let input = form.querySelector(".weather__input");
input.placeholder = storage.getCurrentCity() ? storage.getCurrentCity() : "Aktobe";
favoriteBtn.addEventListener("click", addToFavorites);

let favorites = storage.getFavoriteCities(); // || [];     //? storage.getFavoriteCities() : [];
renderAddedLocations();

if (storage.getCurrentCity()) {
	fetchData( storage.getCurrentCity(), serverUrlWeather );
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const input = form.querySelector(".weather__input");
	storage.saveCurrentCity(input.value);
	if (!input.value) {
		fetchData(input.placeholder, serverUrlWeather);
	}
	fetchData(input.value, serverUrlWeather);
});

console.log( storage.getWeatherObj() ); // temp, to see all properties of response obj

let tempOut = document.querySelector(".now__temperature>span");
let imgOut = document.querySelector(".now__img");

let detailsCityOut = document.querySelector('.details__city');
let detailsTempOut = document.querySelector('.details__temperature');
let detailsFeelsLikeOut = document.querySelector('.details__feels-like');
let detailsWeatherOut = document.querySelector('.details__weather');
let detailsSunriseOut = document.querySelector('.details__sunrise');
let detailsSunsetOut = document.querySelector('.details__sunset');

function renderTabsNowAndDetails(data) {
	tempOut.textContent = toCelcius(data.main.temp)+"˚";
	//tempOut.parentElement.textContent = "˚";
	imgOut.src = `img/${data.weather[0].icon}.png`;
	cityOut.textContent = data.name // ${data.sys.country};
	
	detailsCityOut.textContent = data.name

	detailsTempOut.textContent = toCelcius(data.main.temp)+"˚";
	detailsFeelsLikeOut.textContent = toCelcius(data.main.feels_like)+"˚";
	detailsWeatherOut.textContent = data.weather[0].main;

	detailsSunriseOut.textContent = getTimeInLocalTime(data.sys.sunrise, data.timezone);
	detailsSunsetOut.textContent = getTimeInLocalTime(data.sys.sunset, data.timezone);

	console.log(data);
	storage.saveWeatheObj(data);
}

function addToFavorites() {
	if (favorites.includes(cityOut.textContent)) {
		alert("This location has been added already")
	} else {
	
	favorites.push(cityOut.textContent);
	storage.saveFavoriteCities(favorites);
	renderAddedLocations();
	}
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
		addedLocationsOut.append(listItem);
	})
	console.log(favorites)
}

function removeFavorite() {
	let cityName = this.closest(".weather__city").textContent;
	favorites = favorites.filter(item => item !== cityName);
	storage.saveFavoriteCities(favorites);
	renderAddedLocations()
}

function addedBackToNow() {
	fetchData(this.textContent, serverUrlWeather)
}

function fetchData(cityName, serverUrl = "http://api.openweathermap.org/data/2.5/weather") {
	// const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
	const apiKey = '85b54952e3caff80986f12887070bdda';
	const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

	fetch(url)
		.then(response =>response.json())
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
		});
		storage.saveCurrentCity(cityName);
}

fetch("http://api.openweathermap.org/data/2.5/forecast?q=tukwila&appid=85b54952e3caff80986f12887070bdda")
	.then(response => response.json())
	.then(data => renderForecast(data))

let dataForecast;
let divCards = document.querySelector(".forecast__cards");

let forecastCityOut = document.querySelector(".forecast__city");
/* let forecastDateOut = document.querySelector(".forecast__date");
let forecastTimeOut = document.querySelector(".forecast__time");
let forecastTempOut = document.querySelector(".forecast__temperature");
let forecastCondOut = document.querySelector(".forecast__conditions");
let forecastFeelsOut = document.querySelector(".forecast__feels-like");
let forecastImgOut = document.querySelector(".forecast__pic>img"); */


function renderForecast(data) {
	dataForecast = data;
	const arrForecast = data.list;
	// arrForecast.length = 6;
	
	console.log(data);
	console.log(arrForecast);
	
	forecastCityOut.textContent = data.city.name;

	let cards = document.querySelectorAll(".forecast__card");
	cards.forEach(function(item) {
		item.remove()
	})

	arrForecast.forEach(function(item) {
		let divCard = createEl(EL.DIV, EL.CARD);

		let divDate = createEl(EL.DIV, EL.DATE);
		divDate.textContent = getMonthAndDate(item.dt);

		let divTime = createEl(EL.DIV, EL.TIME);
		divTime.textContent = getTimeInLocalTime(item.dt, data.city.timezone);

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