import Todo from '../models/Todo.js';

// GET all todos for the logged-in user
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ owner: req.user._id }); // Fetch todos for the logged-in user
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single todo by ID (only if owned by the user)
const getTodoById = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ _id: id, owner: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new todo (automatically associated with the logged-in user)
const createTodo = async (req, res) => {
  const { title, description } = req.body;

  try {
    const todo = new Todo({
      title,
      description,
      owner: req.user._id, // Associate the todo with the logged-in user
    });

    const newTodo = await todo.save();
    res.status(201).json(newTodo); // Respond with the created todo
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE a todo (only if owned by the user)
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, isEditing } = req.body;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { title, description, completed, isEditing },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a todo (only if owned by the user)
const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({ _id: id, owner: req.user._id });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    console.log(`Todo with ID ${id} deleted successfully`); // Log successful deletion
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};
