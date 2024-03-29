let timerInterval;
let startTime;
let elapsedTime = 0;

const timerElement = document.querySelector('.timer');
const startButton = document.querySelector('.start-button');
const pauseButton = document.querySelector('.pause-button');
const stopButton = document.querySelector('.stop-button');

function startTimer() {
    console.log('Starting the timer');
    startTime = Date.now() - elapsedTime;
    updateTimerCss('start');
    timerInterval = setInterval(updateTimer, 1000); // Update timer every second
}

function pauseTimer() {
    console.log("Pausing Timer at %s", elapsedTime);
    clearInterval(timerInterval);
    updateTimerCss('pause');
}

function stopTimer() {
    clearInterval(timerInterval);
    console.log("Stopping Timer at %s", elapsedTime);
    elapsedTime = 0;
    updateTimerDisplay();
    updateTimerCss('stop');
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    const hours = Math.floor((elapsedTime / 1000 / 60 / 60) % 24);

    timerElement.textContent = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

/** Toggles between the CSS classes for the timerElement */
function updateTimerCss(scenario) {
    switch(scenario) {
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

// Event listeners for buttons
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
stopButton.addEventListener('click', stopTimer);