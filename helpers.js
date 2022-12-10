export function toCelcius(inKelvins) {
	return Math.round(inKelvins - 273.15)//.toFixed()
}

export function getTimeInLocalTime(timeStamp, timeZone) {
    let date = new Date(1000 * timeStamp);
    date.setHours(date.getHours() + timeZone/3600) // приводим отображение от 
    //вашей текущей часовой зоны к ЮТС, иначе бы показало время в вашем местном времени.
    let minutes = (date.getMinutes() >= 0 && date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes();
    let dateString = date.getUTCHours() + ":" + minutes; // не до конца понимаю что оно с чем приводит, 
    //но в итоге показывает местное время
    return dateString;
}

export function getMonthAndDate(timeStamp) {
    const MONTH = {
        0: "Jan",
        1: "Feb",
        2: "March",
        3: "Apr",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
    };

    let date = new Date(1000 * timeStamp);
    let monthAndDate = MONTH[date.getMonth()] + " " + date.getDate();
    return monthAndDate;
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