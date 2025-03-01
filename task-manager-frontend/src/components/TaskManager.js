import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import "./TaskManager.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/tasks").then((response) => {
      setTasks(response.data);
    });
  }, []);

  const addTask = () => {
    if (newTask.trim() === "") return;
    axios.post("http://localhost:8080/tasks", { title: newTask, description: newDescription, completed: false }).then((response) => {
      setTasks([...tasks, response.data]);
      setNewTask("");
      setNewDescription("");
    });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:8080/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  const toggleTaskCompletion = (id, completed) => {
    const taskToUpdate = tasks.find(task => task.id === id); // Find the task

    axios.put(`http://localhost:8080/tasks/${id}`, {
      title: taskToUpdate.title,
      description: taskToUpdate.description,
      completed: !completed
    })
    .then(() => {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !completed } : task
      ));
    })
    .catch(error => console.error("Error updating task:", error));
  };


  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const saveEdit = (id) => {
    axios.put(`http://localhost:8080/tasks/${id}`, { title: editedTitle, description: editedDescription }).then(() => {
      setTasks(tasks.map(task => task.id === id ? { ...task, title: editedTitle, description: editedDescription } : task));
      setEditingTaskId(null);
    });
  };

  return (
    <div className="task-manager-container">
      <h1 className="task-manager-title">Tamil's Task Manager</h1>

      {/* Task Input Section */}
      <div className="task-input-container">
        <input
          type="text"
          placeholder="Enter task title..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter task description..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={addTask} className="add-task-btn">Add Task</button>
      </div>

      {/* 📌 Task Cards */}
      <div className="task-list">
        {tasks
        .sort((a, b) => a.completed - b.completed)// Moves completed tasks to the end
        .map((task) => (
          <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={`task-card ${task.completed ? "task-completed" : ""}`}>

              {/* 📌 Task Title & Icons */}
              <div className="task-actions">
                {!task.completed && (
                  <>
                    <button onClick={() => toggleTaskCompletion(task.id, task.completed)} className="complete-btn">
                      <Check size={16} />
                    </button>
                    {editingTaskId === task.id ? (
                      <button onClick={() => saveEdit(task.id)} className="edit-btn">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => startEditing(task)} className="edit-btn">
                        <Edit size={16} />
                      </button>
                    )}
                  </>
                )}
                <button onClick={() => deleteTask(task.id)} className="delete-btn">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* 🎯 Task Content */}
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="task-title"
                  />
                  <input
                    type="text"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="task-description"
                  />
                </>
              ) : (
                <>
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Footer */}
        <div className="footer">
          Designed & Developed by Tamil
        </div>
    </div>
  );
};

export default TaskManager;
