# FocusFlow AI – Testing Report

## 1. Introduction

This document summarizes the manual testing performed on FocusFlow AI to verify that its main features operate correctly and work together.

Testing was performed using the Flask development server and a desktop web browser.

## 2. Feature Testing

| Test | Expected Result | Actual Result |
|---|---|---|
| Open Dashboard | Dashboard loads successfully | Passed |
| Create Task | New task appears in task list | Passed |
| Edit Task | Task information updates | Passed |
| Complete Task | Task status changes to Completed | Passed |
| Filter Tasks | Pending and completed filters work | Passed |
| Delete Task | Selected task is removed | Passed |
| Task Persistence | Tasks remain after refreshing | Passed |
| AI Planner | Planner generates task recommendations | Passed |
| Focus Timer | Timer starts and counts down | Passed |
| Pause and Resume | Timer pauses and resumes correctly | Passed |
| Reset Focus Timer | Timer returns to its configured duration | Passed |
| Focus Session Tracking | Completed sessions are recorded | Passed |
| Break Timer | Break timer counts down correctly | Passed |
| Brain Teasers | Answers can be revealed and questions changed | Passed |
| Settings | Focus and break durations can be saved | Passed |
| Settings Persistence | Preferences remain after refreshing | Passed |
| Statistics | Task and focus statistics display correctly | Passed |
| Navigation | Sidebar links open all application pages | Passed |
| Visual Design | Cyberpunk styling displays across pages | Passed |

## 3. Integration Testing

The following integration checks were performed:

- Verified that the Settings page controls the durations displayed in Focus Mode and Break Activities.
- Verified that completed focus sessions appear in productivity statistics.
- Verified that task changes are reflected in the dashboard and statistics.
- Verified that navigation works between all seven application pages.
- Refreshed pages to confirm that database information and user preferences persist.

## 4. Results

All listed manual tests completed successfully.

The application successfully demonstrated task management, task planning, focus timers, break activities, productivity statistics, and persistent user settings.

## 5. Limitations

- The current planner uses rule-based task prioritization rather than generative AI.
- The optional OpenAI integration requires a separately configured API key and available API credits.
- Testing was performed manually in a local development environment.

## 6. Conclusion

Testing confirmed that the major application features function correctly and integrate with the SQLite database. FocusFlow AI is ready for demonstration and course submission.