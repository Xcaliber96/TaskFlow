import os
import json
import datetime
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, TIMESTAMP


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="todo")
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    project = Column(String(100), nullable=False) 


class OutboxEvent(Base):
    __tablename__ = "outbox_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(255), nullable=False)
    payload = Column(Text, nullable=False)
    processed = Column(Boolean, default=False)

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: str = "todo"
    priority = Column(String, default="Low")
    project: str


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    priority = Column(String, default="Low")
    project: str

    model_config = {
        "from_attributes": True
    
    }  

Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/tasks/", response_model=list[TaskResponse])
def get_tasks(project: str = None, db: Session = Depends(get_db)):
    if project:
        return db.query(Task).filter(Task.project == project).all()
    return db.query(Task).all()


@app.post("/tasks/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        project=task.project
    )

    event = OutboxEvent(
        event_type="task_created",
        payload=json.dumps({
            "title": task.title,
            "description": task.description,
            "status": task.status
        }),
        processed=False
    )

    db.add(db_task)
    db.add(event)
    db.commit()
    db.refresh(db_task)

    return db_task

@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.title is not None:
        db_task.title = task.title
    if task.description is not None:
        db_task.description = task.description
    if task.status is not None:
        db_task.status = task.status

    event = OutboxEvent(
        event_type="task_updated",
        payload=json.dumps({
            "id": db_task.id,
            "title": db_task.title,
            "description": db_task.description,
            "status": db_task.status
        }),
        processed=False
    )

    db.add(event)
    db.flush()  
    db.commit()
    db.refresh(db_task)

    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    event = OutboxEvent(
        event_type="task_deleted",
        payload=json.dumps({"id": task_id}),
        processed=False
    )

    db.delete(db_task)
    db.add(event)
    db.commit()

    return {"detail": "Task deleted"}