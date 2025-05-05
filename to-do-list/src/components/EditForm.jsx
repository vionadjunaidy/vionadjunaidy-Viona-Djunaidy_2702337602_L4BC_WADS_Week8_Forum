import { useState } from "react";
import React from "react";
import axios from "axios";

const EditForm = ({ task, editTodo, hideCloseButton }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isModalOpen, setIsModalOpen] = useState(true);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTodo = { title, description, completed: task.completed, isEditing: false };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      const response = await axios.patch(
        `http://localhost:3000/api/todos/${task._id}`,
        updatedTodo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Updated Todo:", response.data);
      editTodo(task._id, response.data);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating todo:", error.response?.data || error.message);
    }
  };

  return (
    isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          {!hideCloseButton && (
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
          )}
          <h2>Edit Task</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="todo-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              required
            />
            <textarea
              className="todo-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description"
            />
            <button className="todo-btn" type="submit">
              Done
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default EditForm;
