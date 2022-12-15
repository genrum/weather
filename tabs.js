const weatherButtons = document.querySelector('.weather__buttons');
const weatherButtonAll = Array.from( document.querySelectorAll('.weather__button'));
const weatherTabs = document.querySelector('.weather__tabs');
const weatherTabAll = document.querySelectorAll('.weather__tab');

weatherButtons.addEventListener("click", function (event) {
	const clickButton = event.target;
	if (checkClickTabs(clickButton)){
		changeTabs(clickButton);
	}
});

function checkClickTabs(clickButton) {
	const clickButtonParent = clickButton.closest(".weather__button");
	const activeClickElementParent = clickButtonParent.classList.contains("-active");
	return clickButtonParent && !activeClickElementParent
}

function changeTabs(clickButton) {
	const activeButton = weatherButtons.querySelector('.weather__button.-active');
	activeButton.classList.remove("-active");
	clickButton.classList.add("-active");
	const indexClickButton = weatherButtonAll.findIndex(item => item === clickButton);
	const activeTab = weatherTabs.querySelector('.weather__tab.-active');
	activeTab.classList.remove("-active");
	const newActiveTab = weatherTabAll[indexClickButton];
	newActiveTab.classList.add("-active");
}