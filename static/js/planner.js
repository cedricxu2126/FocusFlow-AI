
document.addEventListener("DOMContentLoaded", () => {
    const generateButton = document.getElementById("generate-plan");

    const totalTasksElement = document.getElementById("total-tasks");
    const pendingTasksElement = document.getElementById("pending-tasks");
    const workloadElement = document.getElementById("workload-time");

    const recommendationsElement = document.getElementById("recommendations");
    const workloadInsightElement = document.getElementById("workload-insight");
    const breakInsightElement = document.getElementById("break-insight");

    // Convert workload minutes into hours and minutes.
    function formatWorkload(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${remainingMinutes} min`;
        }

        if (remainingMinutes === 0) {
            return `${hours} hr`;
        }

        return `${hours} hr ${remainingMinutes} min`;
    }

    // Retrieve planner recommendations from Flask.
    async function generatePlan() {
        generateButton.disabled = true;
        generateButton.textContent = "Generating...";

        try {
            const response = await fetch("/api/planner");

            if (!response.ok) {
                throw new Error("Unable to generate your plan.");
            }

            const data = await response.json();

            totalTasksElement.textContent = data.total_tasks;
            pendingTasksElement.textContent = data.pending_tasks;
            workloadElement.textContent = formatWorkload(
                data.estimated_workload
            );

            workloadInsightElement.textContent = data.workload_insight;
            breakInsightElement.textContent = data.break_recommendation;

            // Clear previous recommendations.
            recommendationsElement.replaceChildren();

            if (data.recommendations.length === 0) {
                recommendationsElement.textContent =
                    "You have no pending tasks. Great job!";
                return;
            }

            // Display each recommended task.
            data.recommendations.forEach(task => {
                const taskContainer = document.createElement("div");
                taskContainer.className = "task-item";

                const taskDetails = document.createElement("div");
                taskDetails.className = "task-details";

                const taskTitle = document.createElement("h4");
                taskTitle.textContent = task.title;

                const taskDescription = document.createElement("p");
                taskDescription.textContent =
                    task.description || "No description provided.";

                const taskInfo = document.createElement("span");
                taskInfo.className = "task-tag";
                taskInfo.textContent =
                    `${task.priority} Priority • ${task.due_status}`;

                const taskDuration = document.createElement("span");
                taskDuration.className = "task-tag";
                taskDuration.textContent = task.estimated_minutes
                    ? `${task.estimated_minutes} min`
                    : "Duration not set";

                taskDetails.append(
                    taskTitle,
                    taskDescription,
                    taskInfo,
                    taskDuration
                );

                taskContainer.appendChild(taskDetails);
                recommendationsElement.appendChild(taskContainer);
            });

        } catch (error) {
            console.error("Planner error:", error);

            workloadInsightElement.textContent =
                "Unable to generate recommendations. Please try again.";

        } finally {
            generateButton.disabled = false;
            generateButton.textContent = "Plan Updated!";
            setTimeout(() => {
            generateButton.textContent = "Generate my Plan";
            }, 1500);
        }
    }

    // Generate a plan when the page loads.
    generatePlan();

    // Allow the user to refresh recommendations.
    generateButton.addEventListener("click", generatePlan);
});
