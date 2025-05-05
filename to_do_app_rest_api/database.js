import process from 'node:process';
import dotenv from 'dotenv';
import MongoSequelize from './utils/MongoSequelize.js';

dotenv.config();

const sequelize = new MongoSequelize(process.env.MONGO_URI);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        return sequelize;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export { connectDB, sequelize };