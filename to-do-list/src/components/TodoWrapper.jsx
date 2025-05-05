import React, { useEffect, useState } from "react";
import EditForm from "./EditForm";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import axios from "axios"; // Axios for making API calls
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import profilePic from "../assets/profile.jpg";

const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        console.error("No token found. User is not authenticated.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTodos(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching todos:", error.response?.data || error.message);
        setError("Failed to fetch todos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (todo) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/todos",
        todo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTodos((prevTodos) => [...prevTodos, response.data]);
    } catch (error) {
      console.error("Error adding todo:", error.response?.data || error.message);
    }
  };

  const deleteTodo = async (id) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id) => {
    if (!token) return;

    const todoToUpdate = todos.find((todo) => todo._id === id);
    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    try {
      await axios.patch(`http://localhost:3000/api/todos/${id}`, updatedTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const editTask = async (id, updatedFields) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/todos/${id}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, ...response.data } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:5173/login";
  };

  return (
    <div className="todo-wrapper">
      <div className="header">
        <h1 className="title">
          <Link to="/todo" style={{ textDecoration: "none", color: "black" }}>
            {user?.firstName ? `${user.firstName}'s Todo List` : "Todo List"}
          </Link>
        </h1>

        <div className="profile-container">
          <img
            src={user?.profilePicture || profilePic}
            alt="Profile"
            className="profile-pic"
            onClick={() => setShowProfile(!showProfile)}
          />
          {showProfile && (
            <div className="profile-popup">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Full Name:</strong> {user?.firstName} {user?.lastName}
              </p>
              <p
                className="clickable-text"
                onClick={() => navigate("/profile")}
              >
                Profile Details
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="todo-form-container">
        <TodoForm addTodo={addTodo} />
      </div>
      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : todos.length === 0 ? (
        <div className="no-todos">No todos found. Add your first todo!</div>
      ) : (
        <div className="todo-grid">
          {todos.map((todo) =>
            todo.isEditing ? (
              <EditForm editTodo={editTask} task={todo} key={todo._id} hideCloseButton={true} />
            ) : (
              <TodoItem
                key={todo._id}
                task={todo}
                editTodo={editTask}
                deleteTodo={deleteTodo}
                toggleComplete={toggleComplete}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TodoWrapper;
