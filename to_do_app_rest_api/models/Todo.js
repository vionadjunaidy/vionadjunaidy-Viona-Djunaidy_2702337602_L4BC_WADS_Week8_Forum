import MongoModel from '../utils/MongoModel.js';
import { DataTypes } from '../utils/MongoSequelize.js';

const todoSchema = {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isEditing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
        ref: 'User'
    }
};

const options = {
    timestamps: true
};

const Todo = new MongoModel('Todo', todoSchema, options);

export default Todo.model;
