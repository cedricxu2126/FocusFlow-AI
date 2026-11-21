
document.addEventListener("DOMContentLoaded", () => {
    console.log("Focus Mode JavaScript loaded successfully!");

    const timerDisplay = document.getElementById("timer-display");
    const statusDisplay = document.getElementById("timer-status");

    const startButton = document.getElementById("start-button");
    const pauseButton = document.getElementById("pause-button");
    const resetButton = document.getElementById("reset-button");

    const durationInput = document.getElementById("focus-duration");

    let timerInterval = null;
    let remainingSeconds = Number(durationInput.value) * 60;
    let isRunning = false;

    function updateDisplay() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        timerDisplay.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    async function loadFocusStats() {
        try {
            const response = await fetch("/api/focus/stats");
            if (!response.ok) throw new Error("Could not load statistics.");

            const stats = await response.json();

            document.getElementById("completed-sessions").textContent =
                stats.completed_sessions;

            document.getElementById("total-focus-time").textContent =
                `${stats.total_minutes} min`;
        } catch (error) {
            console.error("Error loading focus statistics:", error);
        }
    }

    async function saveFocusSession(duration) {
        try {
            const response = await fetch("/api/focus/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    duration_minutes: duration
                })
            });

            if (!response.ok) {
                throw new Error("Could not save focus session.");
            }

            await loadFocusStats();
        } catch (error) {
            console.error("Error saving focus session:", error);
            statusDisplay.textContent =
                "Session completed, but saving statistics failed.";
        }
    }

    function startTimer() {
        if (isRunning) return;

        if (remainingSeconds <= 0) {
            resetTimer();
        }

        const sessionDuration = Number(durationInput.value);

        isRunning = true;
        statusDisplay.textContent = "Stay focused!";

        startButton.disabled = true;
        pauseButton.disabled = false;

        timerInterval = setInterval(() => {
            remainingSeconds--;
            updateDisplay();

            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                isRunning = false;

                statusDisplay.textContent =
                    "Great work! Your focus session is complete!";

                startButton.disabled = false;
                pauseButton.disabled = true;

                saveFocusSession(sessionDuration);
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;

        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;

        statusDisplay.textContent = "Session paused.";
        startButton.disabled = false;
        pauseButton.disabled = true;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;

        const duration = Number(durationInput.value);

        if (!Number.isInteger(duration) || duration < 1 || duration > 180) {
            durationInput.value = 25;
            remainingSeconds = 25 * 60;
        } else {
            remainingSeconds = duration * 60;
        }

        statusDisplay.textContent = "Ready to focus?";
        startButton.disabled = false;
        pauseButton.disabled = true;

        updateDisplay();
    }

    durationInput.addEventListener("change", () => {
        if (!isRunning) {
            resetTimer();
        }
    });

    startButton.addEventListener("click", startTimer);
    pauseButton.addEventListener("click", pauseTimer);
    resetButton.addEventListener("click", resetTimer);

    updateDisplay();
    loadFocusStats();
});
