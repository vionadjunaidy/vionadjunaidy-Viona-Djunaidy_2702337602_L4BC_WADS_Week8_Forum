import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios to make HTTP requests
import { toast } from "react-toastify"; // Import toast from react-toastify

const TodoItem = ({ task, editTodo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullTask, setFullTask] = useState(null); // Store full task details
  const [localTask, setLocalTask] = useState(task); // Added local state for task

  const handleViewClick = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      // Fetch the full task details from the API
      const response = await axios.get(`http://localhost:3000/api/todos/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
      });

      setFullTask(response.data); // Set the full task details in state
      setIsModalOpen(true); // Open the modal to display the task details
    } catch (error) {
      console.error("Error fetching task details:", error.response?.data || error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      await axios.delete(`http://localhost:3000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });

      console.log(`Todo with ID ${id} deleted successfully`);
      toast.success("Task deleted successfully!", { position: "top-center" });
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting todo:", error.response?.data || error.message);
      toast.error("Failed to delete task. Please try again.", { position: "top-center" });
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      await axios.put(
        `http://localhost:3000/api/todos/${id}`,
        { completed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Todo completion status updated successfully");
    } catch (error) {
      console.error("Error updating todo completion status:", error.response?.data || error.message);
    }
  };

  return (
    <div className="Todo">
      <div className="todo-item">
        <input
          type="checkbox"
          checked={localTask.completed}
          onChange={async () => {
            await toggleComplete(localTask._id, !localTask.completed);
            setLocalTask((prevTask) => ({ ...prevTask, completed: !prevTask.completed })); 
          }}
          className={`checkbox ${localTask.completed ? 'completed' : ''}`} 
        />
        <div className="todo-content">
          <h3 className={localTask.completed ? "completed" : ""}>{localTask.title}</h3>
          <p>
            {localTask.description.length > 30
              ? `${localTask.description.slice(0, 30)}...`
              : localTask.description}
          </p>

          <div className="icons">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => editTodo(localTask._id, { isEditing: true })}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={() => deleteTodo(localTask._id)}
            />
            <button className="view-btn" onClick={handleViewClick}>
              View
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && fullTask && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>{fullTask.title}</h2>
            <p>{fullTask.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
