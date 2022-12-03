import { storage } from "./storage.js";
import { toCelcius } from "/helpers.js";
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

// server request from input

let form = document.querySelector(".weather__form");
let cityOut = document.querySelector(".now__city");

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f'; 

let favorites = storage.getFavoriteCities() || [];     //? storage.getFavoriteCities() : [];
renderAddedLocations();


form.onsubmit = (event) => {
	event.preventDefault();
	const input = form.querySelector(".weather__input");
	const cityName = input.value;
	const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

	fetch(url)
		.then(response => response.json())
		.then(result => renderTabNow(result))
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
		
}

function renderTabNow(data) {
	let tempOut = document.querySelector(".now__temperature>span");
	tempOut.textContent = toCelcius(data.main.temp);
	// try taking declaring those element out from function to the global scope.
	let imgOut = document.querySelector(".now__img");
	imgOut.src = `img/${data.weather[0].icon}.png`;

	cityOut.textContent = data.name // ${data.sys.country};
}

/* function toCelcius(inKelvins) {
	return Math.round(inKelvins - 273.15)//.toFixed()
} */

let favoriteBtn = document.querySelector(".favorite");
favoriteBtn.addEventListener("click", addToFavorites);

function addToFavorites() {
	if (favorites.includes(cityOut.textContent)) {
		alert("This location has been added already")
	} else {
	
	favorites.push(cityOut.textContent);
	storage.saveFavoriteCities(favorites);
	renderAddedLocations();
	}
}
let addedLocationsOut = document.querySelector(".weather__cities");

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

function addedBackToNow () {
	const cityName = this.textContent;
	const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

	fetch(url)
		.then(response => response.json())
		.then(result => renderTabNow(result))
		.catch(error => alert(error))
}