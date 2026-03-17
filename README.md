#  TaskFlow

TaskFlow is a production-grade, full-stack Kanban task manager inspired by modern SaaS applications like Linear and Trello. It features a sleek dark-mode UI, complex drag-and-drop interactions, isolated project workspaces, and a high-performance REST API.

![TaskFlow Screenshot](./placeholder-for-your-screenshot.png) *(Replace with a screenshot of your board)*

##  Key Features

### Frontend (React / UI)
* **Advanced Drag & Drop:** Seamlessly reorder tasks within columns or move them across columns using `@dnd-kit`.
* **Multi-Project Workspaces:** Switch between different projects (e.g., Portfolio, TaskFlow, Research) with fully isolated task environments.
* **Analytics Dashboard:** Visual tracking of project completion percentages, pending high-priority tasks, and total task counts.
* **Dynamic Filtering:** Instantly filter tasks by search queries, priority levels, or deadlines (e.g., "Due Today", "High Priority").
* **Power-User Keyboard Shortcuts:**
  * `/` : Focus search bar
  * `P` : Toggle priority dropdown
  * `C` : Quick-create a new task
  * `Delete` / `Backspace` : Delete the actively selected task
  * `Escape` : Clear selections and close menus
* **Premium UI/UX:** Built with Tailwind CSS, featuring custom animated dropdowns, color-coded priority pill badges, and smooth hover states.

### Backend (FastAPI - *In Progress*)
* **RESTful API:** Lightning-fast endpoints built with Python and FastAPI.
* **Relational Database:** SQLAlchemy ORM managing SQLite (Development) / PostgreSQL (Production).
* **Data Integrity:** Pydantic models for strict type-checking and request validation.

---

##  Tech Stack

**Frontend:**
* React 18 (Vite)
* Tailwind CSS (v3)
* `@dnd-kit` (Core, Sortable, Utilities)
* Context API & Lifted State Management

**Backend:**
* Python 3.10+
* FastAPI
* SQLAlchemy & Pydantic
* Uvicorn (ASGI Server)

---

##  Getting Started (Local Development)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
\`\`\`

### 2. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the Vite development server.
\`\`\`bash
# Install dependencies
npm install

# Start the frontend dev server
npm run dev
\`\`\`
The frontend will be running at `http://localhost:5173`.

### 3. Backend Setup
*(Ensure you have Python installed)*. Navigate to the backend directory, set up your virtual environment, and start the FastAPI server.
\`\`\`bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run the Uvicorn server
uvicorn main:app --reload
\`\`\`
The backend API will be running at `http://localhost:8000`. 
Interactive API documentation (Swagger UI) is available at `http://localhost:8000/docs`.

---

##  Planned API Architecture

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetch all workspaces/projects |
| `GET` | `/api/tasks/{project_id}` | Fetch all tasks for a specific project |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/{task_id}` | Update task details (title, priority, due date) |
| `PATCH`| `/api/tasks/{task_id}/move`| Update a task's column status (drag-and-drop) |
| `DELETE`| `/api/tasks/{task_id}` | Permanently delete a task |

---

##  Architecture Notes
* **State Management:** The global state (`tasks`, `activeProjects`, `currentView`, `currentFilter`) is lifted to `App.jsx` to allow seamless switching between the Kanban Board and the Analytics Dashboard without losing data or causing unnecessary re-renders.
* **Event Propagation:** Deeply nested interactive elements (like the edit and delete buttons on a task card) utilize `e.stopPropagation()` to prevent the `dnd-kit` drag listeners from hijacking click events.

---
*Designed and built by [Aaditya Meher]*