import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TodoForm = ({ addTodo }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const newTodo = {
        title: taskTitle,
        description: taskDescription,
        completed: false,
      };

      await addTodo(newTodo);

      setTaskTitle("");
      setTaskDescription("");
      setIsModalOpen(false);

      toast.success("Task added successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error creating todo:", error);
      toast.error("Failed to add task. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <button className="todo-btn" onClick={() => setIsModalOpen(true)}>
        Add Task
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="todo-input"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
              <textarea
                className="todo-textarea"
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <button className="todo-btn" type="submit">
                Done
              </button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TodoForm;
