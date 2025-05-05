import mongoose from 'mongoose';

class MongoModel {
    constructor(modelName, schemaDefinition, options = {}) {
        const mongooseSchema = this._convertToMongooseSchema(schemaDefinition);
        
        const schema = new mongoose.Schema(mongooseSchema, {
            timestamps: options.timestamps || false
        });

        // Add pre-save middleware
        if (options.preSave) {
            schema.pre('save', options.preSave);
        }

        // Add instance methods
        if (options.instanceMethods) {
            Object.entries(options.instanceMethods).forEach(([methodName, method]) => {
                schema.methods[methodName] = method;
            });
        }

        // Add schema methods to check if password is modified with suppressWarning
        schema.method('isModified', function(path) {
            return this.isModified(path);
        }, { suppressWarning: true });

        this.model = mongoose.model(modelName, schema);
    }

    _convertToMongooseSchema(definition) {
        const converted = {};
        for (const [key, value] of Object.entries(definition)) {
            converted[key] = this._convertField(value);
        }
        return converted;
    }

    _convertField(field) {
        const typeMap = {
            'STRING': String,
            'NUMBER': Number,
            'BOOLEAN': Boolean,
            'DATE': Date,
            'JSON': mongoose.Schema.Types.Mixed,
        };

        const schemaField = {
            type: field.ref ? mongoose.Schema.Types.ObjectId : typeMap[field.type?.toString()] || String,
            required: !field.allowNull,
        };

        if (field.ref) {
            schemaField.ref = field.ref;
        }

        if (field.unique) schemaField.unique = true;
        if (field.defaultValue !== undefined) schemaField.default = field.defaultValue;
        
        if (field.validate) {
            const validators = [];
            if (field.validate.isEmail) {
                validators.push({
                    validator: function(v) {
                        return /\S+@\S+\.\S+/.test(v);
                    },
                    message: props => `${props.value} is not a valid email address!`
                });
            }
            if (validators.length > 0) {
                schemaField.validate = validators;
            }
        }

        return schemaField;
    }

    async findAll(options = {}) {
        if (options.include) {
            return this.model.findWithPopulate(options.where || {}, options.include);
        }
        return this.model.find(options.where || {});
    }

    async findOne(options = {}) {
        let query = this.model.findOne(options.where || {});
        if (options.include) {
            query = query.populate(options.include);
        }
        if (options.select) {
            query = query.select(options.select);
        }
        return query;
    }

    async findByPk(id) {
        return this.model.findById(id);
    }

    async create(data) {
        return this.model.create(data);
    }

    async update(data, options = {}) {
        const query = options.where || { _id: data.id };
        return this.model.findOneAndUpdate(query, data, { new: true });
    }

    async destroy(options = {}) {
        return this.model.deleteMany(options.where || {});
    }
}

export default MongoModel;