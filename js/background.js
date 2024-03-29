let timerInterval;
let startTime;
let elapsedTime = 0;

let isTimerOn = false;
let isTimerPaused = false;

/** Service worker events listener. */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action == 'timerStatus') {
        console.log("Received timer status request");
        sendTimerStatus();
    }

    if(message.action == 'popupClosed') {
        console.log('popup closed');
    }
    if (message.action == 'startTimer') {
        isTimerOn = true;
        isTimerPaused = false;
        elapsedTime == 0 ? console.log('Starting the timer') : console.log('Restarting the timer at %s', elapsedTime);
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 1000) // Updates timer every second.
    }

    if (message.action == 'pauseTimer') {
        isTimerOn = false;
        isTimerPaused = true;
        console.log('Pausing the timer at %s', elapsedTime);
        clearInterval(timerInterval);
    }

    if (message.action == 'stopTimer') {
        isTimerOn = false;
        isTimerPaused = false;
        console.log("Stopping Timer at %s", elapsedTime);
        clearInterval(timerInterval);
        elapsedTime = 0;
        updateTimerValue();
    }
});

/** Updates the elapsedTime property and updates timer value. */
function updateTimer() {
    elapsedTime = Date.now() - startTime;
    updateTimerValue();
}

/** Computes the hours, minutes and seconds to show on the timer and then sends the value to popup.js. */
function updateTimerValue() {
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    const hours = Math.floor((elapsedTime / 1000 / 60 / 60) % 24);
    console.log('Sending updated time value to popup');
    chrome.runtime.sendMessage({ action: 'updateTimerDOM', data: { hours, minutes, seconds }});
}

function sendTimerStatus(){
    updateTimerValue();
    chrome.runtime.sendMessage({action: 'timerStatus', data: {isTimerOn, isTimerPaused}});
}