# FocusFlow AI – Project Requirements

## 1. Problem Statement

Students and other busy individuals often struggle to organize their responsibilities, prioritize tasks, and maintain consistent productivity. Managing multiple deadlines can become overwhelming, while working for extended periods without structured breaks can make it difficult to stay focused.

FocusFlow AI addresses these challenges by providing a centralized productivity application that helps users manage tasks, organize their workload, track focus sessions, and schedule breaks.

## 2. Project Objectives

The primary objectives of FocusFlow AI are:

- Provide an organized system for creating and managing tasks.
- Help users prioritize tasks based on importance and deadlines.
- Provide customizable focus and break timers.
- Encourage productive breaks through recreational brain teasers.
- Track task completion and focus-session statistics.
- Allow users to personalize timer settings.
- Provide a simple, visually appealing interface.

## 3. Functional Requirements

### 3.1 Task Management
- Users must be able to create new tasks.
- Users must be able to edit existing tasks.
- Users must be able to delete tasks.
- Users must be able to mark tasks as completed.
- Users must be able to filter tasks by completion status.
- Tasks must support descriptions, priorities, due dates, and estimated durations.

### 3.2 AI Planner
- The application must retrieve pending tasks.
- The planner must evaluate task priorities.
- The planner must consider approaching due dates.
- The planner must organize tasks into a recommended order.
- The planner must provide workload insights and break recommendations.

### 3.3 Focus Mode
- Users must be able to start, pause, and reset a focus timer.
- Users must be able to customize focus duration.
- Completed focus sessions must be recorded.
- Focus-session statistics must be available.

### 3.4 Break Activities
- Users must be able to start, pause, and reset a break timer.
- Users must be able to customize break duration.
- The application must provide interactive brain teasers.
- Users must be able to reveal answers and move between questions.

### 3.5 Statistics
- The application must display total tasks.
- The application must display completed and pending tasks.
- The application must calculate task completion percentage.
- The application must display completed focus sessions and total focus time for the current day.

### 3.6 Settings
- Users must be able to customize focus duration.
- Users must be able to customize break duration.
- Settings must persist after refreshing or restarting the application.

## 4. Nonfunctional Requirements

- **Usability:** The interface should be easy to navigate.
- **Performance:** Pages and application features should respond promptly.
- **Reliability:** Task information and settings should persist in the database.
- **Security:** Database queries should use parameterized SQL statements, and private configuration files must not be committed to GitHub.
- **Maintainability:** Application functionality should be separated into organized Python modules.
- **Compatibility:** The application should work in modern desktop web browsers.

## 5. System Design

FocusFlow AI uses a client-server architecture.

- **Frontend:** HTML, CSS, and JavaScript provide the user interface and interactive functionality.
- **Backend:** Python and Flask handle application routes, business logic, and API requests.
- **Database:** SQLite stores tasks, focus sessions, and user settings.
- **Planner Logic:** A rule-based algorithm evaluates task priority and due-date urgency to generate recommendations.

The application is organized into separate route modules for task management, planning, focus sessions, break activities, statistics, and settings.

## 6. Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Web application framework |
| SQLite | Database storage |
| HTML | Page structure |
| CSS | Visual styling |
| JavaScript | Interactive functionality |
| Git | Version control |
| GitHub | Source code hosting |
| PyCharm | Development environment |

An optional OpenAI integration module is included for possible future expansion. The current planner operates using rule-based logic and does not require a paid AI API.

## 7. Development Timeline

| Development Stage | Planned Work |
|---|---|
| Stage 1 | Project planning and initial setup |
| Stage 2 | Database design and task management |
| Stage 3 | Planner and recommendation functionality |
| Stage 4 | Focus Mode and Break Activities |
| Stage 5 | Statistics and Settings |
| Stage 6 | Integrated testing and debugging |
| Stage 7 | Interface redesign and documentation |
| Stage 8 | Final testing and GitHub submission |

## 8. Expected Outcome

The completed application will provide a centralized productivity platform where users can organize tasks, receive planning recommendations, manage focus sessions, take timed breaks, and monitor their productivity through statistics.

The goal is to make workload management more organized and help users develop consistent productivity habits.