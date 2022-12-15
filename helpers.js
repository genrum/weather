export function toCelcius(inKelvins) {
	return Math.round(inKelvins - 273.15)//.toFixed()
}

export function getTimeInLocalTime(timeStamp, timeZone) {
    let date = new Date(1000 * timeStamp);
    date.setHours(date.getHours() + timeZone/3600) // приводим отображение от 
    //вашей текущей часовой зоны к ЮТС, иначе бы показало время в вашем местном времени.
    let minutes = (date.getMinutes() >= 0 && date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes();
    return date.getUTCHours() + ":" + minutes; // не до конца понимаю что оно с чем приводит, 
    //но в итоге показывает местное время
}

export function getMonthAndDate(timeStamp) {
    const MONTH = ["Jan","Feb","March","Apr","May","June","July","August","Sep","Oct","Nov","Dec",];

    let date = new Date(1000 * timeStamp);
    return MONTH[date.getMonth()] + " " + date.getDate();
}

export const EL = {
	DIV: "div",
	CARD: "card",
	DATE: "date",
	TIME: "time",
	TEMP: "temperature",
	COND: "conditions",
	FEELS: "feels-like",
	IMG: "pic",
}

export function createEl(element, className) {
	let theElement = document.createElement(element);
	theElement.className = `forecast__${className}`
	return theElement;
}