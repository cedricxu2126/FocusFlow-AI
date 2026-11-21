
document.addEventListener("DOMContentLoaded", () => {

    // BREAK TIMER
    const timerDisplay = document.getElementById("break-timer-display");
    const durationInput = document.getElementById("break-duration");
    const startButton = document.getElementById("break-start");
    const pauseButton = document.getElementById("break-pause");
    const resetButton = document.getElementById("break-reset");
    const statusDisplay = document.getElementById("break-status");

    let remainingSeconds = Number(durationInput.value) * 60;
    let timerInterval = null;
    let isRunning = false;

    function updateTimerDisplay() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        timerDisplay.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function resetBreakTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;

        const duration = Number(durationInput.value);

        if (!Number.isInteger(duration) || duration < 1 || duration > 60) {
            durationInput.value = 5;
            remainingSeconds = 5 * 60;
        } else {
            remainingSeconds = duration * 60;
        }

        statusDisplay.textContent = "Ready for a break?";
        startButton.disabled = false;
        pauseButton.disabled = true;

        updateTimerDisplay();
    }

    function startBreakTimer() {
        if (isRunning) return;

        if (remainingSeconds <= 0) {
            resetBreakTimer();
        }

        isRunning = true;
        statusDisplay.textContent = "Enjoy your break!";

        startButton.disabled = true;
        pauseButton.disabled = false;

        timerInterval = setInterval(() => {
            remainingSeconds--;
            updateTimerDisplay();

            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                isRunning = false;

                statusDisplay.textContent = "Break finished! Ready to get back to work?";
                startButton.disabled = false;
                pauseButton.disabled = true;
            }
        }, 1000);
    }

    function pauseBreakTimer() {
        if (!isRunning) return;

        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;

        statusDisplay.textContent = "Break paused.";
        startButton.disabled = false;
        pauseButton.disabled = true;
    }

    durationInput.addEventListener("change", () => {
        if (!isRunning) {
            resetBreakTimer();
        }
    });

    startButton.addEventListener("click", startBreakTimer);
    pauseButton.addEventListener("click", pauseBreakTimer);
    resetButton.addEventListener("click", resetBreakTimer);

    updateTimerDisplay();


    // BRAIN TEASERS
    const teasers = [
        {
            question: "What has keys but cannot open locks?",
            answer: "A piano!"
        },
        {
            question: "What has to be broken before you can use it?",
            answer: "An egg!"
        },
        {
            question: "What gets wetter the more it dries?",
            answer: "A towel!"
        },
        {
            question: "What has a head and a tail but no body?",
            answer: "A coin!"
        },
        {
            question: "What has cities but no houses, forests but no trees, and rivers but no water?",
            answer: "A map!"
        },
        {
            question: "What can travel around the world while staying in one corner?",
            answer: "A postage stamp!"
        }
    ];

    let currentTeaser = 0;

    const questionDisplay = document.getElementById("teaser-question");
    const answerDisplay = document.getElementById("teaser-answer");
    const numberDisplay = document.getElementById("teaser-number");
    const revealButton = document.getElementById("show-answer");
    const nextButton = document.getElementById("next-teaser");

    function displayTeaser() {
        questionDisplay.textContent = teasers[currentTeaser].question;
        answerDisplay.textContent = teasers[currentTeaser].answer;
        numberDisplay.textContent =
            `Question ${currentTeaser + 1}`;

        answerDisplay.hidden = true;
        revealButton.disabled = false;
    }

    revealButton.addEventListener("click", () => {
        answerDisplay.hidden = false;
        revealButton.disabled = true;
    });

    nextButton.addEventListener("click", () => {
        currentTeaser = (currentTeaser + 1) % teasers.length;
        displayTeaser();
    });

    displayTeaser();
});
