# TaskFlow

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-F6C31C?style=for-the-badge)

TaskFlow is a production-grade, full-stack Kanban task manager inspired by modern SaaS applications like Linear and Trello. It features a sleek dark-mode UI, complex drag-and-drop interactions, isolated project workspaces, and a high-performance REST API powered by Python and FastAPI.



## ✨ Key Features

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

### Backend (FastAPI - In Progress)
* **RESTful API:** Lightning-fast endpoints built with Python and FastAPI.
* **Relational Database:** SQLite for development, scaling to PostgreSQL for production.
* **Data Integrity:** Pydantic models for strict type-checking and request validation.

---

## 🛠️ Tech Stack

**Frontend:**
* React 18 (Vite)
* Tailwind CSS (v3)
* `@dnd-kit` (Core, Sortable, Utilities)
* Context API & Lifted State Management

**Backend:**
* Python 3.10+
* FastAPI
* SQLite / PostgreSQL
* SQLAlchemy & Pydantic
* Uvicorn (ASGI Server)

---

## 🚀 Getting Started (Local Development)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/taskflow.git](https://github.com/yourusername/taskflow.git)
cd taskflow
