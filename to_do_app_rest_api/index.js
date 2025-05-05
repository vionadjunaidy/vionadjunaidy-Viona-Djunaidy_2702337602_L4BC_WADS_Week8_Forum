import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swagger.js';
import dotenv from 'dotenv';
import process from 'node:process';
import todoRoutes from './routes/todoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './database.js';
// Import models to ensure they are registered with Mongoose
import './models/User.js';
import './models/Todo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customSiteTitle: "Todo App API",}));

// Connect to database
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.error('Database connection failed:', error));
