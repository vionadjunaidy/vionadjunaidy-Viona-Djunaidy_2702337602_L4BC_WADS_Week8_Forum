import mongoose from 'mongoose';
import MongoModel from './MongoModel.js';

export const DataTypes = {
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE',
    JSON: 'JSON'
};

class MongoSequelize {
    constructor(uri, options = {}) {
        this.uri = uri;
        this.options = options;
    }

    async authenticate() {
        try {
            await mongoose.connect(this.uri);
            console.log("MongoDB connected successfully");
            return true;
        } catch (error) {
            console.error("MongoDB connection error:", error);
            throw error;
        }
    }

    define(modelName, schemaDefinition, options = {}) {
        return new MongoModel(modelName, schemaDefinition, options);
    }

    // Add sync method to maintain Sequelize-like API
    async sync() {
        // In MongoDB, we don't need to sync like in SQL databases
        // This is just a no-op to maintain API compatibility
        return Promise.resolve();
    }
}

export default MongoSequelize;