const timerElement = document.querySelector('.timer');
const startButton = document.querySelector('.start-button');
const pauseButton = document.querySelector('.pause-button');
const stopButton = document.querySelector('.stop-button');

/** Sends message to service worker to update time. */
function startTimer() {
    chrome.runtime.sendMessage({ action: 'startTimer' });
    updateTimerCss('start');
}

function pauseTimer() {
    chrome.runtime.sendMessage({ action: 'pauseTimer' });
    updateTimerCss('pause');
}

function stopTimer() {
    chrome.runtime.sendMessage({ action: 'stopTimer' });
    updateTimerCss('stop');
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

/** Toggles between the CSS classes for the timerElement */
function updateTimerCss(scenario) {
    switch (scenario) {
        case 'start':
            timerElement.classList.remove('red-text');
            timerElement.classList.add('green-text');
            break;
        case 'pause':
            timerElement.classList.remove('green-text');
            timerElement.classList.add('red-text');
            break;
        case 'stop':
            timerElement.classList.remove('green-text');
            timerElement.classList.remove('red-text');
            break;
        default:
            console.error("Invalid scenario %s", scenario);
    }
}

function updateTimer(isTimerOn, isTimerPaused) {
    if(isTimerOn == true) {
        updateTimerCss('start');
    } else if(isTimerPaused) {
        updateTimerCss('pause');
    }
}

/** Event Listener */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message received: %s', message.action);
    if (message.action === 'updateTimerDOM') {
        // Update value of timer.
        timerElement.textContent = formatTime(message.data.hours) + ':' + formatTime(message.data.minutes) + ':' + formatTime(message.data.seconds);
    }
    if(message.action === 'timerStatus') {
        // If timer was already active then update timer's CSS.
        updateTimer(message.data.isTimerOn, message.data.isTimerPaused);
    }
});

// Event listeners for buttons
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', stopTimer);

// Checks if timer was active.
chrome.runtime.sendMessage({ action: 'timerStatus' });