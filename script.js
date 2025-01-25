class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        this.isNewSession = true;  // Add this flag

        // DOM elements
        this.timeDisplay = document.getElementById('time');
        this.startPauseButton = document.getElementById('startPause');
        this.resetButton = document.getElementById('reset');
        this.addFiveButton = document.getElementById('addFive');
        this.focusTaskDisplay = document.getElementById('focus-task');

        // Event listeners
        this.startPauseButton.addEventListener('click', () => this.handleStart());
        this.resetButton.addEventListener('click', () => this.reset());
        this.addFiveButton.addEventListener('click', () => this.addFiveMinutes());

        // Set initial button state
        this.updateButtonState();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update the display on the page
        this.timeDisplay.textContent = timeString;
        
        // Update the browser tab title
        document.title = this.isRunning 
            ? `(${timeString}) Pomodoro Timer`
            : 'Pomodoro Timer';
    }

    toggleStartPause() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
        this.updateButtonState();
    }

    updateButtonState() {
        if (this.isRunning) {
            this.startPauseButton.textContent = 'Pause';
            this.startPauseButton.classList.remove('start-button');
            this.startPauseButton.classList.add('pause-button');
        } else {
            this.startPauseButton.textContent = 'Start';
            this.startPauseButton.classList.remove('pause-button');
            this.startPauseButton.classList.add('start-button');
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();

                if (this.timeLeft === 0) {
                    this.pause();
                    alert('Pomodoro session completed!');
                    this.reset();
                }
            }, 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        this.timeLeft = 25 * 60;
        this.isNewSession = true;  // Set flag to true on reset
        this.focusTaskDisplay.textContent = '';  // Clear the focus task
        this.updateDisplay();
        this.updateButtonState();
    }

    addFiveMinutes() {
        this.timeLeft += 5 * 60;
        this.updateDisplay();
    }

    async handleStart() {
        if (!this.isRunning) {
            if (this.isNewSession) {
                const task = await this.askForTask();
                if (task) {
                    this.focusTaskDisplay.textContent = `Focus: ${task}`;
                    this.isNewSession = false;
                    this.toggleStartPause();
                }
            } else {
                this.toggleStartPause();
            }
        } else {
            this.toggleStartPause();
        }
    }

    askForTask() {
        return new Promise((resolve) => {
            const task = prompt('What would you like to focus on?');
            resolve(task);
        });
    }
}

// Initialize the timer
const timer = new PomodoroTimer(); 