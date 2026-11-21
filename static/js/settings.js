
document.addEventListener("DOMContentLoaded", () => {
    const focusInput = document.getElementById("focus-duration");
    const breakInput = document.getElementById("break-duration");
    const saveButton = document.getElementById("save-settings");
    const message = document.getElementById("settings-message");

    saveButton.addEventListener("click", async () => {
        const focusDuration = Number(focusInput.value);
        const breakDuration = Number(breakInput.value);

        if (
            !Number.isInteger(focusDuration) ||
            focusDuration < 1 ||
            focusDuration > 180
        ) {
            message.textContent =
                "Focus duration must be between 1 and 180 minutes.";
            return;
        }

        if (
            !Number.isInteger(breakDuration) ||
            breakDuration < 1 ||
            breakDuration > 60
        ) {
            message.textContent =
                "Break duration must be between 1 and 60 minutes.";
            return;
        }

        saveButton.disabled = true;
        message.textContent = "Saving...";

        try {
            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    focus_duration: focusDuration,
                    break_duration: breakDuration
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not save settings.");
            }

            message.textContent = "Settings saved successfully!";

        } catch (error) {
            message.textContent = error.message;
        } finally {
            saveButton.disabled = false;
        }
    });
});
